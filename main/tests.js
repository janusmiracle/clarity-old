const fs = require('node:fs');
const path = require('node:path');

function getCommands() {

    const testCommands = {};

    // Get command folders from command directory (utility, voice, etc..)
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        // Get command files from folders
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        testCommands[folder] = commandFiles;
        }
    return testCommands;
};

function runTests() {
    console.log(' \nCategoroes & corresponding commands: \n');
    console.log(getCommands());
}

runTests();
//function validateCommands() {


    //return commandValidity
//}

