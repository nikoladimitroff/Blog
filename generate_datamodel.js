const path = require("path");
const fs = require('fs');
const os = require("os");

const AUTHOR_INFO = "nikola@dimitroff.bg (Nikola Dimitroff)";

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = function(dir, extensions, filelist) {
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

const generateArticleInfo = function(file) {
    const stat = fs.statSync(file);
    const fileContent = fs.readFileSync(file, { encoding: "utf8"});
    const paragraphEndRegex = /\n\s*\n/; // Two consecutive line endings;
    const paragraphEndMatch = paragraphEndRegex.exec(fileContent);
    console.assert(paragraphEndMatch, "First paragraph not found!");
    const endOfFirstParagraph = paragraphEndMatch.index;
    const articleTitle = path.basename(path.dirname(file));
    let preview = fileContent.substring(0, endOfFirstParagraph);
    // change the relative urls to point to the resources dir relative to the article
    const articleUrl = encodeURIComponent(articleTitle);
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

const dateStringComparator = function (article1, article2) {
    const d1 = new Date(article1.publishDate);
    const d2 = new Date(article2.publishDate);
    return d2 - d1;
}


const articleTitleToUrl = function (title) {
    const uri = encodeURIComponent(title);
    return `https://dimitroff.bg/#/article/${uri}`;
};

// From https://gist.github.com/samhernandez/5260558
const jsDateToRssDate = function (date) {
    var pieces     = date.toString().split(' '),
        offsetTime = pieces[5].match(/[-+]\d{4}/),
        offset     = (offsetTime) ? offsetTime : pieces[5],
        parts      = [
          pieces[0] + ',',
          pieces[2],
          pieces[1],
          pieces[3],
          pieces[4],
          offset
        ];

    return parts.join(' ');
};

const articleInfoToRSSItem = function (article) {
    return `
  <item>
    <title>${article.title}</title>
    <link>${articleTitleToUrl(article.title)}</link>
    <guid isPermaLink="true">${articleTitleToUrl(article.title)}</guid>
    <description>${article.preview}</description>
    <pubDate>${jsDateToRssDate(article.publishDate)}</pubDate>
    <author>${AUTHOR_INFO}</author>
  </item>`;
}

const generateRSSFeed = function (templateContent, articleIndex) {
    const itemXml = articleIndex.map(articleInfoToRSSItem).join("");
    let feed = templateContent.replace(/\s*<!-- ITEMS PLACEHOLDER -->/g, itemXml);
    feed = feed.replace(/LAST_BUILD_DATE/g, jsDateToRssDate(new Date()));
    return feed;
};

function main() {
    const articleIndex = walkSync("posts", [".md"])
        .map(f => generateArticleInfo(f))
        .sort(dateStringComparator);

    const fileOptions = { encoding: "utf8" };
    const scriptContent = "window.globalArticleIndex = " + JSON.stringify(articleIndex);
    fs.writeFileSync("generated/articleIndex.js", scriptContent, fileOptions);

    const rssTemplate = fs.readFileSync("rss_template.xml", fileOptions);
    const rssContent = generateRSSFeed(rssTemplate, articleIndex);
    fs.writeFileSync("rss", rssContent);
    fs.writeFileSync("feed", rssContent);
}

main();