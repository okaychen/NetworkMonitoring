var fs = require('fs');
var http = require('http');
var cheerio = require("cheerio");

var baseUrl = 'http://tieba.baidu.com/f/index/forumpark?cn=&ci=0&pcn=%E9%AB%98%E7%AD%89%E9%99%A2%E6%A0%A1&pci=0&ct=1&st=new&pn=1';

const startPage = 1;
const endPage = 30;
let page = startPage; // 当前抓取页
let total = 0; // 数据总数
let result = [];

function filter(data) {
    let final = [];
    let $ = cheerio.load(data);
    $(".ba_list .ba_info").each(function (idx, element) {
        $element = $(element);
        var ba = {
            ba_name: $(element).find($('.ba_name')).text().trim(),
            ba_link: 'http://tieba.baidu.com/' + $(element).find($('.ba_href')).attr('href'),
        }
        final.push(ba);
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
                let tempUrl = `http://tieba.baidu.com/f/index/forumpark?cn=&ci=0&pcn=%E9%AB%98%E7%AD%89%E9%99%A2%E6%A0%A1&pci=0&ct=1&st=new&pn=${page}`;
                getData(tempUrl);
            } else {
                console.log(result);
                fs.writeFile("./data/db_ba.json", JSON.stringify(result), err => {
                    if (err) throw err;
                });
            }
        })
    })
    return result;
}

getData(baseUrl);