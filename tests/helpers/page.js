const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class Page {
    static async build() {
        const browser = await puppeteer.launch({
            headless: false
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

        await this.page.goto('localhost:3000');
        await this.page.waitFor('a[href="/auth/logout"]')
    }

    async getQuerySelector(selector) {
        return this.page.$eval(selector, el => el.innerHTML)
    }
}

module.exports = Page;