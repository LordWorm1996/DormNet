use colored::Colorize;
use dialoguer::{Confirm, Input};
use os_info;
use random_string::generate;
use std::fs::{self, File};
use std::io::Write;
use std::process::Command;

fn main() {
    println!(
        "{}",
        "Welcome to the DormNet installer for your Linux Container/VM"
            .green()
            .bold()
            .to_string()
    );

    println!(
        "{}",
        "Starting Initial Cleanup...".yellow().bold().to_string()
    );

    cleanup_env_file();

    let env_path = "../dormnet/.env";
    let mut env_file = File::create(env_path).unwrap_or_else(|e| {
        println!("Error writing to .env: {}", e);
        cleanup_env_file();
        std::process::exit(1);
    });

    mongo_uri(&mut env_file);
    session_password(&mut env_file);
    next_build();

    let info = os_info::get();

    match info.os_type() {
        os_info::Type::Windows => {
            println!(
                "{}",
                "Running Windows-specific code and Initial Cleanup..."
                    .yellow()
                    .to_string()
            );
            windows_cleanup();
            windows_install(env_path);
        }
        os_info::Type::Linux => {
            println!(
                "{}",
                "Running Linux-specific code and Initial Cleanup..."
                    .yellow()
                    .to_string()
            );
            cleanup_systemd_file();
            linux_install(env_path);
        }
        _ => {
            println!(
                "{}",
                "Unsupported OS, this installer only work for Linux and Windows! Aborting..."
                    .bold()
                    .red()
                    .to_string()
            );
            cleanup_env_file();
            std::process::exit(1);
        }
    }
}

fn cleanup_env_file() {
    let env_path = "../dormnet/.env";
    if fs::remove_file(env_path).is_ok() {
        println!("{}", "Cleaned up .env file.".bold().green().to_string());
    } else {
        println!(
            "{}",
            "No .env file to remove or failed to delete."
                .bold()
                .red()
                .to_string()
        );
    }
}

fn cleanup_systemd_file() {
    let service_path = format!("/etc/systemd/system/dormnet.service");
    if fs::remove_file(service_path).is_ok() {
        println!("{}", "Cleaned up systemd file.".bold().green().to_string());
    } else {
        println!(
            "{}",
            "No systemd file to remove or failed to delete."
                .bold()
                .red()
                .to_string()
        );
    }
}

fn windows_cleanup() {
    println!(
        "{}",
        "Cleaning up Windows service...".bold().yellow().to_string()
    );

    let stop_status = Command::new("cmd")
        .args(&["/C", "nssm stop DormNet"])
        .status()
        .unwrap_or_else(|_| {
            println!("{}", "Service not running or already stopped".yellow());
            std::process::exit(0)
        });

    if !stop_status.success() {
        println!(
            "{}",
            "Failed to stop service, attempting to remove anyway".yellow()
        );
    }

    let remove_status = Command::new("cmd")
        .args(&["/C", "nssm remove DormNet confirm"])
        .status()
        .unwrap_or_else(|e| {
            println!("Failed to remove service: {}", e);
            std::process::exit(1)
        });

    if remove_status.success() {
        println!("{}", "Successfully removed DormNet service".green().bold());
    } else {
        println!("{}", "Failed to remove service".red().bold());
        std::process::exit(1);
    }
    let batch_file = "install_dormnet_service.bat";
    if fs::remove_file(batch_file).is_ok() {
        println!("{}", "Removed installation script".green());
    } else {
        println!("{}", "No installation script to remove".yellow());
    }
}

fn mongo_uri(env_file: &mut File) {
    let mongo_uri: String = loop {
        let input_uri: String = Input::new()
            .with_prompt("Please Enter your MongoDB URI: ")
            .interact_text()
            .unwrap();

        let confirmation = Confirm::new()
            .with_prompt(
                format!("Is this the correct URI?: {}", input_uri)
                    .bold()
                    .cyan()
                    .to_string(),
            )
            .default(true)
            .interact()
            .unwrap();

        if confirmation {
            break input_uri;
        } else {
            println!("{}", "Please try again...".yellow().to_string());
        }
    };

    println!("Using URI: {}", mongo_uri.bold().green().to_string());

    writeln!(env_file, "MONGO_URI={}", mongo_uri).unwrap_or_else(|e| {
        println!("Error writing to .env: {}", e);
        cleanup_env_file();
        std::process::exit(1);
    });
}

