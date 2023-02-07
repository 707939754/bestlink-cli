import { getVersion } from "./actions/version";
import { Command } from "commander";
import chalk from "chalk";
import UpdateIcon from "./actions/update-icon";

const program = new Command();

// 查看版本
program.version(chalk.green(getVersion()), "-v, --version");

// 创建项目
program
  .command("create <project-name>")
  .description(`创建新项目`)
  .option("-t --template <template>", "if it exist, overwrite directory")
  .action((name: string, options: any) => {
    console.log("准备创建的项目名称", name, options);
  });

program
  .command("update-icon")
  .description("更新图标库")
  .action(() => {
    new UpdateIcon();
  });

// 解析参数
program.parse();
