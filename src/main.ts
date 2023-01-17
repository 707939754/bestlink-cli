import { getVersion, publish } from "./actions/version";
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

// 查看版本
program.version(chalk.green(getVersion()), "-v, --version");

// 发布版本 publish
program
  .command("publish <version>")
  .description(`publish new version`)
  .action((version: string) => {
    publish(version);
  });

// 创建项目
program
  .command("create <project-name>")
  .description(`create new project`)
  .option("-t --template <template>", "if it exist, overwrite directory")
  .action((name: string, options: any) => {
    console.log("准备创建的项目名称", name, options);
  });

// 解析参数
program.parse();
