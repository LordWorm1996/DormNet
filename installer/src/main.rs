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
        );
    } else {
        println!(
            "{}",
            "No .env file to remove or failed to delete."
                .bold()
                .red()
        );
    }
}

fn setup_macos_service(env_path: &str) -> Result<(), std::io::Error> {
    println!("{}", "Setting up macOS launchd service...".yellow().bold());

    let home_dir = dirs::home_dir().ok_or_else(||
        std::io::Error::new(std::io::ErrorKind::NotFound, "Could not find home directory"))?;

    let service_name = "com.dormnet.plist";
    let launch_agents_dir = home_dir.join("Library/LaunchAgents");
    let service_path = launch_agents_dir.join(service_name);

    // Create LaunchAgents directory if it doesn't exist
    fs::create_dir_all(&launch_agents_dir)?;

    let working_dir = fs::canonicalize("../dormnet")?;
    let env_contents = fs::read_to_string(env_path)?;

    let mongo_uri = env_contents.lines()
        .find(|l| l.starts_with("MONGO_URI="))
        .map(|l| l.trim_start_matches("MONGO_URI="))
        .unwrap_or("");

    let session_password = env_contents.lines()
        .find(|l| l.starts_with("SESSION_PASSWORD="))
        .map(|l| l.trim_start_matches("SESSION_PASSWORD="))
        .unwrap_or("");

    let service_content = format!(
        r#"<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.dormnet</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/npm</string>
        <string>start</string>
    </array>
    <key>WorkingDirectory</key>
    <string>{}</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>MONGO_URI</key>
        <string>{}</string>
        <key>SESSION_PASSWORD</key>
        <string>{}</string>
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/tmp/dormnet.out.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/dormnet.err.log</string>
</dict>
</plist>"#,
        working_dir.display(),
        mongo_uri,
        session_password
    );

    fs::write(&service_path, service_content)?;

    println!("{}", "Launchd service file created successfully".green());
    println!("To load the service, run:");
    println!("  launchctl load {}", service_path.display());

    Ok(())
}

fn main() {
    println!(
        "{}",
        "Welcome to the DormNet installer"
            .green()
            .bold()
    );

    // Get MongoDB URI
    let mongo_uri: String = loop {
        let input_uri: String = Input::new()
            .with_prompt("Please Enter your MongoDB URI")
            .interact_text()
            .unwrap();

        let prompt_text = format!("Is this correct?: {}", input_uri);
        println!("{}", prompt_text.cyan().bold());

        let confirmation = Confirm::new()
            .default(true)
            .interact()
            .unwrap();

        if confirmation {
            break input_uri;
        } else {
            println!("{}", "Please try again...".yellow());
        }
    };

    println!("Using URI: {}", mongo_uri.bold().green());

    // Create .env file
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

    // Generate session password
    println!("{}", "Generating Session Password...".bold().yellow());
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let session_password: String = generate(32, charset);
    writeln!(env_file, "SESSION_PASSWORD={}", session_password).unwrap_or_else(|e| {
        println!("Error writing to .env: {}", e);
        cleanup_env_file();
        std::process::exit(1);
    });
    println!("{}", "Generated Successfully!".green());

    // Install Node.js dependencies
    println!("{}", "Installing Node.js dependencies...".yellow().bold());
    let install_status = Command::new("npm")
        .arg("install")
        .current_dir("../dormnet")
        .status()
        .expect("Failed to run npm install");

    if !install_status.success() {
        eprintln!("{}", "npm install failed, aborting...".red().bold());
        cleanup_env_file();
        std::process::exit(1);
    }

    // Build Next.js app
    println!("{}", "Building the Next.js app...".yellow().bold());
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

    // OS-specific service setup
    match std::env::consts::OS {
        "linux" => {
            println!("{}", "Linux detected - systemd setup would go here".yellow());
            println!("{}", "Please configure systemd manually for Linux".bold());
        },
        "macos" => {
            if let Err(e) = setup_macos_service(env_path) {
                println!("Failed to setup macOS service: {}", e);
                cleanup_env_file();
                std::process::exit(1);
            }
        },
        _ => {
            println!(
                "{}",
                "Automatic service setup not supported for this OS. Please configure manually."
                    .bold()
                    .yellow()
            );
        }
    }

    println!("{}", "\nInstallation complete!".bold().green());
    println!("To start the app manually, run:");
    println!("  cd ../dormnet && npm start");
}