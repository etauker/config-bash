const { execSync } = require('child_process');
let helper = require('../development-setup/lib/helper.js');

var _getFiles = function() {
    return [
        { name: ".bashrc" },
        { name: ".bash_aliases" },
        { name: ".bash_colours" },
        { name: ".bash_paths" }
        // { name: ".bash_profile" },
    ];
};




var install = function(oConfig) {
    console.log("-- [config-bash] - install not implemented");
    // console.log("-- [config-bash] - running install");
    // helper.changeDirectory(oConfig.platform, oConfig.workspace, "config-bash", oConfig.options.debug);
    // helper.executeCommand(`bash install.sh --os=${oConfig.platform}`, oConfig.options.debug);
};

var configure = function(oConfig) {
    console.log("-- [config-bash] - configure not implemented");
};

var backup = function(oConfig) {
    console.log("-- [config-bash] - running backup");

    var sConfigDir = "~";
    var sBackupDir = "./content";
    var currentDate = `date '+%d-%m-%Y %H:%M'`;
    var commitMessage = "Configuration backup on $currentDate";
    var sRepositoryName = "config-bash";
    // var remote = "origin";
    // var branch = "master";



    var aBashSettings = oConfig.tools.filter(tool => tool.name === "bash")[0].settings;
    var aFiles = _getFiles();
    console.log(aBashSettings);

    // var aProfiledFiles = aFiles.filter(file => file.profiled);
    // var aNonProfiledFiles = aFiles.filter(file => !file.profiled);

    helper.changeDirectory(oConfig.platform, oConfig.workspace, sRepositoryName, oConfig.options.debug);

    // aProfiledFiles.forEach(sFile => {
    //     // // Join different profiles and install
    //     // console.log(`-- Profiled Files ${sConfigDir}/${sFile.name}`);
    //     // var sCurrentContent = helper.loadFile(`${sConfigDir}/${sFile.name}`, oConfig.options.debug);
    //     // console.log(sCurrentContent);
    //     // // TODO: Get the correct profile
    //     //
    //     //
    //     //
    //     // console.log(sCurrentContent);
    // });

    aFiles.forEach(aFile => {



        // Load the current config
        var sCurrentContent = helper.loadFile(`${sConfigDir}/${aFile.name}`, oConfig.options.debug);

        if (sCurrentContent) {

            // Identify used profiles
            var rStartDividerRegex = /.*=== (\w+) ===.*/g;
            var rProfileNameRegex = /.*=== (\w+) ===.*/;
            var aDividers = sCurrentContent.match(rStartDividerRegex);
            var aProfileList = aDividers.map(sDivider => {
                var mat = sDivider.match(rProfileNameRegex);
                return mat[1];
            });
            // console.log(aProfileList);
            // var aNewProfileList = aProfileList.map(oProfile => !aBashSettings.includes(oProfile);

            aProfileList.forEach(sProfile => {
                // // Load the the repo config
                // var sProfileContent = helper.loadFile(`${sBackupDir}/${sProfile}/${aFile.name}`, oConfig.options.debug);
                //
                // let rSectionRegex = /((.|\n|\r)*)/
                // var aSectionContent = sCurrentContent.match(rSectionRegex);
                var bWithinSection = false;
                var aCurrentContentLines = sCurrentContent.split("\n");
                var aFilteredContentLines = aCurrentContentLines.filter(sLine => {
                    if (sLine.indexOf("=== " + sProfile + " ===") !== -1) {
                        bWithinSection = true;
                        return false;
                    }
                    else if (sLine.indexOf("=== /" + sProfile + " ===") !== -1) {
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
                var sFilteredContent = aFilteredContentLines.join("\n");
                console.log(sFilteredContent);

                helper.saveFile(sFilteredContent, `${sBackupDir}/${sProfile}/${aFile.name}`, oConfig.options.debug);

                // For each file...
                // Check if the current config has this profile
                // If it does
                // Overwrite profile section in current config with the repo config
                // Otherwise
                // Generate section separator
                // Print the repo config
                // Print section end
                // Delete previous file if one exists
                // Save the new content to the file

            });

        // helper.changeDirectory(oConfig.platform, oConfig.workspace, "");
        // var sRepositoryName = helper.extractRepoName(oToolConfig.repository);
        // if (fs.existsSync(sRepositoryName) || helper.cloneRepository(oToolConfig.repository, oConfig.options.debug)) {
        //     helper.changeDirectory(oConfig.platform, oConfig.workspace, sRepositoryName);
        //     helper.executeCommand(`git fetch origin`);
        //     helper.executeCommand(`git checkout ${oToolConfig.branch}`);
        //     helper.executeCommand(`git pull origin ${oToolConfig.branch}`);
        // }

        // // Join different profiles and install
        // console.log(`-- Profiled Files ${sConfigDir}/${sFile.name}`);
        // var sCurrentContent = helper.loadFile(`${sConfigDir}/${sFile.name}`, oConfig.options.debug);
        // console.log(sCurrentContent);
        // // TODO: Get the correct profile
        //
        //
        //
        // console.log(sCurrentContent);]
        }
    });




    // echo -e "${GREEN}Bash configuration backup complete.${RESET}"
};

module.exports.install = install;
module.exports.configure = configure;
module.exports.backup = backup;
