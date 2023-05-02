const os = require('os');
const { execSync } = require('child_process');

function getSystemInfo() {
    let info = {};
    info.system = os.type();
    info.platform = os.platform();
    info.arch = os.arch();
    info.release = os.release();
    info.shell = process.env.SHELL || 'unknown';
    info.isPowerShellInstalled = isPowerShellInstalled();
    return info;
}

function isPowerShellInstalled() {
  try {
    const stdout = execSync('powershell -help');
    return stdout.includes('PowerShell');
  } catch (error) {
    return false;
  }
}

module.exports = getSystemInfo;