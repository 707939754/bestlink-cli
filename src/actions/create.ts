import { Command } from "commander";
import chalk from "chalk";
import path from "path";
import { existsSync, remove } from "fs-extra";
import prompt from "inquirer";

const create = async (name: string, options?: any) => {
  const cwd = process.cwd();
  console.log(cwd);
  const targetPath = path.join(cwd, name);

  const { projectName } = await prompt.prompt({
    name: "projectName",
    type: "list",
    choices: [
      { name: "react-tmp", value: "react-tmp" },
      { name: "vue-tmp", value: "vue-tmp" },
      { name: "taro-tmp", value: "taro-tmp" },
    ],
    message: "请选择一个项目模版进行创建",
  });
};
// 创建项目
const program = new Command();

// 解析参数
program.parse();
