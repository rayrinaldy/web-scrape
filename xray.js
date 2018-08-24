const xRay = require('x-ray');
const x = xRay();
const _ = require('lodash');
const fs = require('fs-extra');

x('https://www.supplybunny.com/en/companies/', '.ibox-content', [{
        supplier: '.product-details',
        link: '.product-details@href',
        // productListed: '#products@div.row.product@div:nth-child(1)@div@div@div@table@tbody@tr:nth-child(2)@td@a@strong'
    }])
    .paginate('.pagination .next a@href')
    .limit(1)
    .then((res) => {
        _.each(res, (el, i) => {
            let writeData = '\n' + el.supplier.trim() +  ', ' + el.link.trim();

            if (!fs.existsSync('supplybunny.csv')) {
                fs.writeFile("supplybunny.csv", 'Supplier Name, URL' + writeData, 'utf8', (err) => {
                    if (err) throw err;

                    console.log("The file was created!");
                });
            } else {
                fs.appendFile('supplybunny.csv', writeData, 'utf8', (err) => {
                    if (err) throw err;
                    console.log("The file was saved!");
                })
            }
        })
    })