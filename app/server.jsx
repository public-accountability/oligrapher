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
var app = new Application();

var renderDeckAndSlide = function(res, id, slide) {
  app.deckQueries.fetchDeck(id)
    .then(function(result) {
      app.deckActions.selectSlide(id, slide);

      var deck = app.deckStore.getDeck(id);

      app.renderToString(React.createElement(Root))
        .then(function(render) { 
          res.render('story_map.ejs', { 
            content: render.html,
            title: deck.title,
            image: "http://s3.amazonaws.com/pai-littlesis/images/maps/" + id + ".png"
          });
        });
    })
    .catch(function(error) {
      console.error(error.stack);
    });    
};

exp.get(/\/story_maps\/(\d+).*\/(\d+).*/, function (req, res) {
  var id = parseInt(req.params[0]);
  var slide = parseInt(req.params[1]);

  renderDeckAndSlide(res, id, slide);
});

exp.get(/\/story_maps\/(\d+).*/, function (req, res) {
  var id = parseInt(req.params[0]);

  renderDeckAndSlide(res, id, 0);
});

var server = exp.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});