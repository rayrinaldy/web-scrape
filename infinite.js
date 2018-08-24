const fs = require('fs-extra');
const puppeteer = require('puppeteer');


// Config
let elSelector = '.company-name';
let urlToScrape = 'https://www.supplybunny.com/en/categories/alcoholic-drinks';

// •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

function extractItems() {
    const extractedElements = document.querySelectorAll(elSelector);
    const items = [];
    for (let element of extractedElements) {
        items.push(element.innerText);
    }
    return items;
}

async function scrapeInfiniteScrollItems(
    page,
    extractItems,
    itemTargetCount,
    scrollDelay = 2000,
) {
    let items = [];
    try {
        let previousHeight;
        while (items.length < itemTargetCount) {
            items = await page.evaluate(extractItems);
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
            await page.waitFor(scrollDelay);
        }
    } catch (e) {}
    return items;
}

(async () => {
    // Set up browser and page.
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    page.setViewport({
        width: 1400,
        height: 960
    });

    // Navigate to the page.
    await page.goto(urlToScrape);

    // Scroll and extract items from the page.
    const items = await scrapeInfiniteScrollItems(page, extractItems, 1000);

    // Save extracted items to a file.
    fs.writeFileSync('./supplier.txt', items.join('\n') + '\n');

    // Close the browser.
    await browser.close();
})();