# DormNet
Practice Enterprise Project for the Thomas More Univercity. We are trying to develop a booking application to be used in student dormitories to log actions done by the students living there. You can book house appliances for use in specific time frames like kitchen, washing machine, dryer, bathroom and so on. Depending on what the house offers you can add them to the list in the "Dorm" database that will track all requests and booking for all the students that have been invited to the house by the admin that the students decide. It will feature (hopefully) a secure authentication and authorization and limiters on how often an appliance can be used. 

## Installation

### Dependencies

- npm
- nodejs
- rustc(apt)/rust(pacman)
- git
- curl

------------------------------------------------------------------------------------------------------------------------------

1. Clone the repository `git clone https://github.com/LordWorm1996/DormNet.git`
2. Move into the Installer directory `cd DormNet/installer`
3. Run `cargo build --release`
4. Run `sudo ./target/release/installer`
5. Paste your MongoDB URI that you can get from MongoDB Compass on the browser
6. Wait for the intsallation to finish
7. Now your DormNet will be accessible throught `http://localhost:3000` and will be running on startup as a systemd service on your Linux Container/VM 

## Troubleshoot

- If you're on Debian 12 or older you need to install rustup's latest version from the web because the apt cargo package is outdated `https://rustup.rs/` and run `rustup update` and then source .cargo folder `source $HOME/.cargo` (not tested on newer versions but if you get messages like cargo is out of date then install rustup from the web)
- If you're on Arch this issue is not revelant as they are always up to date
