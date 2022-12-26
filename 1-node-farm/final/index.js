//Requirements
const fs = require('fs');
const http = require('http');
const URL = require('url');

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
const replaceTemp = (temp, product) =>{
  let output = temp.replace(/{%PRODUCTNAME%/g, product.productName);
  output = output.replace(/{%IMAGE%/g, product.image);
  output = output.replace(/{%PRICE%/g, product.price);
  output = output.replace(/{%FROM%/g, product.from);
  output = output.replace(/{%NUTRIENTS%/g, product.nutrients);
  output = output.replace(/{%QUANTITY%/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%/g, product.description);
  output = output.replace(/{%ID%/g, product.id);
  
  if(!product.organic) output = output.replace(/{%NOT ORGANIC%/g, 'not-organic');
  return output;
}

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, encoding);
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, encoding);
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, encoding);
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, encoding);

const productData = JSON.parse(data);


const server = http.createServer((req, res) =>{
const pathName = req.url;

//Overview Page
if(pathName === '/' || pathName === '/overview'){
  res.writeHead(200, {'Content-type' : 'text/html'});
  
  const cardsHtml = productData.map(el => replaceTemp(tempCard, el)).join('');
  const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
  res.end(output);
}

//Product Page
else if (pathName === '/product'){
  res.end('This is the product');
}

//API
else if(pathName === '/api'){
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