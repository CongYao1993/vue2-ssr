# Vue2-SSR

参考文档：[Vue2 SSR 官方指南](https://v2.ssr.vuejs.org/zh/)

## 1. 基本用法

```sh
npm init
npm install vue@2 vue-server-renderer --save
npm install express --save
```

```html
<!-- index.template.html -->

<html>
  <head>
    <!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->
    <title>{{ title }}</title>

    <!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->
    {{{ meta }}}
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

```javascript
// server.js

const Vue = require("vue");
const server = require("express")();

// 读取 HTML 字符串
const template = require("fs").readFileSync("./index.template.html", "utf-8");

// 创建一个 renderer
const renderer = require("vue-server-renderer").createRenderer({
  template,
});

const context = {
  title: "vue ssr",
  meta: `
    <meta name="keyword" content="vue,ssr">
    <meta name="description" content="vue srr demo">
    <meta charset="utf-8">
    `,
};

server.get("*", (req, res) => {
  // 创建一个 Vue 实例
  const app = new Vue({
    data: {
      url: req.url,
    },
    template: `<div>访问的 URL 是： {{ url }}</div>`,
  });

  // 将 Vue 实例渲染为 HTML
  renderer.renderToString(app, context, (err, html) => {
    console.log(html);
    if (err) {
      res.status(500).end("Internal Server Error");
      return;
    }
    res.end(html);
  });
});

console.log("listen 8080...");
server.listen(8080);
```

## 2.

```
vue2-ssr/
│
├── src/
│ ├── main.js
│ └──
│
├── index.template.html
└── server.js

src
├── components
│   ├── Foo.vue
│   ├── Bar.vue
│   └── Baz.vue
├── App.vue
├── app.js # 通用 entry(universal entry)
├── entry-client.js # 仅运行于浏览器
└── entry-server.js # 仅运行于服务器
```
