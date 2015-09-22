require('babel/register');

var express = require('express');
var exp = express();

exp.use(express.static('build'));
exp.set('views', __dirname + '/views');
exp.set('view engine', 'ejs');  

const Marty = require('marty');
const React = require('react');
const Application = require('./application');
const Root = require('./components/Root');
const config = require(__dirname + '/../config.js');
var app = new Application();
var striptags = require('striptags');

var isBot = function(req) {
  return req.headers['user-agent'].match(/baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora\ link\ preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator/);
};

var renderDeckAndSlide = function(req, res, id, slide) {
  if (isBot(req)) {
    app.deckQueries.fetchDeck(id)
      .then(function(result) {
        app.deckActions.selectSlide(id, slide);

        var deck = app.deckStore.getDeck(id);
        var graph = app.graphStore.getGraph(deck.graphIds[slide]).result;

        app.renderToString(React.createElement(Root))
          .then(function(render) { 
            res.render('story_map.ejs', { 
              content: render.html,
              title: deck.title,
              description: striptags(graph.display.description),
              image: "http://s3.amazonaws.com/pai-littlesis/images/maps/" + id + ".png",
              env: process.env.NODE_ENV,
              ga_id: config.googleAnalyticsId
            });
          });
      })
      .catch(function(error) {
        console.error(error.stack);
      });    
  } else {
    res.render('story_map.ejs', { 
      content: null, 
      title: null,
      description: null, 
      image: null,
      env: process.env.NODE_ENV,
      ga_id: config.googleAnalyticsId
    });
  }
};

exp.get(/\/story_maps\/(\d+).*\/(\d+).*/, function (req, res) {
  var id = parseInt(req.params[0]);
  var slide = parseInt(req.params[1]);

  renderDeckAndSlide(req, res, id, slide);
});

exp.get(/\/story_maps\/(\d+).*/, function (req, res) {
  var id = parseInt(req.params[0]);

  renderDeckAndSlide(req, res, id, 0);
});

var server = exp.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});