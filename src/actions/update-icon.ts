import fs from "fs-extra";
import _ from "lodash";
import chalk from "chalk";
import puppeteer from "puppeteer";
import compressing from "compressing";
import path from "path";

export default class UpdateIcon {
  // icon配置文件
  private filePath: string = "iconconfig.json";
  // 用户名
  private username: string = "";
  // 密码
  private password: string = "";
  // 图标库地址
  private url: string = "";
  // 目标地址
  private targeturl: string = "";
  // 源下载地址
  private originDownload: string = "";
  // 下载地址
  private download: string = "";
  // 图标最后的移动地址
  private iconpath: string = "";
  // 浏览器
  private browser: any;
  // 超时时间
  private timeout: number = 30000;

  // 产出
  private cssFilePath_tar: string = "";
  private jsonFilePath_tar: string = "";
  private ttfFilePath_tar: string = "";
  private woffFilePath_tar: string = "";
  private woff2FilePath_tar: string = "";

  constructor() {
    this.init();
  }

  /**
   * 初始化 读取图标配置
   */
  async init() {
    try {
      const iconConfig = await fs.readJSONSync(this.filePath);
      if (_.isEmpty(iconConfig)) {
        console.log(
          chalk.yellow("warning: ") + "项目内未读取到iconconfig.json"
        );
        return;
      }
      this.username = _.get(iconConfig, "username", "");
      this.password = _.get(iconConfig, "password", "");
      this.url = _.get(iconConfig, "url", "");
      this.targeturl = _.get(iconConfig, "targeturl", "");
      this.originDownload = _.get(iconConfig, "download", "");
      this.download = this.originDownload + "download.zip";
      this.iconpath = _.get(iconConfig, "iconpath", "");
      // 是否填写正确的iconconfig
      const flag =
        _.isEmpty(this.username) ||
        _.isEmpty(this.username) ||
        _.isEmpty(this.url) ||
        _.isEmpty(this.download) ||
        _.isEmpty(this.iconpath) ||
        _.isEmpty(this.targeturl);
      if (flag) {
        console.log(
          chalk.red("error: ") +
            "未配置用户名{username}或密码{password}或地址{url}"
        );
      }
      await this.getIconZip();
      await this.coverFile();
      await this.rewriteFile();

      console.log(chalk.green("success: 更新完成"));
    } catch (error) {
      console.log(chalk.red("error: " + error));
    }
  }

