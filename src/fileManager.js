const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);
const { PowerShell } = require('node-powershell');
const getSystemInfo = require('./osInformation');

async function readMessagesFromFile(filename) {
  const messages = await readFromFile(`messages/${filename}`);
  return messages;
}

async function readConfigFromFile() {
  const config = await readFromFile("config");
  return config;
}

async function readFromFile(filename) {
  try {
    if (!filename.includes('.')) {
      filename += ".json";
    }
    const data = await fs.readFile(`./${filename}`, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading from file:", error);
    return [];
  }
}

async function saveMessagesToFile(filename, messages) {
  await saveToFile(`messages/${filename}`, messages);
}

async function saveConfigToFile(config) {
  await saveToFile("config", config);
}

async function saveToFile(filename, content) {
  try {
    if (!filename.includes('.')) {
      filename += ".json";
    }

    const dir = path.dirname(filename);
    const test1 = path.resolve(process.cwd());

    const dirname = path.isAbsolute(dir) ? dir : path.join(path.resolve(process.cwd()), dir);
    await createFolderIfNotExists(`${dirname}`);
    await fs.writeFile(`${path.join(dirname, filename)}`, JSON.stringify(content, null, 2));
    console.log(`Content saved to ${filename}`);
  } catch (error) {
    console.error("Error saving to file:", error);
  }
}

async function createFolderIfNotExists(directoryPath) {

      fs.mkdir(directoryPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Error while creating directory:', err);
        } else {
          console.log(`Directory created at ${directoryPath}`);
        }
      });
}
    
async function executeShellScript(filePath) {
  const systemInfo = getSystemInfo();
  let shellCommand = "";

  if (systemInfo.platform === "win32") {
    if (systemInfo.isPowerShellInstalled === true) {
      return await executePowershellScript(filePath);
    }
    shellCommand = "cmd.exe /c";
  } else {
    shellCommand = "bash";
  }

  try {
    const result = await execPromise( `${shellCommand} ${filePath}`);
    return result;
  } catch(err) {
    console.error(`Error: ${err}`);
    return;
  }
}

async function executePowershellScript(content) {
  const ps = new PowerShell({
    debug: true,
    executableOptions: {
      "-ExecutionPolicy": "Bypass"
    },
  });

  try {
    const message = "Execucting Powershell Script";
    const printCommand = PowerShell.command`Write-Host ${message} -ForegroundColor red -BackgroundColor white`;
    await ps.invoke(printCommand);

    const command = PowerShell.command`${content}`;
    const result = await ps.invoke(command);
    return result;
  } catch (err) {
    console.error(err);
    return;
  }
}


module.exports = {
  saveToFile,
  saveMessagesToFile,
  readMessagesFromFile,
  readConfigFromFile,
  saveConfigToFile,
  executeShellScript
};
