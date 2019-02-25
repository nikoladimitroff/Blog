const DateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class Article {
    constructor(title, description) {
        this.title = title;
        this.description = description;
        this.publishDate = new Date();
        this.lastEditDate = new Date();
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

function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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
        new Article("Summer recap", "Foodilalallala"),
        new Article("On the purpose of Math in a CS curriculum", "Foodilalallala"),
        new Article("A postmortem of Coherent GT 2.0", "Foodilalallala"),
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
        setTimeout(rerenderArticle, 0);
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

const ComponentRouting = {
    "article-display": {
        beforeRouteUpdate: onDisplayArticle,
        beforeRouteEnter: onDisplayArticle
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
}

function rerenderArticle() {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
    if (MathJax.Hub) {
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
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
                props: (router) => model.getArticleAndNeighboursByUrl(router.params.url),
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
