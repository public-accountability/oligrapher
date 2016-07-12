jest.unmock('../Root');
jest.unmock('classnames');


import React from 'react'; 
import ReactDOM from 'react-dom'; 
import TestUtils from 'react-addons-test-utils';
import configureMockStore from 'redux-mock-store'
import { shallow } from "enzyme";
import { CompactPicker } from "react-color";
import { HotKeys } from 'react-hotkeys';
import thunk from 'redux-thunk';
import Root from '../Root';

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares);
const store = mockStore({ data: [] })


describe("Root",  () => {

    describe("hotkeyBehaviour", () => {
        let wrapper;

        beforeEach(() => {
          let root = TestUtils.renderIntoDocument(
              <Root 
                store = {store}/>
            );
        });

        it("shows image input", () => {
            console.log(wrapper);
        });

    });

});