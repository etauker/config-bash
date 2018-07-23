#!/bin/bash

# Styling variables
RESET="$(tput sgr0)"
GREEN="${RESET}\033[38;5;10m"
YELLOW="${RESET}\033[38;5;11m"
GREY="${RESET}\e[37m"

# Prints help page
if [[ $@ = *"-h"* || $@ = *"--help"* ]]; then
    echo -e "   ${GREY}"
    echo -e "   This script backs up bash configuration files from ~/"
    echo -e "   ${RESET}"

    echo -e "   ${YELLOW}   -h, --help ${RESET}     Prints this message."
    echo -e "   ${YELLOW}   -c, --commit ${RESET}   Commits the files after a backup."
    echo -e "   ${YELLOW}   -p, --push ${RESET}     Pushes the files after a backup. Only works if -c option is also given."
    echo -e "   ${RESET}"
fi

# Begin backup
if [[ $@ != *"-h"* && $@ != *"--help"* ]]; then
    echo -e "${YELLOW}Bash configuration backup in progress...${RESET}"

    # Script variables
    currentDir=`pwd`
    configDir="~"
    backupDir="./content"
    currentDate=`date '+%d-%m-%Y %H:%M'`
    commitMessage="Configuration backup on $currentDate"
    remote="origin"
    branch="master"

    # Copy config files from ~ into backupDir
    # echo "-- Backing up ~/.bashrc"
    # eval "cp ~/.bashrc ${backupDir}/.bashrc"
    # echo "-- Backing up ~/.bash_profile"
    # eval "cp ~/.bash_profile ${backupDir}/bash_profile"
    bashRc=`cat ~/.bashrc`
# echo $bashRc
eval "echo $bashRc"
    echo -e "${GREEN}Bash configuration backup complete.${RESET}"
fi

# Commit the changes made to source control
if [[ $@ = *"-c"* || $@ = *"--commit"* ]]; then
    echo -e "${YELLOW}Committing to source control...${RESET}"
    git add $backupDir
    git commit -m "$commitMessage"
    echo -e "${GREEN}Committed with message: $commitMessage ${RESET}"

    # Push changes to a remote
    if [[ $@ = *"-p"* || $@ = *"--push"* ]]; then
        echo -e "${YELLOW}Pushing to remote...${RESET}"
        git push ${remote} ${branch}
        echo -e "${GREEN}Pushed to ${remote} ${branch}.${RESET}"
    fi
fi
