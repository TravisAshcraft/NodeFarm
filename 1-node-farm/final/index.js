//Requirements
const fs = require('fs');
const http = require('http');
const { url } = require('inspector');
const URL = require('url');
const replaceTemp = require('./modules/replaceTemplate');

//Global Vars
const encoding = 'utf-8';



/*//blocking synchronous way
const txtIn = fs.readFileSync('./txt/input.txt', 'utf-8');
console.log(txtIn);

const txtOut = `This is what we know about the avocado ${txtIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', txtOut);
console.log('File Written');

//Non-Blocking ASynchronous
fs.readFile('./txt/start.txt', encoding, (err, data1) => {
  if(err) return console.log('Error! File not found');

  fs.readFile(`./txt/${data1}.txt`, encoding, (err, data2) => {
    console.log(data2);
    fs.readFile('./txt/append.txt', encoding, (err, data3) => {
      console.log(data3);

      fs.writeFile('./txt/final/txt', `${data2}\n${data3}`, encoding, err => {
        console.log('Your file has been written!!!');

      })
    });
  });
});
console.log('Will read file!');*/

///////////////SERVER////////////


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, encoding);
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, encoding);
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, encoding);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, encoding);
const productData = JSON.parse(data);


const server = http.createServer((req, res) =>{

const {query, pathname} = URL.parse(req.url, true);
const pathName = req.url;


//Overview Page
if(pathname === '/' || pathname === '/overview'){
  res.writeHead(200, {'Content-type' : 'text/html'});
  
  const cardsHtml = productData.map(el => replaceTemp(tempCard, el));
  const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
  res.end(output);
}

//Product Page
else if (pathname === '/product'){
  res.writeHead(200, {'Content-type' : 'text/html'});
  const product = productData[query.id];
  const output = replaceTemp(tempProduct, product);


  res.end(output);
}

//API
else if(pathname === '/api'){
  res.writeHead(200, {'Content-type' : 'application/json'});
  res.end(data);
}
//Not Found
else {
  res.writeHead(404);
  res.end('Page not found!');
}

  
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
})