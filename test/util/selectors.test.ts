import { expect } from 'chai'

import Graph from '../../app/graph/graph'
import defaultState, { User, StateWithHistory }  from '../../app/util/defaultState'
import { userIsOwnerSelector } from '../../app/util/selectors'
import merge from 'lodash/merge'

describe('Selectors', function() {
    describe('userIsOwnerSelector', function() {
        const graphState = { graph: { present: Graph.new(), past: [], future: [] } }
        const defaultUser = { id: 123, name: 'foo', url: 'http://foo.com' }

        function stateWithOwner(owner: User | null, user: User | null = defaultUser): StateWithHistory {
            return merge({}, defaultState, graphState, { attributes: { user: user, owner: owner } })
        }

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
})
