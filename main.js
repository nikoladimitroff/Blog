const DateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class Article {
    constructor(title, description) {
        this.title = title;
        this.description = description;
        this.publishDate = new Date();
        this.content = "#Heya\r\n*foo\r\n*bar\r\n![puppy](resources/puppy.jpg)";
    }
    get articleUrl() {
        return this.title.toLowerCase().replace(/ /g, '%20');
    }
    get renderedContent() {
        return new showdown.Converter().makeHtml(this.content);
    }
}

let model = {
    profile: {
        photo: "https://dimitroff.bg/cv/images/portrait.png",
        name: "Nikola Dimitroff",
        description: "Ulalala"
    },
    articles: [
        new Article("Foo", "Foodilalallala"),
        new Article("Foo", "Foodilalallala"),
        new Article("Foo", "Foodilalallala"),
        new Article("Foo", "Foodilalallala"),
    ],
    getArticleByUrl: function (url) {
        return this.articles.find(a => a.articleUrl === url);
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
    showdown.setOption("strikeThrough", true);
    showdown.setOption("tasklists", true);
    showdown.setOption("openLinksInNewWindow", true);
    showdown.setOption("omitExtraWLInCodeBlocks", true);
}

function main() {
    Vue.config.devtools = true;
    initShowdown();
    registerComponents();

    const router = new VueRouter({
        routes: [{
                path: "/article/:url",
                component: Vue.options.components["article-display"],
                props: (router) => ({ article: model.getArticleByUrl(router.params.url) }),
                beforeEnter: (to, from, next) => {
                    const article = model.getArticleByUrl(to.params.url);
                    if (!article) {
                        next("/page-not-found");
                    } else {
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