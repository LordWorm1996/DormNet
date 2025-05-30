# DormNet
Practice Enterprise Project for the Thomas More Univercity. We are developing a booking application to be used in student dormitories to log actions done by the students living there. You can book house appliances for use in specific time frames like kitchen, washing machine, dryer, bathroom and so on. Depending on what the house offers you can add them to the list in the "Dorm" database that will track all requests and booking for all the students that have been invited to the house by the admin that the students decide.

## Supported Systems

### Linux Distros

- Alpine
- Amazon
- Arch
- CentOS
- Debian
- EndeavourOS
- Fedora
- Gentoo
- Linux (generic fallback)
- Manjaro
- Mint
- NixOS
- openSUSE
- OracleLinux
- Pop
- Solus
- SUSE
- Ubuntu
- Void

### Windows

- Windows 11*
- Windows Server 2025
- Windows Server 2022
- Windows Server 2019
- Windows Server 2016
- Windows 10*
- Windows 8/8.1*
- Windows 7*

*Since Win10 and below won't be officially supported by Microsoft sooner or later, exessive testing won't be done as I don't expect many people to use those versions, depends on what NSSM also supports (They specifically say that anything above Windows Server 2000 and Windows 7 should work), nothing is listed about Win11 but people mentioned that it does work as indendent

## Installation

### Dependencies (Linux)

- npm
- nodejs
- rustc(apt)/rust(pacman)
- git
- curl

### Dependencies (Windows)

- npm
- nodejs
- NSSM
- rust
- git
- curl

### Instructions - Linux

1. Clone the repository `git clone https://github.com/LordWorm1996/DormNet.git`
2. Move into the Installer directory `cd DormNet/installer`
3. Run `cargo build --release`
4. Run `sudo ./target/release/installer`
5. Paste your MongoDB URI that you can get from MongoDB -> Connect -> Connect your Application, it should look like this `mongodb+srv://<db_username>:<db_password>@practice-enterprise.19ref.mongodb.net/?retryWrites=true&w=majority&appName=yourDB` and replace `<db_username>:<db_password>` with your username and password
6. Wait for the intsallation to finish
7. Now your DormNet will be accessible throught `http://host_ip:3000` and will be running on startup as a systemd service on your Linux Container/VM
8. Optional but reccomended reboot

### Instructions - Windows

1. Clone the repository `git clone https://github.com/LordWorm1996/DormNet.git`
2. Move into the Installer directory `cd DormNet\installer`
3. Run `cargo build --release`
4. Run `.\target\release\installer.exe`
5. Paste your MongoDB URI that you can get from MongoDB -> Connect -> Connect your Application, it should look like this `mongodb+srv://<db_username>:<db_password>@practice-enterprise.19ref.mongodb.net/?retryWrites=true&w=majority&appName=yourDB` and replace `<db_username>:<db_password>` with your username and password
6. Wait for the intsallation to finish
7. Now your DormNet will be accessible throught `http://host_ip:3000` and will be running on startup as an NSSM service on your Windows Server
8. Optional but reccomended reboot

## Uninstallation
1. Move into the Uninstaller directory `cd DormNet/uninstaller`
2. Run `cargo build --release`
3. Run `sudo ./target/release/uninstaller` (Linux) or `.\target\release\uninstaller.exe` (Windows)
4. This should remove the service and the .env file
5. After that delete the DormNet cloned repo manually as the Uninstaller cannot delete itself!!!
6. Reboot

## Troubleshoot

- If you're on Debian 12 or older you need to install rustup's latest version from the web because the apt cargo package is outdated `https://rustup.rs/` and run `rustup update` and `source $HOME/.cargo` (not tested on newer versions but if you get messages like cargo is out of date then install rustup from the web)
- If you're on Arch this issue is not revelant as they are always up to date
- As of this moment minimal testing has been done on Windows if you experience errors on file writing make sure you run the installer as an Admin, if you get other issues for now you are on your own
- If you enter `http://host_ip:3000` and nothing pops up make sure that you're not using the port 3000 for something else, Nxt.js will default to 3001, but if you check the service status `systemctl status dormnet` you should see the IP and Port it runs on (ONLY ON LOCAL HOST THE IP IS DESPLAYED AT THE END OF THE INSTALLTION, ITS THE IP OF THE MACHINE YOU INSTALLED IT INTO YOU SHOULD KNOW IT)
- There is no admin role by default, inform your supervisor to edit the database and assign the role `admin` to one person
