# BESTLINK-CLI

脚手架

## 项目结构

```ts
src; // 主体
template; // 内嵌模板
bin; // cmd 命令
```

## commander Node.js 指令

```ts
import { Command } from "commander";
```

## log-symbols 状态标记

```ts
import logSymbols from "log-symbols";

console.log(logSymbols.success, "success");
```

## shelljs 操作系统级命令

```ts
cd ls 之类
```

## 清空本地软链接

```ts
npm list -g // 查看本地全局链接包

npm rm --gobal bestlink // 卸载bestlink包

npm unlink bestlink

npm link
```

## iconconfig.json 示例

```ts
{
  "url": "https://www.iconfont.cn/",
  "username": "18205271143",
  "password": "iconfont5683",
  "targeturl": "https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.22&manage_type=myprojects&projectId=3531886&keyword=&project_type=&page=",
  "download": "C:/Users/lic/Downloads/",
  "iconpath": "/src/assets/icon/"
}
```
