const { execSync } = require('child_process');
let helper = require('../development-setup/lib/helper.js');

var install = function(oConfig) {
    console.log("-- [config-bash] - install not implemented");
};

var configure = function(oConfig) {
    console.log("-- [config-bash] - configure not implemented");
};

var backup = function(oConfig) {
    console.log("-- [config-bash] - running backup");

    // Prepare variables
    var sConfigDir = "~";
    var sBackupDir = "./content";
    var currentDate = `date '+%d-%m-%Y %H:%M'`;
    var commitMessage = "Configuration backup on $currentDate";
    var sRepositoryName = "config-bash";
    var aBashSettings = oConfig.tools.filter(tool => tool.name === "bash")[0].settings;
    var aFiles = [
        { name: ".bashrc" },
        { name: ".bash_aliases" },
        { name: ".bash_colours" },
        { name: ".bash_paths" },
        { name: ".bash_exports" }
    ];

    // Change into user directory and loop through the files
    helper.changeDirectory(oConfig.platform, oConfig.workspace, sRepositoryName, oConfig.options.debug);
    aFiles.forEach(aFile => {

        // Load the current config
        var sCurrentContent = helper.loadFile(`${sConfigDir}/${aFile.name}`, oConfig.options.debug);
        if (sCurrentContent) {

            // Identify used profiles
            var rStartDividerRegex = /.*=== (\w+) ===.*/g;  // divider looks like: === Name ===
            var rProfileNameRegex = /.*=== (\w+) ===.*/;
            var aDividers = sCurrentContent.match(rStartDividerRegex);
            var aProfileList = aDividers.map(sDivider => sDivider.match(rProfileNameRegex)[1]);

            // Extract sections of each file
            aProfileList.forEach(sProfile => {
                var bWithinSection = false;
                var aCurrentContentLines = sCurrentContent.split("\n");
                var aFilteredContentLines = aCurrentContentLines.filter(sLine => {
                    if (sLine.toLowerCase().indexOf("=== " + sProfile.toLowerCase() + " ===") !== -1) {
                        bWithinSection = true;
                        return false;
                    }
                    else if (sLine.toLowerCase().indexOf("=== /" + sProfile.toLowerCase() + " ===") !== -1) {   // end divider looks like: === /Name ===
                        bWithinSection = false;
                        return false;
                    }
                    else if (bWithinSection) {
                        return true;
                    }
                    else {
                        // Outside the section
                        return false;
                    }
                });

                // Stitch the lines back together and save file backup
                var sFilteredContent = aFilteredContentLines.join("\n");
                helper.saveFile(sFilteredContent, `${sBackupDir}/${sProfile.toLowerCase()}/${aFile.name}`, oConfig.options.debug);
            });
        }
    });




    // echo -e "${GREEN}Bash configuration backup complete.${RESET}"
};

module.exports.install = install;
module.exports.configure = configure;
module.exports.backup = backup;
