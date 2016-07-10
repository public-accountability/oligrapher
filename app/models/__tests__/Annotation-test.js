jest.unmock('../Annotation');

import Annotation from '../Annotation';

describe('Annotation', ()=>{
  
  describe('defaults', ()=>{
    it('returns an object', ()=> expect(typeof Annotation.defaults()).toEqual('object') );
  });
  
  describe('setDefaults', ()=> {

    it('provides defaults when given an empty object', () =>{
      const a = Annotation.setDefaults({});
      expect(a.header).toEqual("Untitled Annotation");
      expect(a.text).toEqual('');
      expect(a.nodeIds).toEqual([]);
      expect(a.captionIds).toEqual([]);
      expect(a.edgeIds).toEqual([]);
      expect(a.id).toBeDefined();
    });
    
    it('merges defaults when provided an annotation object', ()=>{
      expect(Annotation.setDefaults({header: "new header"}).header).toEqual('new header');
      expect(Annotation.setDefaults({header: "new header"}).nodeIds).toEqual([]);
    });
  });
  
});
