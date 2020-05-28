import React from 'react'
import sinon from 'sinon'
import { mount } from 'enzyme'

import EditorSubmitButtons from '../../app/components/EditorSubmitButtons'

describe('<EditorSubmitButtons>', function() {
  let props, submitButtons, pageSetter, deleter, submitter

  describe("main page", function() {
    beforeEach(function(){
      deleter = sinon.fake()
      submitter = sinon.fake()
      pageSetter = sinon.fake()
      props = {
        page: "main",
        setPage: pageSetter,
        handleDelete: deleter,
        handleSubmit: submitter
      }
      submitButtons = mount(<EditorSubmitButtons {...props} />)
    })
  
    it("renders a submit button which calls the submit handler", function() {
      let button = submitButtons.find("button").filterWhere(n => n.text() === 'Apply')
      expect(button).to.have.lengthOf(1)
      button.simulate("click")
      expect(submitter.calledOnce).to.be.true
    })
  
    it("renders a delete button which calls the delete handler", function() {
      let button = submitButtons.find("button").filterWhere(n => n.text() === 'Delete')
      expect(button).to.have.lengthOf(1)
      button.simulate("click")
      expect(deleter.calledOnce).to.be.true
    })
  })

  describe("non-main page", function () {
    beforeEach(function(){
      deleter = sinon.fake()
      submitter = sinon.fake()
      pageSetter = sinon.fake()
      props = {
        page: "something other than main",
        setPage: pageSetter,
        handleDelete: deleter,
        handleSubmit: submitter
      }
      submitButtons = mount(<EditorSubmitButtons {...props} />)
    })

    it("renders a back button which calls setPage", function() {
      let button = submitButtons.find("button").filterWhere(n => n.text() === 'Back')
      expect(button).to.have.lengthOf(1)
      button.simulate("click")
      expect(pageSetter.calledOnce).to.be.true
    })  
  })
})