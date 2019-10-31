var fs = require('fs');
var http = require('http');
var async = require("async");
var cheerio = require("cheerio");
var superagent = require("superagent");
var db_ba = require('./data/db_ba.json');

async.mapLimit(db_ba, 3, function (url, callback) {
    superagent.get(url)
        .end(function (err, msg) {
            if (err) throw err
            var $ = cheerio.load(msg.text);
            var jsonData = {
                title: $(element).find($('a.j_th_tit')).text().trim(),
                content: $(element).find($('div.threadlist_abs')).text().trim(),
                link: 'http://tieba.baidu.com' + $(element).find($('a.j_th_tit')).attr('href'),
                author: $(element).find($('.threadlist_lz .frs-author-name')).text().trim(),
                time: $(element).find($('.threadlist_reply_date')).text().trim(),
            }
            callback(null, jsonData);
        }, function () {

        })
})