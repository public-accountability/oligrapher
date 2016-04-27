"use strict";

(function() {
  var root = this;
  var previous_GoogleSheetDataSource = root.GoogleSheetDataSource;

  function CSVToArray(strData, strDelimiter){
    strDelimiter = (strDelimiter || ",");

    var objPattern = new RegExp(
      (
        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
        "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
    );

    var arrData = [[]];
    var arrMatches = null;

    while (arrMatches = objPattern.exec(strData)){
      var strMatchedDelimiter = arrMatches[1];

      if (
          strMatchedDelimiter.length &&
          strMatchedDelimiter !== strDelimiter
          ){

        arrData.push([]);

      }

      var strMatchedValue;

      if (arrMatches[2]){

        strMatchedValue = arrMatches[ 2 ].replace(
            new RegExp( "\"\"", "g" ),
            "\""
            );

      } else {
        strMatchedValue = arrMatches[ 3 ];
      }

      arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
  }

  var get = function(url, data, onSucess, onFail) {
    var httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
      alert('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          onSucess(JSON.parse(httpRequest.responseText));
        } else {
          if (onFail) {
            onFail({ status: httpRequest.status, error: httpRequest.responseText });
          }
        }
      }
    };

    var fullUrl = url + (data ? "?" + toQueryString(data) : "")

    httpRequest.open('GET', fullUrl);
    httpRequest.send();
  };

  var getEdges = function(nodeId) {
    var results = [];

    Object.keys(edges).forEach(function(id) {
      var edge = edges[id];

      if (edge.node1_id == nodeId || edge.node2_id == nodeId) {
        results.push(edge);
      }
    });

    return results;
  }

  var getEdgesBetween = function(nodeIds, otherIds) {
    nodeIds = nodeIds.map(function(id) { return String(id); });
    otherIds = otherIds.map(function(id) { return String(id); });
    var results = [];

    Object.keys(edges).forEach(function(id) {
      var edge = edges[id];

      if ((nodeIds.indexOf(String(edge.node1_id)) !== -1 && otherIds.indexOf(String(edge.node2_id)) !== -1) ||
          (nodeIds.indexOf(String(edge.node2_id)) !== -1 && otherIds.indexOf(String(edge.node1_id)) !== -1)) {
        results.push(edge);
      }
    });

    return results;
  }

  var nodes = {}, edges = {};

  var GoogleSheetDataSource = function(nodesUrl, edgesUrl) {
    var nodesUrl2 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + 
                    encodeURIComponent(nodesUrl) + 
                    "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    var edgesUrl2 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + 
                    encodeURIComponent(edgesUrl) + 
                    "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

    $.ajax({
      url: nodesUrl2,
      async: false,
      jsonpCallback: 'handler',
      contentType: "application/json",
      dataType: 'jsonp',
      success: function(data) {
        CSVToArray(data.query.results.body).forEach(function(nodeAry, index) {
          if (index === 0) return;

          nodes[nodeAry[0]] = {
            id: nodeAry[0],
            display: { 
              name: nodeAry[1],
              image: nodeAry[2] ? nodeAry[2] : null,
              url: nodeAry[3] ? nodeAry[3] : null
            }
          };
        });

        $.ajax({ 
          url: edgesUrl2,
          jsonpCallback: 'handler',
          contentType: "application/json",
          dataType: 'jsonp',
          success: function(data) {
            CSVToArray(data.query.results.body).forEach(function(edgeAry, index) {
              if (index === 0) return;

              edges[edgeAry[0]] = {
                id: edgeAry[0],
                node1_id: edgeAry[1],
                node2_id: edgeAry[2],
                display: {
                  label: edgeAry[3],
                  scale: edgeAry[4] ? parseInt(edgeAry[4]) : null,
                  url: edgeAry[5] ? edgeAry[5] : null,
                  arrow: edgeAry[6] == "TRUE",
                  dash: edgeAry[7] == "TRUE"                
                }
              };
            });
          }
        });
      }
    });

    return {
      name: 'Example Google Sheet',

      findNodes: function(text, callback) {
        var words = text.split(/\s+/);
        var results = [];

        Object.keys(nodes).forEach(function(id) {
          var match = words.length > 0;
          var node = nodes[id];

          words.forEach(function(word) {
            match = match && !!node.display.name.match(new RegExp(word, "i"));
          });

          if (match) {
            results.push(node);
          }
        });

        return callback(results);
      },

      getNodeWithEdges: function(nodeId, nodeIds, callback) {
        var node = nodes[nodeId];
        var edgeResults = getEdgesBetween([nodeId], nodeIds);

        return callback({ node: node, edges: edgeResults });
      },

      getConnectedNodes: function(nodeId, nodeIds, options, callback) {
        options = options || {};
        options.num = parseInt(typeof options.num !== "undefined" ? options.num : 5);

        var existingNodeIds = nodeIds.concat(nodeId);
        var connectingEdges = getEdges(nodeId);
        var connectedNodeIds = connectingEdges.map(function(edge) { return edge.node1_id })
          .concat(connectingEdges.map(function(edge) { return edge.node2_id; }))
          .filter(function(elem, pos, arr) {
            // return unique node ids that aren't existing node ids
            return arr.indexOf(elem) == pos && existingNodeIds.indexOf(elem) === -1;
          })
          .slice(0, options.num);
      
        var nodeResults = connectedNodeIds.map(function(id) { return nodes[id]; });
        var edgeResults = getEdgesBetween(connectedNodeIds, existingNodeIds.concat(connectedNodeIds));

        return callback({ nodes: nodeResults, edges: edgeResults });
      }
    }
  }

  GoogleSheetDataSource.noConflict = function() {
    root.GoogleSheetDataSource = previous_GoogleSheetDataSource;
    return GoogleSheetDataSource;
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = LsDataSource;
    }

    exports.GoogleSheetDataSource = GoogleSheetDataSource;
  } 
  else {
    root.GoogleSheetDataSource = GoogleSheetDataSource;
  }

}).call(this);