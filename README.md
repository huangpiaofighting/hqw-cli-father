# hqw-cli-father

用于构建react less 单页项目。

- [hqw-cli-father](#hqw-cli-father)
  - [安装](#安装)
  - [命令](#命令)
    - [hqwfa dev](#hqwfa-dev)
    - [hqwfa pro](#hqwfa-pro)
    - [hqwfa fabric](#hqwfa-fabric)
    - [hqwfa getnpmroot](#hqwfa-getnpmroot)
  - [支持](#支持)
  - [版本](#版本)

## 安装

``` node
yarn add hqw-cli-father --dev
or
npm i hqw-cli-father --save-dev
or
cnpm i hqw-cli-father --save-dev
```

## 命令

### hqwfa dev

开发环境

### hqwfa pro

生产环境

### hqwfa fabric

自动安装hqw-fabric包和配置 eslint prettier 文件，详情见[hqw-fabric](https://www.npmjs.com/package/hqw-fabric)

### hqwfa getnpmroot

做测试使用，获取npm根目录

## 支持

支持md文件

支持less

支持jsx

expample:

``` jsx
import md from 'index.md'
import styles from 'index.less'
import React from 'react'
import Markdown from "react-markdown";

function App (){
    return <div className={styles.color}>
        <h1>这是个标题</h1>
        <Markdown
            escapeHtml={false}
            source={md}
        />
    </div>
}
export defalut App;
```

## 版本

* `1.0.0` 构建模型
* `1.0.1` 添加fabric功能
