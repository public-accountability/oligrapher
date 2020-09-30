import { expect } from 'chai'

import Graph from '../../app/graph/graph'
import defaultState, { User, StateWithHistory }  from '../../app/util/defaultState'
import { userIsOwnerSelector, hasUnsavedChangesSelector } from '../../app/util/selectors'
import merge from 'lodash/merge'

const graphState = { graph: { present: Graph.new(), past: [], future: [] } }
const defaultUser = { id: 123, name: 'foo', url: 'http://foo.com' }

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

        it('returns true when graph has changed')
        it('returns false when viewport has changed')
        it('returns false when open menus has changed')
    })
})
