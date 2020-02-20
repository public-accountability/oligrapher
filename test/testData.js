export const simpleGraph = {
  "nodes": {
    "-1Xu2uphP": {
      "id": "-1Xu2uphP",
      "display": {
        "x": -54.71783295711061,
        "y": -84.81264108352144,
        "scale": 1,
        "status": "normal",
        "name": "test1",
        "color": "#ccc"
      }
    },
    "L1K0sAKPx": {
      "id": "L1K0sAKPx",
      "display": {
        "x": 157.29119638826188,
        "y": -86.60948081264108,
        "scale": 1,
        "status": "normal",
        "name": "test2",
        "color": "#ccc"
      }
    },
    "_8bFKhgma": {
      "id": "_8bFKhgma",
      "display": {
        "x": 55.68397291196388,
        "y": 19.02708803611738,
        "scale": 1,
        "status": "normal",
        "name": "test3"
      }
    }
  },
  "edges": {
    "EW7LJH8ml": {
      "id": "EW7LJH8ml",
      "display": {
        "scale": 1,
        "arrow": false,
        "status": "normal",
        "label": "edgeA",
        "x1": 157.29119638826188,
        "y1": -86.60948081264108,
        "x2": -54.71783295711061,
        "y2": -84.81264108352144,
        "s1": 1,
        "s2": 1
      },
      "node1_id": "L1K0sAKPx",
      "node2_id": "-1Xu2uphP"
    },
    "WRIkscvlf": {
      "id": "WRIkscvlf",
      "display": {
        "scale": 1,
        "arrow": false,
        "status": "normal",
        "label": "edgeB",
        "x1": 157.29119638826188,
        "y1": -86.60948081264108,
        "x2": 55.68397291196388,
        "y2": 19.02708803611738,
        "s1": 1,
        "s2": 1,
        "cx": 63.78273137697517,
        "cy": 59.28216704288939
      },
      "node1_id": "L1K0sAKPx",
      "node2_id": "_8bFKhgma"
    }
  },
  "captions": {}
}

export const houseOfRepresentatives = {
  "type": "entities",
  "id": 12884,
  "attributes": {
    "id": 12884,
    "name": "US House of Representatives",
    "blurb": null,
    "summary": null,
    "website": null,
    "parent_id": 84060,
    "primary_ext": "Org",
    "updated_at": "2019-07-01T15:33:13Z",
    "start_date": null,
    "end_date": null,
    "relationship_id": 30434,
    "relationship_category_id": 7,
    "aliases": [
      "HOUSE OF REPRESENTATIVES",
      "US House of Representatives"
    ],
    "types": [
      "Organization",
      "Government Body"
    ],
    "extensions": {
      "Org": {
        "name": "US House of Representatives",
        "name_nick": null,
        "employees": null,
        "revenue": null,
        "fedspending_id": null,
        "lda_registrant_id": null
      },
      "GovernmentBody": {
        "is_federal": null,
        "state_id": null,
        "city": null,
        "county": null
      }
    }
  },
  "links": {
    "self": "http://localhost:8080/entities/12884-US_House_of_Representatives"
  }
}

export const lobbyingRelationship = {
  "type": "relationships",
  "id": 30434,
  "attributes": {
    "id": 30434,
    "entity1_id": 2,
    "entity2_id": 12884,
    "category_id": 7,
    "description1": "Direct Lobbying",
    "description2": "Direct Lobbying",
    "amount": null,
    "goods": null,
    "filings": 22,
    "updated_at": "2008-11-10T22:46:48Z",
    "start_date": "1999-00-00",
    "end_date": "2008-00-00",
    "is_current": null,
    "description": "ExxonMobil  lobbies/lobbied  US House of Representatives"
  },
  "links": {
    "self": "http://localhost:8080/relationships/30434"
  }
}
