import {entity} from './entity.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';


export const equip_weapon_component = (() => {

  class EquipWeapon extends entity.Component {
    constructor(params) {
      super();
      this._params = params;
      this._target = null;
      this._name = null;
    }

    //Initializing Component
    InitComponent() {
      this._RegisterHandler('load.character', (m) => this._OnCharacterLoaded(m));
      this._RegisterHandler('inventory.equip', (m) => this._OnEquip(m));
    }

    //Getting Weapon Name
    get Name() {
      return this._name;
    }

    _OnCharacterLoaded(msg) {
      this._bones = msg.bones;
      this._AttachTarget();
    }

   //Attaching Target Weapon
    _AttachTarget() {
      if (this._bones && this._target) {
        this._bones[this._params.anchor].add(this._target);
      }
    }

    //triggered when an equip event occurs. It unloads existing models, gets the item from the inventory, sets the new weapon name, and loads the models for the new weapon
    _OnEquip(msg) {
      if (msg.value == this._name) {
        return;
      }

      if (this._target) {
        this._UnloadModels();
      }
      const inventory = this.GetComponent('InventoryController');
      const item = inventory.GetItemByName(msg.value).GetComponent('InventoryItem');
      this._name = msg.value;

      this._LoadModels(item, () => {
        this._AttachTarget();
      });
    }

    //method removes the target weapon from its parent, effectively unloading it.
    _UnloadModels() {
      if (this._target) {
        this._target.parent.remove(this._target);
        // Probably need to free the memory properly,
        this._target = null;
      }
    }

    //uses the FBXLoader to load the 3D model for the weapon. It applies scaling and rotation, sets shadow properties, and broadcasts a message about the loaded weapon.
    _LoadModels(item, cb) {
      const loader = new FBXLoader();
      loader.setPath('./resources/weapons/FBX/');
      loader.load(item.RenderParams.name + '.fbx', (fbx) => {
        this._target = fbx;
        this._target.scale.setScalar(item.RenderParams.scale);
        this._target.rotateY(Math.PI);
        this._target.rotateX(-Math.PI / 3);
        this._target.rotateY(-1);

        this._target.traverse(c => {
          c.castShadow = true;
          c.receiveShadow = true;
        });

        cb();

        this.Broadcast({
            topic: 'load.weapon',
            model: this._target,
            bones: this._bones,
        });
      });
    }
  };

  return {
      EquipWeapon: EquipWeapon,
  };
})();