use colored::Colorize;
use dialoguer::Confirm;
use os_info;
use std::fs;
use std::process::Command;

fn main() {
    println!(
        "{}",
        "Welcome to the DormNet Uninstaller for your Server"
            .green()
            .bold()
            .to_string()
    );

    let confirmation = Confirm::new()
        .with_prompt(
            format!("Would you like to begin the Uninstall Process?")
                .bold()
                .cyan()
                .to_string(),
        )
        .default(true)
        .interact()
        .unwrap();

    if confirmation {
        let info = os_info::get();
        cleanup_env_file();

        match info.os_type() {
            os_info::Type::Windows => {
                println!(
                    "{}",
                    "Running Windows-specific code...".yellow().to_string()
                );
                windows_cleanup();
            }
            t if matches!(
                t,
                os_info::Type::Alpine
                    | os_info::Type::Amazon
                    | os_info::Type::Arch
                    | os_info::Type::CentOS
                    | os_info::Type::Debian
                    | os_info::Type::EndeavourOS
                    | os_info::Type::Fedora
                    | os_info::Type::Gentoo
                    | os_info::Type::Linux
                    | os_info::Type::Manjaro
                    | os_info::Type::Mint
                    | os_info::Type::NixOS
                    | os_info::Type::openSUSE
                    | os_info::Type::OracleLinux
                    | os_info::Type::Pop
                    | os_info::Type::Solus
                    | os_info::Type::SUSE
                    | os_info::Type::Ubuntu
                    | os_info::Type::Void
            ) =>
            {
                println!("Running Linux-specific code...");
                cleanup_systemd_file();
            }
            _ => {
                println!(
                    "{}",
                    "Unsupported OS, this Uninstaller only works for Linux and Windows! Aborting..."
                        .bold()
                        .red()
                        .to_string()
                );
                std::process::exit(1);
            }
        }
    } else {
        println!("{}", "Aborting...".bold().red().to_string());
        std::process::exit(1);
    }

    println!(
        "{}",
        "Uninstall process completed successfully!"
            .bold()
            .green()
            .to_string()
    );

    println!(
        "{}",
        "Make sure to remove the DormNet folder as well, as the Uninstaller cannot delete itself!"
            .bold()
            .yellow()
            .to_string()
    );
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
