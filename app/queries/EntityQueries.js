const Marty = require('marty');
const EntityConstants = require('../constants/EntityConstants');
const lsApi = require('../api/lsApi');

class EntityQueries extends Marty.Queries {
  getEntity(id){
    this.dispatch(EntityConstants.RETRIEVE_ENTITY_STARTING);
    return lsApi.getMap(id)
      .then(res => {
        this.dispatch(EntityConstants.RETRIEVE_ENTITY_DONE, res); })
      .catch(err => {
        this.dispatch(EntityConstants.RETRIEVE_ENTITY_FAILED, err);
      });
  }
}

module.exports = EntityQueries;
