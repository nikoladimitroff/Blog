const path = require("path");
const fs = require('fs');
const os = require("os");

// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, extensions, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            filelist = walkSync(fullPath + '/', extensions, filelist);
        }
        else if (extensions.indexOf(path.extname(fullPath)) != -1) {
            filelist.push(fullPath);
        }
    });
    return filelist;
};

var generateArticleInfo = function(file) {
    const stat = fs.statSync(file);
    const fileContent = fs.readFileSync(file, { encoding: "utf8"});
    const endOfFirstParagraph = fileContent.indexOf(os.EOL + os.EOL);
    const articleTitle = path.basename(path.dirname(file));
    let preview = fileContent.substring(0, endOfFirstParagraph);
    // change the relative urls to point to the resources dir relative to the article
    const articleUrl = encodeURIComponent(articleTitle.toLowerCase());
    preview = preview.replace(/\(resources\//g, `(posts/${articleUrl}/resources/`);

    const metaFilePath = path.join(path.dirname(file), "meta.json");
    let metadata = {};
    if (fs.existsSync(metaFilePath)) {
        metadata = JSON.parse(fs.readFileSync(metaFilePath, { encoding: "utf8"}));
    }
    return {
        title: articleTitle,
        preview: preview,
        meta: metadata,
        lastEditDate: stat.mtime,
        publishDate: stat.birthtime,
    };
}

var dateStringComparator = function (article1, article2) {
    const d1 = new Date(article1.publishDate);
    const d2 = new Date(article2.publishDate);
    return d2 - d1;
}

function main() {
    const articleIndex = walkSync("posts", [".md"])
        .map(f => generateArticleInfo(f))
        .sort(dateStringComparator);
    const scriptContent = "window.globalArticleIndex = " + JSON.stringify(articleIndex);
    fs.writeFileSync("generated/articleIndex.js", scriptContent, { encoding: "utf8"});
}

main();