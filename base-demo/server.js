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
