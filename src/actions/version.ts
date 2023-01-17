import fs from "fs-extra";
import _ from "lodash";

/**
 * 查看cli版本
 * @returns
 */
export function getVersion() {
  const json = fs.readJSONSync("package.json");
  return json.version;
}
