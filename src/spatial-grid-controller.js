import {entity} from './entity.js';


export const spatial_grid_controller = (() => {

  //Manages spatial grid functionality for entities.
  class SpatialGridController extends entity.Component {
    constructor(params) {
      super();

      this._grid = params.grid;
    }

    //Registers an update position handler to update the client's position in the spatial grid.
    InitComponent() {
      const pos = [
          this._parent._position.x,
          this._parent._position.z,
      ];

      this._client = this._grid.NewClient(pos, [1, 1]);
      this._client.entity = this._parent;
      this._RegisterHandler('update.position', (m) => this._OnPosition(m));
    }

    //Handles the 'update.position' message by updating the client's position in the spatial grid
    _OnPosition(msg) {
      this._client.position = [msg.value.x, msg.value.z];
      this._grid.UpdateClient(this._client);
    }

    //Finds nearby entities within a specified range in the spatial grid.
    //Excludes the parent entity from the results.
    FindNearbyEntities(range) {
      const results = this._grid.FindNear(
          [this._parent._position.x, this._parent._position.z], [range, range]);
          
      return results.filter(c => c.entity != this._parent);
    }
  };

  return {
      SpatialGridController: SpatialGridController,
  };
})();