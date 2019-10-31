var fs = require('fs');
var http = require('http');
var cheerio = require("cheerio");

var baseUrl = 'http://tieba.baidu.com/f?kw=%E5%A4%A7%E5%AD%A6&ie=utf-8&pn=0';

const startPage = 1;
const endPage = 4;
let page = startPage; // 当前抓取页
let total = 0; // 数据总数
let result = [];

function filter(data) {
    let final = [];
    let $ = cheerio.load(data);
    $("#thread_list .j_thread_list").each(function (idx, element) {
        $element = $(element);
        var news_item = {
            title: $(element).find($('a.j_th_tit')).text().trim(),
            content: $(element).find($('div.threadlist_abs')).text().trim(),
            link: 'http://tieba.baidu.com' + $(element).find($('a.j_th_tit')).attr('href'),
            author: $(element).find($('.threadlist_lz .frs-author-name')).text().trim(),
            time: $(element).find($('.threadlist_reply_date')).text().trim(),
        }
        final.push(news_item);
    });
    return final;
}

function getData(baseUrl) {
    http.get(baseUrl, res => {
        let data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            let formData = filter(data);
            result = result.concat(formData);

            page++;
            if (page <= endPage) {
                let tempUrl = 'http://tieba.baidu.com/f?kw=%E5%A4%A7%E5%AD%A6&ie=utf-8&pn=' + (page - 1) * 50;
                getData(tempUrl);
            } else {
                console.log(result);
                fs.writeFile("./data/db.json", JSON.stringify(result), err => {
                    if (err) throw err;
                });
            }
        })

    })
}

getData(baseUrl);