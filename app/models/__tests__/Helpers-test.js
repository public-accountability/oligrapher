jest.unmock('../Helpers'); 

import Helpers from '../Helpers';

describe("Helpers", () => {

  describe("generateId()", () => {

    it("should generate a short string id", () => {
      let id = Helpers.generateId();

      expect(id.length).toBeGreaterThan(5);
      expect(id.length).toBeLessThan(10);
    });
  });

  describe("compactObject()", () => {

    it("should recursviely remove empty values from an object", () => {
      let obj = { id: 100, display: { name: "Bob", scale: 1, image: { bar: null } }, foo: [], bar: false };
      let newObj = Helpers.compactObject(obj);

      expect(newObj.id).toBe(obj.id);
      expect(newObj.display.name).toBe(obj.display.name);
      expect(newObj.display.scale).toBe(obj.display.scale);
      expect(newObj.display.image).toBeUndefined();
      expect(newObj.foo).toBeUndefined();
      expect(newObj.bar).toBe(false);
    });
  });
});