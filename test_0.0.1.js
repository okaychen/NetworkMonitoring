var fs = require('fs');
var cheerio = require("cheerio");
var superagent = require("superagent");

var baseUrl = 'http://tieba.baidu.com/f?kw=%E5%A4%A7%E5%AD%A6&ie=utf-8&pn=0';

getData(baseUrl);

function getData(baseUrl) {
    var arr = [];
    superagent.get(baseUrl)
        .end(function (err, res) {
            if (err) {
                return console.error(err);
            }
            var $ = cheerio.load(res.text);
            $("#thread_list .j_thread_list").each(function (idx, element) {
                $element = $(element);
                var news_item = {
                    title: $(element).find($('a.j_th_tit')).text().trim(),
                    content: $(element).find($('div.threadlist_abs')).text().trim(),
                    link: 'http://tieba.baidu.com' + $(element).find($('a.j_th_tit')).attr('href'),
                    author: $(element).find($('.threadlist_lz .frs-author-name')).text().trim(),
                    time: $(element).find($('.threadlist_reply_date')).text().trim(),
                }
                arr.push(news_item);
                savedContent(arr);

            });

        })

}

function savedContent(arr) {
    for (var i = 0; i < arr.length; i++) {
        console.log(arr[i]);
        fs.writeFile("./data/db.json", JSON.stringify(arr), err => {
            if (err) throw err;
        });
    }

}

function savedImg($, news_title) {

}