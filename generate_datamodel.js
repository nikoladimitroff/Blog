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
    return {
        title: path.basename(path.dirname(file)),
        preview: fileContent.substring(0, endOfFirstParagraph),
        lastEditDate: stat.mtime,
        publishDate: stat.birthtime,
    };
}

var dateStringComparator = function (s1, s2) {
    const d1 = new Date(s1);
    const d2 = new Date(s2);
    return d2 - d1;
}

function main() {
    const articleIndex = walkSync("posts", [".md"])
        .map(f => generateArticleInfo(f))
        .sort(dateStringComparator);
    const scriptContent = "window.globalArticleIndex = " + JSON.stringify(articleIndex);
    fs.writeFileSync("posts/articleIndex.js", scriptContent, { encoding: "utf8"});
}

main();