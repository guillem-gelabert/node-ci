const Page = require("./helpers/page");

describe("header", () => {

    let page;

    beforeEach(async () => {
        page = await Page.build();
        await page.goto('http://localhost:3000');
    });

    afterEach(async () => {
        await page.close()
    });

    test('the header has the correct test', async () => {
        const text = await page.getContentsOf('a.brand-logo');

        expect(text).toEqual('Blogster');
    });

    test('clicking login starts oauth flow', async () => {
        await page.click('.right a');
        const url = await page.url();
        expect(url).toMatch("https://accounts.google.com");
    });

    test('when signed in shows logout button', async () => {
        await page.login();
        const text = await page.getContentsOf('a[href="/auth/logout"]');

        expect(text).toEqual('Logout');
    });
})