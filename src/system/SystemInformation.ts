const os = require("os");
const { execSync } = require("child_process");
import { injectable } from "inversify";
import { ISystemInformation } from "../interfaces/system/ISystemInformation";

@injectable()
class SystemInformation implements ISystemInformation {
  system: string;
  platform: string;
  arch: string;
  release: string;
  shell: string;

  constructor() {
    this.system = os.type();
    this.platform = os.platform();
    this.arch = os.arch();
    this.release = os.release();
    this.shell = process.env.SHELL || "unknown";
  }
}

export { SystemInformation }
