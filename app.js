'use strict';

const request = require('request');
const cheerio = require('cheerio');
const _ = require('lodash');
const fs = require('fs-extra');

// Headers is needed to prevent 403 forbidden access
let options = {
    url: 'https://www.smartselangorpasar.com/collections/cooking-oil/chow-kit',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
    }
};

request(options, (err, res, body) => {
    let linkArr = [];
    let $ = cheerio.load(body);

    if (err && res.statusCode !== 200) throw err;

    $('.product-grid-image').each((i, el) => {
        linkArr[i] = el.attribs.href;
    })

    _.each(linkArr, (el, i) => {
        let oriUrl = 'https://www.smartselangorpasar.com' + el;
        let options = {
            url: oriUrl,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
            }
        }

        request(options, (err, res, body) => {
            if (err && res.statusCode !== 200) throw err;

            let $ = cheerio.load(body);
            let writeData;
            let imgSrc = $('#productPhotoImg').attr('src');
            let prodTitle = $('.product_title').text();
            let prodPrice = $('.price.product-price').text();

            writeData = '\n' + oriUrl + ', ' + imgSrc + ', ' + prodTitle + ', ' + prodPrice;

            if (!fs.existsSync('data.csv')) {
                fs.writeFile("data.csv", 'Original URL, Image, Title, Price' + writeData, 'utf8', (err) => {
                    if (err) throw err;

                    console.log("The file was created!");
                });
            } else {
                fs.appendFile('data.csv', writeData, 'utf8', (err) => {
                    if (err) throw err;
                    console.log("The file was saved!");
                })
            }
        })
    })
})