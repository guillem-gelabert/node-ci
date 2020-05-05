const Page = require("./helpers/page");
let page;
beforeEach(async () => {
    page = await Page.build()
    await page.goto('localhost:3000');
})

describe("When logged in", () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    afterEach(async () => {
        await page.close();
    });

    test("can see blog create form", async () => {
        await page.login();
        await page.click("#root > div > div > div > div.fixed-action-btn > a");
        const label = await page.getContentsOf("form label");
        expect(label).toBe("Blog Title");
    });

    describe("And using valid inputs", () => {
        beforeEach(async () => {
            await page.type(".title input", "My Title");
            await page.type(".content input", "My Content");
            await page.click("form button");
        });

        test("submitting takes user to review screen", async () => {
            const text = await page.getContentsOf("h5");
            expect(text).toEqual("Please confirm your entries");
        });

        test("submitting then saving takes user to index page", async () => {
            await page.click("button.green");
            await page.waitFor(".card");

            const title = await page.getContentsOf(".card-title");
            const content = await page.getContentsOf("p");
            expect(title).toBe("My Title");
            expect(content).toBe("My Content");
        });
    });

    describe("And using invalid inputs", () => {
        test("the form shows an error message", async () => {
            await page.click("form button");
            const titleError = await page.getContentsOf(".title .red-text");
            const contentError = await page.getContentsOf(".content .red-text");
            expect(titleError).toBe("You must provide a value");
            expect(contentError).toBe("You must provide a value");
        });
    });
});