fn session_password(env_file: &mut File) {
    println!(
        "{}",
        "Generating Session Password...".bold().yellow().to_string()
    );
    let charset = "abcdefghijklmnopqrstuvwsyz1234567890!@#$%^&*()";
    let session_password: String = generate(32, charset);
    writeln!(env_file, "SESSION_PASSWORD={}", session_password).unwrap_or_else(|e| {
        println!("Error writing to .env: {}", e);
        cleanup_env_file();
        std::process::exit(1);
    });
    println!("{}", "Generated Successfully!".green().to_string());
}

fn next_build() {
    println!(
        "{}",
        "Installing Node.js dependencies..."
            .yellow()
            .bold()
            .to_string()
    );
    let install_status = Command::new("npm")
        .arg("install")
        .current_dir("../dormnet")
        .status()
        .expect("Failed to run npm install");

    if !install_status.success() {
        eprintln!(
            "{}",
            "Node.js failed to install dependencies, aborting..."
                .red()
                .bold()
        );
        cleanup_env_file();
        std::process::exit(1);
    }

    println!(
        "{}",
        "Building the Next.js app...".yellow().bold().to_string()
    );
    let build_status = Command::new("npm")
        .arg("run")
        .arg("build")
        .current_dir("../dormnet")
        .status()
        .expect("Failed to run npm run build");

    if !build_status.success() {
        eprintln!("{}", "Next.js build failed, aborting...".red().bold());
        cleanup_env_file();
        std::process::exit(1);
    }
}

fn linux_install(env_path: &str) {
    println!(
        "{}",
        "Creating systemd Service...".bold().yellow().to_string()
    );
    let service_content = format!(
        "[Unit]
Description=DormNet
After=network.target

[Service]
Type=simple
User={}
WorkingDirectory={}
ExecStart=/usr/bin/npm start
Restart=always
EnvironmentFile={}

[Install]
WantedBy=multi-user.target",
        whoami::username(),
        fs::canonicalize("../dormnet").unwrap().display(),
        fs::canonicalize(env_path).unwrap().display()
    );

    let service_path = format!("/etc/systemd/system/dormnet.service");
    fs::write(&service_path, service_content).unwrap_or_else(|e| {
        println!("Failed to write systemd service file: {}", e);
        cleanup_env_file();
        cleanup_systemd_file();
        std::process::exit(1);
    });

    Command::new("systemctl")
        .arg("daemon-reexec")
        .status()
        .unwrap();

    Command::new("systemctl")
        .arg("enable")
        .arg("dormnet.service")
        .status()
        .unwrap();

    Command::new("systemctl")
        .arg("start")
        .arg("dormnet.service")
        .status()
        .unwrap();

    println!(
        "{}",
        "Installation complete. Service dormnet.service started!"
            .bold()
            .green()
            .to_string()
    );
}

fn windows_install(env_path: &str) {
    println!(
        "{}",
        "Creating Windows Service...".bold().yellow().to_string()
    );

    let project_dir = fs::canonicalize("../dormnet").unwrap();
    let project_dir_str = project_dir.to_str().unwrap();

    let service_content = format!(
        "@echo off
set SERVICE_NAME=DormNet
set NODE_PATH={}\\node_modules
set ENV_PATH={}

REM Use where to find npm (Windows equivalent of which)
for /f \"delims=\" %%i in ('where npm') do set NPM_PATH=%%i

nssm install %SERVICE_NAME% \"%NPM_PATH%\" \"start\"
nssm set %SERVICE_NAME% AppDirectory \"{}\"
nssm set %SERVICE_NAME% AppEnvironmentExtra \"MONGO_URI=%MONGO_URI%\" \"SESSION_PASSWORD=%SESSION_PASSWORD%\"
nssm set %SERVICE_NAME% Description \"DormNet Service\"
nssm set %SERVICE_NAME% Start SERVICE_DELAYED_AUTO_START
nssm start %SERVICE_NAME%",
        project_dir_str,
        env_path,
        project_dir_str
    );

    let script_path = "install_dormnet_service.bat";
    fs::write(script_path, service_content).unwrap_or_else(|e| {
        println!("Failed to write service installation script: {}", e);
        windows_cleanup();
        std::process::exit(1);
    });

    let status = Command::new("cmd")
        .args(&["/C", script_path])
        .status()
        .expect("Failed to execute service installation");

    if !status.success() {
        eprintln!("{}", "Windows service installation failed".red().bold());
        windows_cleanup();
        std::process::exit(1);
    }

    println!(
        "{}",
        "Installation complete. Service DormNet started!"
            .bold()
            .green()
            .to_string()
    );
}
