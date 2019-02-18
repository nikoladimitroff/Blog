const DateFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let model = {
    profile: {
        photo: "https://dimitroff.bg/cv/images/portrait.png",
        name: "Nikola Dimitroff",
        description: "Ulalala"
    },
    articles: [{
            title: "Foo",
            description: "Foodilalalala",
            publishDate: new Date()
        },{
            title: "Foo",
            description: "Foodilalalala",
            publishDate: new Date()
        },{
            title: "Foo",
            description: "Foodilalalala",
            publishDate: new Date()
        },{
            title: "Foo",
            description: "Foodilalalala",
            publishDate: new Date()
        },
    ]
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

    window.app = new Vue({
        el: "#vue-container",
        data: model
    });
}

main();