

export const entity_manager = (() => {

  class EntityManager {
    constructor() {
      this._ids = 0;
      this._entitiesMap = {};
      this._entities = [];
    }

    //A method that generates unique names for entities by incrementing an ID counter.
    _GenerateName() {
      this._ids += 1;

      return '__name__' + this._ids;
    }

    //A method to retrieve an entity by its name from the _entitiesMap.
    Get(n) {
      return this._entitiesMap[n];
    }

    //A method that filters entities based on a provided callback function.
    Filter(cb) {
      return this._entities.filter(cb);
    }

    //Adds an entity to the manager. If no name is provided, it generates a unique name. It updates the map and array of entities and sets the entity's parent and name.
    Add(e, n) {
      if (!n) {
        n = this._GenerateName();
      }

      this._entitiesMap[n] = e;
      this._entities.push(e);

      e.SetParent(this);
      e.SetName(n);
    }

    //Sets the activity of an entity. If b is true, it removes the entity from the array of active entities
    SetActive(e, b) {
      const i = this._entities.indexOf(e);
      if (i < 0) {
        return;
      }

      this._entities.splice(i, 1);
    }

    //Calls the Update method for each entity in the manager, allowing them to update their state based on the elapsed time.
    Update(timeElapsed) {
      for (let e of this._entities) {
        e.Update(timeElapsed);
      }
    }
  }

  //Returns an object with the EntityManager class as a property, effectively exposing it as the public interface of the module.
  return {
    EntityManager: EntityManager
  };

})();