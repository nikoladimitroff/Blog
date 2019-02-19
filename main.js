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
        const options = {strikethrough: true, tasklists: true, openLinksInNewWindow: true, omitExtraWLInCodeBlocks: true, tables: true};
        return new showdown.Converter(options).makeHtml(this.content);
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
    getArticleByUrl: function (router) {
        return {
            article: this.articles.find(a => a.articleUrl === router.params.url)
        };
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

function main() {
    Vue.config.devtools = true;
    registerComponents();

    const articleComponent = Vue.options.components["article-display"];
    const router = new VueRouter({
        routes: [
            { path: '/article/:url', component: articleComponent, props: model.getArticleByUrl.bind(model) },
        ]
    });

    window.app = new Vue({
        el: "#vue-container",
        data: model,
        router: router
    });
}

main();