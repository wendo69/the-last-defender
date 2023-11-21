import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


export const entity = (() => {

  class Entity {
    constructor() {
      this._name = null;
      this._components = {};

      this._position = new THREE.Vector3();
      this._rotation = new THREE.Quaternion();
      this._handlers = {};
      this._parent = null;
    }

    //Registering Event Handlers
    _RegisterHandler(n, h) {
      if (!(n in this._handlers)) {
        this._handlers[n] = [];
      }
      this._handlers[n].push(h);
    }

    //Setting Parent for an Entity
    SetParent(p) {
      this._parent = p;
    }

    //Setting Name for an Entity
    SetName(n) {
      this._name = n;
    }

    //Getting Name of an Entity
    get Name() {
      return this._name;
    }

    //Setting Entity Activity
    SetActive(b) {
      this._parent.SetActive(this, b);
    }

    //Adding a Component to an Entity
    AddComponent(c) {
      c.SetParent(this);
      this._components[c.constructor.name] = c;

      c.InitComponent();
    }

    //Getting a Component by Name
    GetComponent(n) {
      return this._components[n];
    }

    //Finding an Entity by Name
    FindEntity(n) {
      return this._parent.Get(n);
    }

    //Broadcasting a Message
    Broadcast(msg) {
      if (!(msg.topic in this._handlers)) {
        return;
      }

      for (let curHandler of this._handlers[msg.topic]) {
        curHandler(msg);
      }
    }

    //Setting Position and Broadcasting
    SetPosition(p) {
      this._position.copy(p);
      this.Broadcast({
          topic: 'update.position',
          value: this._position,
      });
    }

    //Setting Quaternion (Rotation) and Broadcasting
    SetQuaternion(r) {
      this._rotation.copy(r);
      this.Broadcast({
          topic: 'update.rotation',
          value: this._rotation,
      });
    }

    //Updating an Entity
    Update(timeElapsed) {
      for (let k in this._components) {
        this._components[k].Update(timeElapsed);
      }
    }
  };

  class Component {
    constructor() {   //The constructor initializes the parent property for a component.
      this._parent = null;
    }

    //Setting Parent for a Component
    SetParent(p) {
      this._parent = p;
    }

    InitComponent() {}

    //Getting a Component by Name
    GetComponent(n) {
      return this._parent.GetComponent(n);
    }

    FindEntity(n) {
      return this._parent.FindEntity(n);
    }

    Broadcast(m) {
      this._parent.Broadcast(m);
    }

    //Updating a Component
    Update(_) {}

    //Registering Event Handlers for Components
    _RegisterHandler(n, h) {
      this._parent._RegisterHandler(n, h);
    }
  };

  //Returning the Module
  return {
    Entity: Entity,
    Component: Component,
  };

})();