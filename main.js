const DateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class Article {
    constructor(title, preview, publishDate, lastEditDate, meta) {
        this.title = title;
        this.preview = preview;
        this.publishDate = publishDate;
        this.lastEditDate = lastEditDate;
        this.meta = meta;
        this.content = undefined;
    }
    get articleUrl() {
        return encodeURIComponent(this.title);
    }
    get renderedContent() {
        if (!this.content) {
            return "";
        }
        const html = Article.converterInstance.makeHtml(this.content);
        return this.fixLocalLinks(html);
    }
    get renderedPreview() {
        return Article.converterInstance.makeHtml(this.preview);
    }
    // Finds any local links on the page (e.g. #header1) and replaces them with the correct Vue router URL
    // Not doing that causes local links to break navigation and cause 404 when loaded directly
    fixLocalLinks(html) {
        let regex = /<a href=["|']#(.*?)["|']/gm;
        let withFixedLinks = html.replace(regex, "<a href='#/article/" + this.articleUrl + "/$1'");
        return withFixedLinks;
    }
    static fromDescriptor(descriptor) {
        return new Article(descriptor.title,
            descriptor.preview,
            new Date(descriptor.publishDate),
            new Date(descriptor.lastEditDate),
            descriptor.meta,
        );
    }
    static createConverter() {
        Article.converterInstance = new showdown.Converter();
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

function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

let model = {
    profile: {
        websiteName: "dimitroff.bg",
        photoDesktop: "resources/portrait-desktop.jpg",
        photoMobile: "resources/portrait-mobile.jpg",
        description: "A blog about software engineering and math from someone who sometimes does them. " +
            "<a target='_blank' href='/cv'>Read more about me.</a>",
        linkTwitter: "https://twitter.com/nikoladimitroff",
        linkSO: "https://stackoverflow.com/users/1115693/nikola-dimitroff",
        linkGithub: "https://github.com/nikoladimitroff",
        linkEmail: "mailto:nikola@dimitroff.bg",
    },
    articles: window.globalArticleIndex.map(Article.fromDescriptor),
    // Used for presentation only
    presentation: {
        isScreenLandscape: false,
    },
    getArticleByUrl: function (url) {
        const encodedUrl = encodeURIComponent(url);
        return this.articles.find(a => a.articleUrl === encodedUrl);
    },
    getArticleInfoFromURL: function (url) {
        const encodedUrl = encodeURIComponent(url);
        const index = this.articles.findIndex(a => a.articleUrl === encodedUrl);
        return {
            article: this.articles[index],
            previous: this.articles[index - 1],
            next: this.articles[index + 1],
        };
    },
    loadArticle: async function (article) {
        if (!article.content) {
             const markdown = await loadFile("/posts/" + article.articleUrl + "/content.md");
             // change the relative urls to point to the resources dir relative to the article
             article.content = markdown.replace(/\(resources\//g, `(posts/${article.articleUrl}/resources/`);
        }
        setTimeout(rerenderPage, 0);
    }
};

const onDisplayArticle = (to, from, next) => {
    const article = model.getArticleByUrl(to.params.url);
    if (!article) {
        next("/page-not-found");
    } else {
        model.loadArticle(article);
        next();
    }
};

const onUpdateArticle = (to, from, next) => {
    const article = model.getArticleByUrl(to.params.url);
    if (!article) {
        next("/page-not-found");
    } else {
        model.loadArticle(article);
        //scrollToRequestedSection();
        next();
    }
};

const scrollToRequestedSection = () => {
    const sectionToScrollTo = app.$router.currentRoute.params.scrollTo;
    const section = document.getElementById(sectionToScrollTo);
    if (section) {
        section.scrollIntoView();
    } else {
        scrollToTop();
    }
};


const onLoadMainList = (to, from, next) => {
    setTimeout(rerenderPage, 0);
    next();
}

const ComponentRouting = {
    "article-display": {
        beforeRouteUpdate: onDisplayArticle,
        beforeRouteEnter: onDisplayArticle,
    },
    "article-list": {
        beforeRouteUpdate: onLoadMainList,
        beforeRouteEnter: onLoadMainList
    },
    addRoutesToComponent: function (id, component) {
        const routes = this[id];
        for (let route in routes) {
            component[route] = routes[route];
        }
    }
}

function registerComponents() {
    const templates = document.querySelectorAll("template");
    for (const template of templates) {
        const props = template.dataset.autoregisterProps.split(" ") || "";
        let descriptor = {
            props: props,
            template: template.innerHTML,
        };
        ComponentRouting.addRoutesToComponent(template.id, descriptor);
        Vue.component(template.id, descriptor);
    }
}

function initShowdown() {
    showdown.setOption("tables", true);
    showdown.setOption("literalMidWordUnderscores", true);
    showdown.setOption("strikeThrough", true);
    showdown.setOption("tasklists", true);
    showdown.setOption("openLinksInNewWindow", true);
    showdown.setOption("omitExtraWLInCodeBlocks", true);
    Article.createConverter();
}

function rerenderPage() {
    // Update twitter meta title; TODO: do that with vue instead of manually
    const currentArticleURL = app.$router.currentRoute.params.url;
    const activeArticle = model.getArticleInfoFromURL(currentArticleURL).article;
    const metaTag = document.querySelector("[name='twitter:title']");
    if (activeArticle) {
        metaTag.attributes["content"] = activeArticle.title;
    } else {
        metaTag.attributes["content"] = "Main page";
    }
    scrollToRequestedSection();
    document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightBlock(block);
    });
    if (MathJax.Hub) {
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    }
    if (twttr.widgets) {
        twttr.widgets.load(document.getElementById("comment-section"));
    }
}

function main() {
    Vue.config.devtools = true;
    initShowdown();
    registerComponents();

    const router = new VueRouter({
        routes: [{
                path: "/article/:url",
                component: Vue.options.components["article-display"],
                props: (router) => model.getArticleInfoFromURL(router.params.url),
            },{
                path: "/article/:url/:scrollTo",
                component: Vue.options.components["article-display"],
                props: (router) => model.getArticleInfoFromURL(router.params.url),
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

    // Update the presentation properties on resize
    const computeLandscapeness = function () {
        model.presentation.isScreenLandscape = window.matchMedia("(orientation: landscape)").matches;
    };
    window.addEventListener("resize", computeLandscapeness);
    computeLandscapeness();

    const GOOGLE_ID = 'UA-137695859-1';
    Vue.use(VueGTag, { config: { id: GOOGLE_ID } }, router);
    window.app = new Vue({
        el: "#vue-container",
        data: model,
        router: router
    });
}

document.addEventListener("DOMContentLoaded", main);
