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

var server = Hapi.createServer('localhost', process.env.PORT || 3000);

//
// Simulate an external module which is the correct way to expose this
//    kind of functionality.
//
var quoteController = {};

quoteController.getConfig = {
  handler: function(req) {
    if (req.params.id) {
      if (quotes.length <= req.params.id) return req.reply('No quote found.').code(404);
      req.reply(quotes[req.params.id]);
    }
    req.reply(quotes);
  }
};

quoteController.postConfig = {
  handler: function(req) {
    quotes.push({ author: req.payload.author, text: req.payload.text });
    req.reply();
  }
, validate: {
    payload: {
      author: Hapi.types.String().required()
    , text: Hapi.types.String().required()
    }
  }
};

quoteController.deleteConfig = {
  handler: function(req) {
    if (quotes.length <= req.params.id) return req.reply('No quote found.').code(404);
    quotes.splice(req.params.id, 1);
    req.reply();
  }
};

//
// Route configuration.
// ---
//

var routes = [
  { path: '/quote/{id?}', method: 'GET', config: quoteController.getConfig }
, { path: '/quote', method: 'POST', config: quoteController.postConfig }
, { path: '/quote/{id}', method: 'DELETE', config: quoteController.deleteConfig }
];

server.addRoutes(routes);

server.start();
