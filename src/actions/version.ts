import fs from "fs-extra";
import _ from "lodash";
import chalk from "chalk";
import { Command } from "commander";

/**
 * 查看cli版本
 * @returns
 */
export function getVersion() {
  const json = fs.readJSONSync("package.json");
  return json.version;
}

/**
 * 发布版本
 * @param version
 */
export function publish(version: string) {
  const regex = /[0-9]\.[0-9]\.[0-9]/;
  const flag = regex.test(version); // 是否满足正常的版本格式
  if (_.isEmpty(version) || !flag) {
    console.log(chalk.red("版本格式错误"));
    return;
  }
  // 主动执行发布功能
}
