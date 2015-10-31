# Oligrapher 2
Oligrapher is a JavaScript app for visualizing network graphs. 

Oligrapher 1 was originally developed by [LittleSis](http://littlesis.org) before it was separated into a standalone library. LittleSis has a large collection of [maps created with Oligrapher](http://littlesis.org/oligrapher). 

Oligrapher 2 is build with [React](http://reactjs.com) and [Redux](http://rackt.org/redux) and is easy to include in a web page or application.

Install
-------
This repository is a small Node.js application with a single demo page. To simple view the demo, point your browser to the /build directory. If you want to tinker with the code, install the dependencies and launch the dev server:

```
npm install
npm run dev
```

Then visit ```http://localhost:8080/demo```.


Embed
-----
Oligrapher is easy to embed in a web page. All you have to do is include the .js and .css files from the /build directory in your page header and mount it in an HTML element.

```
<html>
  <head>
    <link href="/path/to/oligrapher.css" rel="stylesheet"/>
    <script src=/path/to/oligrapher.min.js"></script>
    <style>
      #graph {
        width: 900px;
        height: 600px;
      }
    </style>
  </head>
  <body>
    <div id="graph"></div>
    <script>
      var data = getDataFromSomewhere();
      Oligrapher.run("graph", data);
    </script>
  </body>
</html>
```
