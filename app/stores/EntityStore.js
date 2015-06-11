const Marty = require('marty');
const EntityConstants = require('../constants/EntityConstants');
const _ = require('lodash');

class EntityStore extends Marty.Store {
  constructor(options){
    super(options);
    this.state = {
      entities: {}
    };
    this.handlers = {
      addEntity: EntityConstants.RETRIEVE_ENTITY_DONE
    };
  }

  addEntity(entity){
    _.merge({}, this.state, {entities: {[entity.id]: entity }});
  }

  getEntity(id){
    return this.fetch({
      id: 'getEntity',
      locally: () => this.state.entities[id],
      remotely: () => this.app.entityQueries.getEntity(id)
    });
  }
}
module.exports = EntityStore;
