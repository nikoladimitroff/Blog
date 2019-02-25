const DateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class Article {
    constructor(title, description) {
        this.title = title;
        this.description = description;
        this.publishDate = new Date();
        this.content = undefined;
    }
    get articleUrl() {
        return encodeURIComponent(this.title.toLowerCase());
    }
    get renderedContent() {
        return new showdown.Converter().makeHtml(this.content);
    }
}

function loadFile(url) {
    var xhr = new XMLHttpRequest();

    const promise = new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    resolve(xhr.responseText);
                }
                else {
                    reject(xhr.status);
                }
            }
        }
    });

    xhr.open("GET", url, true);
    xhr.send();
    return promise;
}

let model = {
    profile: {
        photo: "https://dimitroff.bg/cv/images/portrait.png",
        description: "A blog about software engineering and math from someone who sometimes does them."
    },
    articles: [
        new Article("Regular n-sided polygon", "Foodilalallala"),
        new Article("Linear Recurrence Homogenous Relations", "Foodilalallala"),
        new Article("Intro to programming materials", "Foodilalallala"),
        new Article("Validating complex user input", "Foodilalallala"),
        new Article("Image filtering (your own Instagram)", "Foodilalallala"),
        new Article("C++ with properties", "Foodilalallala"),
    ],
    getArticleByUrl: function (url) {
        const encodedUrl = encodeURIComponent(url);
        return this.articles.find(a => a.articleUrl === encodedUrl);
    },
    getArticleAndNeighboursByUrl: function (url) {
        const encodedUrl = encodeURIComponent(url);
        const index = this.articles.findIndex(a => a.articleUrl === encodedUrl);
        return {
            article: this.articles[index],
            previous: this.articles[index - 1],
            next: this.articles[index + 1]
        };
    },
    loadArticle: async function (article) {
        if (!article.content) {
             const markdown = await loadFile("/posts/" + article.articleUrl + "/content.md");
             // change the relative urls to point to the resources dir relative to the article
             article.content = markdown.replace(/\(resources\//g, `(posts/${article.articleUrl}/resources/`);
        }
        setTimeout(highlightCodeBlocks, 0);
    }
};

function registerComponents() {
    const templates = document.querySelectorAll("template");
    for (const template of templates) {
        const props = template.dataset.autoregisterProps.split(" ") || "";
        Vue.component(template.id, {
            props: props,
            template: template.innerHTML
        });
    }
}

function initShowdown() {
    showdown.setOption("tables", true);
    showdown.setOption("literalMidWordUnderscores", true);
    showdown.setOption("strikeThrough", true);
    showdown.setOption("tasklists", true);
    showdown.setOption("openLinksInNewWindow", true);
    showdown.setOption("omitExtraWLInCodeBlocks", true);
}

function highlightCodeBlocks() {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
}

function main() {
    Vue.config.devtools = true;
    initShowdown();
    registerComponents();

    const router = new VueRouter({
        routes: [{
                path: "/article/:url",
                component: Vue.options.components["article-display"],
                props: (router) => model.getArticleAndNeighboursByUrl(router.params.url),
                beforeEnter: (to, from, next) => {
                    const article = model.getArticleByUrl(to.params.url);
                    if (!article) {
                        next("/page-not-found");
                    } else {
                        model.loadArticle(article);
                        next();
                    }
                }
            },{
                path: "",
                component: Vue.options.components["article-list"],
                props: { articles: model.articles }
            }, {
                path: "/page-not-found",
                component: Vue.options.components["page-not-found"],
            }, {
                path: "*",
                redirect: "/page-not-found"
            }
        ]
    });

    window.app = new Vue({
        el: "#vue-container",
        data: model,
        router: router
    });
}

main();