  /**
   * 重写文件
   */
  async rewriteFile() {
    try {
      fs.appendFileSync(
        this.cssFilePath_tar,
        `[class^='icon'] {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
      );
      console.log(chalk.green("success: 重写文件..."));
    } catch (error) {
      console.log(chalk.red("error: 重写文件失败"));
    }
  }

  /**
   * 覆盖文件
   */
  async coverFile() {
    try {
      // 获取文件路径
      const targetFilePath = fs.readdirSync(
        this.originDownload + "/bestlink-icons/"
      );
      // 需要移动的文件的全路径
      const allPath = path.join(
        this.originDownload,
        "/bestlink-icons/",
        _.first(targetFilePath) || ""
      );
      // css文件路径
      const cssFilePath = path.join(allPath, "/iconfont.css");
      const jsonFilePath = path.join(allPath, "/iconfont.json");
      const ttfFilePath = path.join(allPath, "/iconfont.ttf");
      const woffFilePath = path.join(allPath, "/iconfont.woff");
      const woff2FilePath = path.join(allPath, "/iconfont.woff2");

      // 目标文件夹
      this.iconpath = path.join(process.cwd(), this.iconpath);
      await fs.ensureDir(this.iconpath);
      await fs.emptydir(this.iconpath);

      this.cssFilePath_tar = path.join(this.iconpath, "/iconfont.css");
      this.jsonFilePath_tar = path.join(this.iconpath, "/iconfont.json");
      this.ttfFilePath_tar = path.join(this.iconpath, "/iconfont.ttf");
      this.woffFilePath_tar = path.join(this.iconpath, "/iconfont.woff");
      this.woff2FilePath_tar = path.join(this.iconpath, "/iconfont.woff2");

      // 移动
      await fs.move(cssFilePath, this.cssFilePath_tar, {
        overwrite: true, // 是否允许覆盖
      });
      await fs.move(jsonFilePath, this.jsonFilePath_tar, {
        overwrite: true, // 是否允许覆盖
      });
      await fs.move(ttfFilePath, this.ttfFilePath_tar, {
        overwrite: true, // 是否允许覆盖
      });
      await fs.move(woffFilePath, this.woffFilePath_tar, {
        overwrite: true, // 是否允许覆盖
      });
      await fs.move(woff2FilePath, this.woff2FilePath_tar, {
        overwrite: true, // 是否允许覆盖
      });
      console.log(chalk.green("success: 正在移动文件..."));
    } catch (error) {
      console.log(chalk.red("error: 移动覆盖文件失败"));
    }
  }

  /**
   * 获取图标压缩包
   */
  async getIconZip() {
    await this.deleteDownload();
    await this.openBrowser();
    // 解压缩
    await compressing.zip
      .uncompress(this.download, this.originDownload + "/bestlink-icons/", {
        zipFileNameEncoding: "gbk",
      })
      .then((res) => {
        console.log(chalk.green("success: 解压缩成功"));
      })
      .catch((err) => {
        console.log(chalk.red("error: 解压缩失败"));
      });
  }

  /**
   * 删除名称含有download的文件
   */
  async deleteDownload() {
    try {
      const fileList = fs.readdirSync(this.originDownload);
      fileList?.forEach(async (fileName: string) => {
        const flag = fileName.includes("download");
        if (flag) {
          if (fileName.includes(".")) {
            fs.unlinkSync(this.download);
          } else {
            fs.emptyDirSync(this.download);
            await fs.rmdir(this.download);
          }
        }
        if (fileName === "bestlink-icons") {
          fs.emptyDirSync(this.originDownload + "/bestlink-icons/");
          await fs.rmdir(this.originDownload + "/bestlink-icons/");
        }
      });
      console.log(chalk.green("success: 删除缓存..."));
    } catch (error) {
      console.log(chalk.red("error: 删除下载文件出错"));
    }
  }

  /**
   * 打开浏览器
   */
  async openBrowser() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        timeout: this.timeout,
        defaultViewport: {
          width: 1920,
          height: 1080,
        },
      });
      const iconPage = await this.browser.newPage();
      await iconPage.goto(this.url);
      await iconPage.waitForSelector(".page-home", {
        visible: true,
      });
      await iconPage.waitForSelector(".signin", {
        visible: true,
      });
      await iconPage.click(".signin");
      await iconPage.waitForSelector("#userid", {
        visible: true,
      });
      console.log(chalk.green("success: 正在登录..."));
      await iconPage.type("#userid", this.username);
      await iconPage.type("#password", this.password);
      await iconPage.click(".mx-btn-submit");
      await iconPage.waitForSelector(".page-home", {
        visible: true,
      });
      await iconPage.goto(this.targeturl);
      console.log(chalk.green("success: 跳转至目标项目..."));
      await iconPage.waitForSelector(".page-manage-project", {
        visible: true,
      });
      await iconPage.waitForSelector(".type-select", {
        visible: true,
      });
      await iconPage.$$eval(".type-select > li", (ele: any) =>
        ele.map((item: any) => {
          if (item.innerHTML == "Font class") {
            item.click();
          }
        })
      );

      console.log(chalk.green("success: 开始下载..."));
      await iconPage.waitForSelector(".btn-group-item", {
        visible: true,
      });
      // 可能这里影响到浏览器无头模式
      const CDPSession = await iconPage.target().createCDPSession();
      await CDPSession.send("Page.setDownloadBehavior", {
        behavior: "allow", //允许下载请求
        downloadPath: path.join(this.originDownload),
      });
      await iconPage.$eval(".btn-group-item", (ele: any) => {
        ele.click();
      });
      // 确认
      const start = Date.now();
      let exitFile = fs.existsSync(this.download);
      while (!exitFile) {
        // 每隔一秒轮询一次，查看download.zip文件是否下载完毕，超时时间设为30秒
        await iconPage.waitForTimeout(1000);
        if (Date.now() - start >= this.timeout) {
          await iconPage.close();
          await this.browser.close();
          throw new Error("下载超时");
        }
        exitFile = fs.existsSync(this.download);
      }
      console.log(chalk.green("success: 图标下载成功！"));
      await iconPage.close();
      await this.browser.close();
    } catch (error) {
      console.log(chalk.red("error: ", error));
    }
  }
}
