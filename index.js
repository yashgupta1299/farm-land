const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const template = require('./modules/template.js');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const card_temp = fs.readFileSync(
  `${__dirname}/templates/card-temp.html`,
  'utf-8'
);
const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const product_temp = fs.readFileSync(
  `${__dirname}/templates/product-temp.html`,
  'utf-8'
);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugs);

// console.log(typeof(product_temp)); // string
// console.log(card_temp);
const server = http.createServer((req, res) => {
  // const path = req.url;
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === '/' || pathname == '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardArray = dataObj.map((pro) => template(card_temp, pro)).join('');
    const output = overview.replace('{%CARD%}', cardArray);
    res.end(output);
  } else if (pathname == '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const output = template(product_temp, dataObj[query['id']]);
    res.end(output);
  } else if (pathname == '/contacts') res.end('contacts is here');
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-header': 'hello',
    });
    res.end('<h1>page not here..</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});

// NOTES:

// The objective of the npm update command is to update your package-lock.json according to what you have specified in the package.json file. This is the normal behavior.

// If you want to update your package.json file, you can use npm-check-updates: npm install -g npm-check-updates.

// You can then use these commands:

// ncu Checks for updates from the package.json file
// ncu -u Update the package.json file
// npm update --save Update your package-lock.json file from the package.json file

//   "dependencies" : Packages required by your application in production.
// "devDependencies" : Packages that are only needed for local development and testing.
