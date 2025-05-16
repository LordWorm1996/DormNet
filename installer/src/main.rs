use colored::Colorize;
use dialoguer::{Confirm, Input};
use random_string::generate;
use std::fs::{self, File};
use std::io::Write;
use std::process::Command;

fn cleanup_env_file() {
    let env_path = "../dormnet/.env";
    if fs::remove_file(env_path).is_ok() {
        println!(
            "{}",
            "Cleaned up .env file due to setup failure."
                .bold()
                .red()
                .to_string()
        );
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

fn main() {
    println!(
        "{}",
        "Welcome to the DormNet installer for your Linux Container/VM"
            .green()
            .bold()
            .to_string()
    );

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

    let env_path = "../dormnet/.env";
    let mut env_file = File::create(env_path).unwrap_or_else(|e| {
        println!("Error writing to .env: {}", e);
        cleanup_env_file();
        std::process::exit(1);
    });
    writeln!(env_file, "MONGO_URI={}", mongo_uri).unwrap_or_else(|e| {
        println!("Error writing to .env: {}", e);
        cleanup_env_file();
        std::process::exit(1);
    });

    println!(
        "{}",
        "Generating Session Password...".bold().yellow().to_string()
    );
    let charset = "abcdefghijklmnopqrstuvwsyz1234567890!@#$%^&*()-_=+{}[];:,.<>?";
    let session_password: String = generate(32, charset);
    writeln!(env_file, "SESSION_PASSWORD={}", session_password).unwrap_or_else(|e| {
        println!("Error writing to .env: {}", e);
        cleanup_env_file();
        std::process::exit(1);
    });
    println!("{}", "Generated Successfully!".green().to_string());

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

    println!(
        "{}",
        "Creating systemd Service...".bold().yellow().to_string()
    );
    let service_name = "dormnet.service";
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

    let service_path = format!("/etc/systemd/system/{}", service_name);
    fs::write(&service_path, service_content).unwrap_or_else(|e| {
        println!("Failed to write systemd service file: {}", e);
        cleanup_env_file();
        std::process::exit(1);
    });

    Command::new("systemctl")
        .arg("daemon-reexec")
        .status()
        .unwrap();

    Command::new("systemctl")
        .arg("enable")
        .arg(&service_name)
        .status()
        .unwrap();

    Command::new("systemctl")
        .arg("start")
        .arg(&service_name)
        .status()
        .unwrap();

    println!(
        "{} {}",
        "Installation complete. Service started:",
        service_name.bold().green().to_string()
    );
}
