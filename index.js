const fs = require('fs');
const http = require('http');
const url = require('url');

const template = require('./modules/template.js');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const card_temp = fs.readFileSync(`${__dirname}/templates/card-temp.html`, 'utf-8');
const overview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const product_temp = fs.readFileSync(`${__dirname}/templates/product-temp.html`, 'utf-8');

// console.log(typeof(product_temp)); // string
// console.log(card_temp);
const server = http.createServer((req, res) => {
    // const path = req.url;
    const {query, pathname} = url.parse(req.url, true);
    if (pathname=== '/' || pathname == '/overview')
    {
        res.writeHead(200, {'Content-type': 'text/html'});
        const cardArray = dataObj.map(pro => template(card_temp, pro)).join('');
        const output = overview.replace('{%CARD%}', cardArray);
        res.end(output);
    }
    else if (pathname == '/product')
    {
        res.writeHead(200, {'Content-type': 'text/html'});
        const output = template(product_temp, dataObj[query['id']]);
        res.end(output);
    }
    else if (pathname == '/contacts')
        res.end('contacts is here');
    else if (pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    }
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-header': 'hello'
        });
        res.end('<h1>page not here..</h1>')
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request on port 8000');
});
