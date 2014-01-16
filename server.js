//
//      Example API using Hapi.
//      http://hapijs.com
//

var Hapi = require('hapi');

var quotes = [
  {
    author: 'Audrey Hepburn'
  , text: 'Nothing is impossible, the word itself says \'I\'m possible\'!'
  }
, {
    author: 'Walt Disney'
  , text: 'You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you'
  }
, {
    author: 'Unknown'
  , text: 'Even the greatest was once a beginner. Don\'t be afraid to take that first step.'
  }
, {
    author: 'Neale Donald Walsch'
  , text: 'You are afraid to die, and you\'re afraid to live. What a way to exist.'
  }
];

//
// The `createServer` factory method accepts the host name and port as the first
//    two parameters.
// When hosting on a PaaS provider, the host must be configured to allow all
//    connections (using 0.0.0.0) and the PORT environment variable must be
//    converted to a Number.
//
var server = Hapi.createServer('0.0.0.0', +process.env.PORT || 3000);

//
// Simulate an external module which is the correct way to expose this
//    kind of functionality.
//
var quoteController = {};

quoteController.getConfig = {
  handler: function(req, reply) {
    if (req.params.id) {
      if (quotes.length <= req.params.id) return reply('No quote found.').code(404);
      return reply(quotes[req.params.id]);
    }
    reply(quotes);
  }
};

quoteController.getRandomConfig = {
  handler: function(req, reply) {
    var id = Math.floor(Math.random() * quotes.length);
    reply(quotes[id]);
  }
};

quoteController.postConfig = {
  handler: function(req, reply) {
    var newQuote = { author: req.payload.author, text: req.payload.text };
    quotes.push(newQuote);
    reply(newQuote);
  }
, validate: {
    payload: {
      author: Hapi.types.String().required()
    , text: Hapi.types.String().required()
    }
  }
};

quoteController.deleteConfig = {
  handler: function(req, reply) {
    if (quotes.length <= req.params.id) return reply('No quote found.').code(404);
    quotes.splice(req.params.id, 1);
    reply(true);
  }
};

//
// Route configuration.
// ---
//

var routes = [
  { path: '/quote/{id?}', method: 'GET', config: quoteController.getConfig }
, { path: '/random', method: 'GET', config: quoteController.getRandomConfig }
, { path: '/quote', method: 'POST', config: quoteController.postConfig }
, { path: '/quote/{id}', method: 'DELETE', config: quoteController.deleteConfig }
];

server.route(routes);

server.start();
