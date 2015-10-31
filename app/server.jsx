require('babel/register');

var express = require('express');
var exp = express();
exp.use(express.static('build'));
exp.set('views', __dirname + '/views');
exp.set('view engine', 'ejs');  

var config = require('../config');

// var isBot = function(req) {
//   return req.headers['user-agent'].match(/baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora\ link\ preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator/);
// };

exp.get(/\/demo/, function(req, res) {
  res.render('story_map.ejs', { 
    content: null, 
    title: null,
    description: null, 
    image: null,
    env: process.env.NODE_ENV,
    ga_id: config.googleAnalyticsId
  });  
});

var server = exp.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});