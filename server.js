"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const querystring = require('querystring');
// querystring allows you to format and parse url query strings
// For example, the query string 'foo=bar&abc=xyz&abc=123' (with querystring.parse() is parsed into:
// {
//   foo: 'bar',
//   abc: ['xyz', '123']
// }
const urlParser = require('url')
// the url module allows you to create and parse url strings

const router = new Router({ mergeParams: true });
// the mergeParams option allows us to access params 

router.use(bodyParser.json());

let messages = [];
let id = 1;

router.get('/', (request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Hello, World!");
});

// Anytime you make a change to this file you have to KILL THE SERVER and then restart it!!!
router.post('/messages', (request, response) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  
  let newMsg = {id: id++, message: request.body.content};
  messages.push(newMsg);
  response.end(JSON.stringify(newMsg.id));
});

router.get('/messages', (request, response) => {
  let url = urlParser.parse(request.url);
  // this parses the request url coming in
  let params = querystring.parse(url.query);
  // this should return the query portion of a url string written as http://localhost:3000/messages?query=Jenny

  // so, if we send a request to http://localhost:3000/messages?encrypt=true, params.encrypt will evaluate to true, and our messages will be encrypted

  response.writeHead(200, { "Content-Type": "application/json; charset=utf-8"});

  // let parsedMessages = JSON.stringify({messages: messages, url: url, params: params});

  let parsedMessages = JSON.stringify({messages: messages, url: url, params: params})
  let jenny;

  if (params.encrypt) {
    // I believe that this conditional isn't getting hit, not sure why??? 
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    jenny = JSON.stringify({jenny: "Jenny"})
    // bcrypt.hash(parsedMessages, 10, (error, hashed) => {
    //   if (error) {
    //     throw new Error();
    //   }
    //   response.end(JSON.stringify(hashed))
    // });
  }

  // I don't think that this code is doing anything!!! ^^^

  response.end(parsedMessages)
});

router.get('/message/:id', (request, response) => {
  response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"})
  const message = messages[request.params.id - 1]
  if (message) {
    response.end(JSON.stringify(message))
  } else {
    response.end(JSON.stringify("Message not found."))
  }
})

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
