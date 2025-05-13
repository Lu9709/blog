# React项目搭建
### 配置开发环境
![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1665755735548-0a00365e-720e-480a-88bd-3c8fe9ccb7c9.png)

使用vite创建项目，可以通过`npm info create-vite versions`查看vite的版本。

vite创建命令：`npm create vite@3.1.0 react-mangosteen -- --template react-ts`

修改`package.json`，版本锁死，vscode可以安装[npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)。

若是下载新的依赖包需要去除版本号前的^，可以终端在终端执行`npm config set save-prefix=""`

`git commit -v`打开vim窗口可查看修改的代码片段，并添加commit的提交内容。

打包的时候可以执行`pnpm run build -- --base=name`，带上base可以在打包路径加上前缀。

[Vite](https://vitejs.dev/guide/build.html#public-base-path)

或者直接写在`package.json`内

```json
{
   "scripts": {
    "dev": "vite",
    "build": "tsc && vite build --base=/mangosteen-font-react",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
}
```

### 部署到GitHub
Github页面创建项目，然后在创建脚本。

```bash
#!usr/bin/env bash
rm -rf dist
npm run build
cd dist
git init
git add .
git commit -m deloy
git remote add origin https://github.com/Lu9709/mangosteen-font-react.git
git push -f origin master:master
cd -
```

添加权限`chmod +x bin/deloy_to_publish.sh`，然后执行`sh deloy_to_publish.sh`

### 创建snippet
```json
"React FC":{ 
  "prefix": "fc",
  "body": [
    "import * as React from 'react'",
    "export const $1: React:FC = () => {",
    "  return <></>",
    "}"
  ]	
},
```

![](https://cdn.nlark.com/yuque/0/2022/png/2749296/1665761019117-8056fe4b-d391-4caf-951f-598db1628c7d.png)

### eslint
关于eslint的配置，可以使用eslint antfu的。

[GitHub - antfu/eslint-config: Anthony’s ESLint config presets](https://github.com/antfu/eslint-config)

