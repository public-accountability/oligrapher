"use strict";

(function() {
  var root = this;
  var previous_PopoloDataConverter = root.PopoloDataConverter;

  var PopoloDataConverter = {
    convertEntity: function(data) {
      return {
        id: data.id,
        display: {
          name: data.name
        }
      };
    },

    convertMembership: function(data) {
      return {
        id: data.id,
        node1_id: data.person_id,
        node2_id: data.organization_id,
        display: {
          label: data.role,
          arrow: true
        }
      }
    },

    convertGraphData: function(data) {
      var graph = { nodes: {}, edges: {} };
      var that = this;

      data.organizations.forEach(function(org) {
        graph.nodes[org.id] = that.convertEntity(org);
      });

      data.persons.forEach(function(person) {
        graph.nodes[person.id] = that.convertEntity(person);

        person.memberships.forEach(function(membership) {
          graph.edges[membership.id] = that.convertMembership(membership);
        });
      });

      return graph;
    }
  }

  PopoloDataConverter.noConflict = function() {
    root.PopoloDataConverter = previous_PopoloDataConverter;
    return PopoloDataConverter;
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = PopoloDataConverter;
    }

    exports.PopoloDataConverter = PopoloDataConverter;
  } 
  else {
    root.PopoloDataConverter = PopoloDataConverter;
  }

}).call(this);