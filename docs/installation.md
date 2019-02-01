# 安装及环境配置

## 安装依赖

由于`jorum`中数据流的组织是基于RxJS的，所以需要**同时安装**`rxjs`。

```bash
$ yarn add rxjs jorum
# or
$ npm install rxjs jorum --save
```

## 配置TypeScript

> 目前版本的jorum仅支持TypeScript环境
>
> 欢迎提交PR，实现在JavaScript中使用jorum

在`tsconfig.json`中，加入如下配置：

```js
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    //...
  },
  //...
}
```

