"use strict";

/**
 *
 * @author xgqfrms
 * @license MIT
 * @copyright xgqfrms
 * @created 2022-10-01
 * @modified
 *
 * @description How-HTTPS-Works-Chinese / HTTPS 的工作原理 (中文版）
 * @augments
 * @example
 * @link https://howhttps.works/zh/
 * @link https://howhttps.works/
 *
 */

// import module ❓ ESM, type="module"
const fs = require('fs');
const path = require('path');
// const dir = path.resolve(path.join(__dirname, '/docs/en'));
// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir);
// }
const dir = path.join(__dirname, '/docs/en');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const needle = require('needle');
const cheerio = require('cheerio');
const json2md = require('json2md');



// 自动抓取网页，生成本地版的 English 对照参考 Markdown 文档
const urls = [
  'https://howhttps.works/',
  'https://howhttps.works/episodes/',
  'https://howhttps.works/why-do-we-need-https/',
  'https://howhttps.works/the-keys/',
  'https://howhttps.works/the-handshake/',
  'https://howhttps.works/https-ssl-tls-differences/',
  'https://howhttps.works/certificate-authorities/',
  'https://howhttps.works/quiz/',
];


// utils
function checkTextElement(element) {
  const tagNames = ['h1', 'p', 'span', 'text'];
  // return tagNames.includes(element);
  return tagNames.some(tagName => element === tagName);
  // return tagNames.some((tagName) => {
  //   return element === tagName;
  // });
}

function getElementObj(tagName, value) {
  const elementObj = {};
  elementObj[tagName] = value;
  // console.log(`tagName, value =`, tagName, value);
  // console.log(`elementObj =`, elementObj);
  return elementObj;
}
// test
// getElementObj('h1','episodes');

// 生成本地版的 English 对照参考 Markdown 文档
function write(res, filePath) {
  fs.writeFileSync(filePath, json2md(res));
};

function parser(url ,index) {
  const results = [];
  needle.get(url, (err, res) => {
    // error handler first
    if (err) {
      throw err;
    }
    // DOM
    const $ = cheerio.load(res.body);
    $('main *').each((i, elem) => {
      // check
      if(checkTextElement(elem.name)) {
        if (elem.name === 'span'|| elem.name === 'text') {
          elem.name = 'p';
        }
        // console.log(`❌ elem.children[0]`, elem.children[0]);
        // if (elem.children[0].data !== undefined) {
        if (elem.children && elem.children[0] && elem.children[0].data !== undefined) {
          const temp = getElementObj(elem.name, elem.children[0].data);
          results.push(temp);
        }
      }
    });
    const fileName = url.match(/\/([^\/]+)[\/]?$/)[1];
    // console.log(`fileName =`, fileName);
    console.log(`✅ results =`, results);
    // write(results,`./${index}-${fileName}-en.md`);
    write(results,`./docs/en/${index}-${fileName}.md`);
  });
}

urls.forEach(function(item,i) {
  parser(item,i);
});
