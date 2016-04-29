jest.unmock('../Edge'); 

import Edge from '../Edge';

describe("Edge", () => {

  describe("setDefaults", () => {

    it("gives an edge a display scale, arrow, and status if it doesn't have them", () => { 
      let basicEdge = { id: 5, node1_id: 32, node2_id: 128, display: { label: "Best Friend" } };
      let edgeWithDefaults = Edge.setDefaults(basicEdge);

      expect(edgeWithDefaults.display.scale).toBe(1);
      expect(edgeWithDefaults.display.arrow).toBe(false);
      expect(edgeWithDefaults.display.status).toBe("normal");
    }); 

    it("doesn't change an edge if it has a display scale, arrow, and status", () => {
      let fullEdge = { 
        id: 5, 
        node1_id: 32, 
        node2_id: 128, 
        display: { 
          label: "Best Friend", 
          scale: 2, 
          arrow: true,
          status: "highlighted" 
        } 
      };
      let edgeWithDefaults = Edge.setDefaults(fullEdge);

      expect(edgeWithDefaults.display.scale).toBe(2);
      expect(edgeWithDefaults.display.arrow).toBe(true);
      expect(edgeWithDefaults.display.status).toBe("highlighted");
    });
  });
});