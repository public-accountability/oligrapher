const Node = require('../Node');

describe("Node", () => {

  describe("setDefaults", () => {

    it("gives a node a display scale and status if it doesn't have them", () => { 
      let basicNode = { id: 5, display: { name: "Bob" } };
      let nodeWithDefaults = Node.setDefaults(basicNode);

      expect(nodeWithDefaults.display.scale).toBe(1);
      expect(nodeWithDefaults.display.status).toBe("normal");
    }); 

    it("doesn't change a node if it has a display scale and status", () => {
      let fullNode = { id: 5, display: { name: "Bob", scale: 2, status: "highlighted" } };
      let nodeWithDefaults = Node.setDefaults(fullNode);

      expect(nodeWithDefaults.display.scale).toBe(2);
      expect(nodeWithDefaults.display.status).toBe("highlighted");
    });
  });
});
