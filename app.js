const Koa = require("koa");
const app = new Koa();
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");
const index = require("./router/index");

// 处理POST
app.use(bodyParser());
app.use(
    static(__dirname + "/views", {
        extensions: ["html"]
    })
);
// routes
app.use(index.routes(), index.allowedMethods());

const port = 8080;
app.listen(port, function name(params) {
    console.log(`监听成功:http://localhost:${port}`);
});