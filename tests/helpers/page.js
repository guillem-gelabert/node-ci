const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class Page {
    static async build() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        const customPage = new Page(page);

        return new Proxy(customPage, {
            get: function (target, property) {
                return target[property] || browser[property] || page[property]
            }
        })
    }

    constructor (page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        await this.page.setCookie(...sessionFactory(user));

        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]')
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);
    }

    get(path) {
        const getBlogs = (_path) => fetch(_path, {
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => res.json());

        return this.page.evaluate(getBlogs, path);
    }

    post(path, body) {
        const postBlogs = (_path, _body) => fetch(_path, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(_body),
        }).then(res => res.json());

        return this.page.evaluate(postBlogs, path, body);
    }

    execRequests(actions) {
        return Promise.all(
            actions.map((action) => this[action.method](action.path, action.data))
        )
    }
}

module.exports = Page;