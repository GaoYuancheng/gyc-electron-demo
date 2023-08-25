### 框架自带功能

- webpack
- react
- react-router-dom
- sass
- electron-builder 打包
- electron-updater 更新监测
- electron-devtools-installer 插件安装
- vscode 调试
- react-refresh renderer 热更新
- electronmon main.ts 热更新

- electron-store 资源存在本地
- antd

### 框架流程

start => ./.erb/configs/webpack.config.renderer.dev.ts => setupMiddlewares => start:preload/start:main => ./.erb/configs/webpack.config.preload/main.dev.ts

package => build => build:main/renderer => ./.erb/configs/webpack.config.main/renderer.prod.ts => electron-builder

### 实现目标

[ ] 全局数据共享 用户信息、全局设置等等

[ ] 自动更新

[ ] 关闭策略配置

    点击x可以选择 1.退出应用 2.缩小到托盘

[ ] 接口测试

[ ] 操作系统交互

      读取本地文件、文件下载到本地

[ ] 服务端

    实现文件读取
