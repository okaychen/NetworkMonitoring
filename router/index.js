const router = require("koa-router")();
const superagent = require("superagent");
const cheerio = require("cheerio");

router.post("/api/spider", async (ctx, next) => {
    let params = ctx.request.body;
    let decodeUrl = encodeURIComponent(params.urlName); //对URL编码 
    let urlNum = parseInt((params.urlNum - 1) * 50);
    let resMessage, errorCode, result = [];
    let baseUrl = `http://tieba.baidu.com/f?kw=${decodeUrl}&ie=utf-8&pn=${urlNum}`;
    const oInfo = await superagent.get(baseUrl).set({
        Accept: "application/json"
    });
    const $ = cheerio.load(oInfo.text);
    $("#thread_list .j_thread_list").each((idx, item) => {
        result.push({
            title: $(item)
                .find($('a.j_th_tit'))
                .text().trim() || "获取标题异常",
            url: 'http://tieba.baidu.com' + $(item)
                .find($('a.j_th_tit'))
                .attr("href") || "获取url异常",
            content: $(item)
                .find($('div.threadlist_abs'))
                .text().trim(),
            author: $(item)
                .find($('.threadlist_lz .frs-author-name'))
                .text().trim() || "获取作者异常",
            date: $(item)
                .find($('.threadlist_reply_date'))
                .text().trim(),
        });
    });
    if (result == '') {
        errorCode = -1;
        resMessage = '主题吧名不存在'
    } else if (params.urlNum == '') {
        errorCode = -1;
        resMessage = '请输入爬取页码数'
    } else {
        errorCode = 1;
    }
    ctx.body = {
        status: 0,
        data: {
            errorCode: errorCode,
            resMessage: resMessage,
            baseUrl: baseUrl,
            list: result,
        }
    };

    console.log(result);
});


module.exports = router;