const marked = require('marked');
const fs = require('fs');
const pathResolve = require('path').resolve;

const commentReg = /^\s*<!--\s*(.*?)\s*-->\s*$/gm;
var getMetaData = (content) => {
    commentReg.lastIndex = 0;
    var match = commentReg.exec(content);
    if (!match) {
        return '';
    }
    var metaData = [];
    var metaArr = match[1].split(/\s+/);
    metaArr.forEach(function (meta) {
        var kv = meta.split('=');
        metaData.push([
            kv[0].replace(/^data-/, ''),
            kv[1].replace(/^('|")?(.*?)\1$/, '$2')
        ]);
    });
    return metaData.map(function (meta) {
        return 'data-' + meta[0] + '="' + meta[1] + '"';
    }).join(' ');
};

var createSlideDiv = (content) =>
     `<div class="step" ${getMetaData(content)}>${marked(content)}</div>`;

var readFile = (path) => {
    path = pathResolve(__dirname, path);
    return String(fs.readFileSync(path));
};

var createImpressHTML = (html) => {
    var tpl = readFile('./res/impress.tpl');
    var data = {
        html: html,
        css: readFile('./res/impress.css'),
        js: readFile('./res/impress.min.js')
    };
    return tpl.replace(/\{\{\$(\w+)\}\}/g, function ($, $1) {
        return data[$1];
    });
};

var processMarkdownFile = (path) => {
    var contentArr = String(fs.readFileSync(path)).split(/^-{6,}$/m);
    var html = '';
    contentArr.forEach(function (content) {
        html += createSlideDiv(content);
    });
    return createImpressHTML(html);
};

module.exports = processMarkdownFile;
