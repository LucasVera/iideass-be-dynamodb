#!/bin/bash
#

set -e

echo "Installing required cypress dependencies"
sudo apt update
sudo apt install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
