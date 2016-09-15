const Caption = require('../Caption');

describe("Caption", () => {

  describe("setDefaults", () => {

    it("gives a caption a display text, position, scale, status if it doesn't have them", () => { 
      let basicCaption = { id: 5 };
      let captionWithDefaults = Caption.setDefaults(basicCaption);
      let defaults = Caption.defaults();

      expect(captionWithDefaults.display.text).toBe(defaults.display.text);
      expect(captionWithDefaults.display.x).toBe(defaults.display.x);
      expect(captionWithDefaults.display.y).toBe(defaults.display.y);
      expect(captionWithDefaults.display.scale).toBe(defaults.display.scale);
      expect(captionWithDefaults.display.status).toBe(defaults.display.status);
    }); 

    it("doesn't change a caption if it has all default fields", () => {
      let fullCaption= { id: 5, display: { text: "Bob is good", x: 100, y: 200, scale: 2, status: "highlighted" } };
      let captionWithDefaults = Caption.setDefaults(fullCaption);

      expect(captionWithDefaults.id).toBe(fullCaption.id);
      expect(captionWithDefaults.display.text).toBe(fullCaption.display.text);
      expect(captionWithDefaults.display.x).toBe(fullCaption.display.x);
      expect(captionWithDefaults.display.y).toBe(fullCaption.display.y);
      expect(captionWithDefaults.display.scale).toBe(fullCaption.display.scale);
      expect(captionWithDefaults.display.status).toBe(fullCaption.display.status);
    });
  });
});
