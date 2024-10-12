const express = require('express');
const pa11y = require('pa11y');
const cors = require('cors');
const { default: axios } = require('axios');
const PORT = process.env.PORT || 3001;
const path = require('path');
const fetch = require('node-fetch'); // Import fetch for making HTTP requests



const puppeteer = require('puppeteer');

let myurl;

const fetchHTML = async (url) => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-notifications'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    await page.goto(url,
        {
            timeout: 50000,
            waitUntil: 'networkidle0'
        }
    );


    const data = await page.evaluate(() => document.querySelector('*').outerHTML);

    // Wait for an element that signifies the CSS/JS resources have loaded
    await page.waitForSelector('body');


    await browser.close();

    // Regular expression pattern to match href="" but exclude those starting with http or https
    const regex = /href="([^hHtTpsPS":])/g;
    const regex2 = /src="([^hHtTpsPS":])/g;

    const inter = data.replace(regex, `href="${(new URL(myurl)).origin}/`);


    return inter.replace(regex2, `src="${(new URL(myurl)).origin}/`);;

    return data;
};

// Usage


const app = express();

app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/api', async (req, res) => {
    myurl = req.query.url;

    if (!req.query.url) {
        res.status(400).json(console.error('url is required'));
    } else {

        let browser;
        let page;
        let results;
        let html;
        try {

            // Launch our own browser
            browser = await puppeteer.launch();

            // Create a page for the test runs
            // (Pages cannot be used in multiple runs)
            page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('body');

            // Test http://example.com/ with our shared browser
            results = await pa11y(myurl, {
                browser,
                page: page,
                runners: [
                    //'axe',
                    'htmlcs'
                ],
                log: {
                    debug: console.log,
                    error: console.error,
                    info: console.log
                },
                includeNotices: true,
                includeWarnings: true,
            });

            const data = await page.evaluate(() => document.querySelector('*').outerHTML);

            // Wait for an element that signifies the CSS/JS resources have loaded
            await page.waitForSelector('body');

            // Regular expression pattern to match href="" but exclude those starting with http or https
            const regex = /href="([^hHtTpsPS":])/g;
            const regex2 = /src="([^hHtTpsPS":])/g;

            const inter = data.replace(regex, `href="${(new URL(myurl)).origin}/`);


            html = inter.replace(regex2, `src="${(new URL(myurl)).origin}/`);

            await page.close();
            await browser.close();

        } catch (error) {

            // Output an error if it occurred
            console.error(error.message);

            // Close the browser instance and pages if theys exist
            if (page) {
                await page.close();
            }
            if (browser) {
                await browser.close();
            }
        }

        return res.status(200).json({ results, page: html });
    }
})
/*
app.get('*', async (req, res) => {
    if (!myurl) {
        // Handle requests for unmatched paths here
        return res.status(404).send('404 - Not Found');
    }
    try {
        // Extract the original URL from the request
        const originalUrl = (new URL(myurl)).origin + req.originalUrl;

        // Make a fetch request to the desired API endpoint with the modified URL
        const response = await fetch(originalUrl);

        const text = await response.text();
        res.send(text);;
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});
*/

app.listen(PORT, async () => {

    console.log(`Server started on port ${PORT}`)
});
