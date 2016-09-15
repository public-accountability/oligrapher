import reducer from "../annotations";
import {loadAnnotations, toggleAnnotations} from '../../actions';

describe("annotations reducer", ()=>{
  
  it("should return initial state", () => {
    expect(reducer(undefined, {})).toEqual({list:[], visible: true, currentIndex: 0});
  });
  
  it('stores the annotations in state.list when LOAD_ANNOTATIONS is triggered', () =>{
    let annotations = [{
      id: '123',
      header: "header",
      text: "some text here",
      nodeIds: ["x1","33180","15957"],
      edgeIds: [],
      captionIds: []
    }];
    
    
    expect(reducer(undefined, loadAnnotations(annotations))).toEqual({
      list: [{
        id: '123',
        header: "header",
        text: "some text here",
        nodeIds: ["x1","33180","15957"],
        edgeIds: [],
        captionIds: []
      }],
      visible: true,
      currentIndex: 0
    });

  });
  
  describe('TOGGLE_ANNOTATIONS', ()=>{

    it('flips the visible state from false to true', ()=>{
      expect( reducer({visible: false}, toggleAnnotations({})) ).toEqual({visible: true});
    });
   
    it('flips the visible state from true to false', ()=>{
      expect( reducer({visible: true}, toggleAnnotations({})) ).toEqual({visible: false});
    });

  });

});
