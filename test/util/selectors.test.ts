import { expect } from 'chai'
import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import Graph from '../../app/graph/graph'
import Node from '../../app/graph/node'
import defaultState, { User, StateWithHistory }  from '../../app/util/defaultState'
import { userIsOwnerSelector, hasUnsavedChangesSelector, paramsForSaveSelector } from '../../app/util/selectors'

const graphState = { graph: { present: Graph.new(), past: [], future: [] } }
const defaultUser = { id: 123, name: 'foo', url: 'http://foo.com' }
const exampleGraph = Graph.addNode(Graph.new(), { x: 1, y: 1 })
const exampleGraphWithNewNode = Graph.addNode(cloneDeep(exampleGraph), { x: 2, y: 2 })
const stateWithGraphInEditorMode = mergeState({ display: { modes: { editor: true } } },
                                              { graph: { present: exampleGraph, past: [], future: [] } },
                                              { lastSavedData: null })
const stateWithLastSavedData = merge({}, stateWithGraphInEditorMode, { lastSavedData:  paramsForSaveSelector(stateWithGraphInEditorMode) })
const stateWithDifferentLastSavedData = merge({}, stateWithLastSavedData, { graph: { present: exampleGraphWithNewNode, past: [exampleGraph]  } })

function mergeState (...objs: Array<any>):  StateWithHistory {
  return merge({}, defaultState, ...objs)
}

function stateWithOwner(owner: User | null, user: User | null = defaultUser): StateWithHistory {
  return mergeState(graphState, { attributes: { user: user, owner: owner } })
}

describe('Selectors', function() {
  describe('userIsOwnerSelector', function() {
    specify('when user and owner are null', function() {
      expect(userIsOwnerSelector(stateWithOwner(null, null))).to.be.false
    })

    specify('when user is the owner', function() {
      expect(userIsOwnerSelector(stateWithOwner(defaultUser, defaultUser))).to.be.true
    })

    specify('when user is not the owner', function() {
      let otherUser = { id: 456, name: 'bar', url: 'http://bar.com' }
      expect(userIsOwnerSelector(stateWithOwner(otherUser))).to.be.false
    })

    specify('owner is missing', function() {
      expect(userIsOwnerSelector(stateWithOwner(null))).to.be.true
    })
  })

  describe('hasUnsavedChangesSelector', function() {
    it('returns false unless in editing mode', function() {
      let state = mergeState({ display: { modes: { editor: false } } })
      expect(hasUnsavedChangesSelector(state)).to.be.false
    })

    it('returns false when there is no lastSavedData', function() {
      expect(hasUnsavedChangesSelector(stateWithGraphInEditorMode)).to.be.false
    })

    it('returns false when graph has not changed', function() {
      expect(hasUnsavedChangesSelector(stateWithLastSavedData)).to.be.false
    })

    it('returns true when graph has changed', function() {
      expect(hasUnsavedChangesSelector(stateWithDifferentLastSavedData)).to.be.true
    })
  })
})
