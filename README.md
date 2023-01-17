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
