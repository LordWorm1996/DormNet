use colored::Colorize;
use dialoguer::Input;
use std::fs::{self, File};
use std::io::Write;
use std::process::Command;

fn main() {
    println!(
        "{}",
        "Welcome to the DormNet installer for your Linux Container"
            .green()
            .bold()
            .to_string()
    );

    let mongo_uri: String = Input::new()
        .with_prompt("Please Enter your MongoDB URI: ")
        .interact_text()
        .unwrap();

    let env_path = "../dormnet/.env";
    let mut env_file = File::create(env_path).expect("Failed to create .env file");
    writeln!(env_file, "MONGO_URI={}", mongo_uri).expect("Failed to write to .env");

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
        .expect("Failed to run npm npm install");

    if !install_status.success() {
        eprintln!(
            "{}",
            "Node.js failed to install dependencies, aborting..."
                .red()
                .bold()
        );
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
        std::process::exit(1);
    }

    println!("{}", "Creating systemd Service...".bold().to_string());
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
    fs::write(&service_path, service_content).expect("Failed to write systemd service file");

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
        "Installation complete. Service started:"
            .green()
            .to_string(),
        service_name.bold().green().to_string()
    );
}
