## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.0] - 2020-09-22

### 🎉 增加

- 脚本支持使用窗口或Tab页方式打开页面
- 脚本打开页面支持预执行脚本
- 脚本打开页面支持调用页面内的方法

### 🚀 改变

- 脚本的`open`函数在MacOS上表现为打开新窗口,在其它平台为打开Tab页,可通过`openTab`/`openWindow`明确打开方式
- `open`返回的页面句柄的`eval`/`inject`函数支持传入一个函数和对应的参数(之前只能手动拼字符串)

## [2.2.0] - 2020-09-16

### 🛠 修复

- 修复 `manifest` 获取版本错误

### 🎉 增加

- 增加自动发布和镜像同步的 `workflows`
- 增加 `CHANGELOG.md`
- 添加忽略发布文件（`./build` 和 `build.zip`）
- 增加新的分支 `gh-pages`
- 在仓库 `README.md` 增加 `workflows` 徽章

### 🚀 改变

- 删除仓库中的生产文件，并发布到 `release`
- 将 `./build` 发布到 `gh-pages` 分支
- 更新仓库 `README.md` 中的 `build.zip` 的下载地址
