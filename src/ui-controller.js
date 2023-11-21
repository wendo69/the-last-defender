import {entity} from './entity.js';


export const ui_controller = (() => {

  class UIController extends entity.Component {
    constructor(params) {
      super();
      this._params = params;
      this._quests = {};
    }
  
    InitComponent() {
      this._iconBar = {
        stats: document.getElementById('icon-bar-stats'),
        inventory: document.getElementById('icon-bar-inventory'),
        quests: document.getElementById('icon-bar-quests'),
      };

      this._ui = {
        inventory: document.getElementById('inventory'),
        stats: document.getElementById('stats'),
        quests: document.getElementById('task-journal'),
      };

      this._iconBar.inventory.onclick = (m) => { this._OnInventoryClicked(m); };
      this._iconBar.stats.onclick = (m) => { this._OnStatsClicked(m); };
      this._iconBar.quests.onclick = (m) => { this._OnQuestsClicked(m); };
      this._HideUI();
    }

    AddQuest(quest) {
      if (quest.id in this._quests) {
        return;
      }

      const e = document.createElement('DIV');
      e.className = 'quest-entry';
      e.id = 'quest-entry-' + quest.id;
      e.innerText = quest.title;
      e.onclick = (evt) => {
        this._OnQuestSelected(e.id);
      };
      document.getElementById('task-journal').appendChild(e);

      this._quests[quest.id] = quest;
      this._OnQuestSelected(quest.id);
    }

    _OnQuestSelected(id) {
      const quest = this._quests[id];

      const e = document.getElementById('task-ui');
      e.style.visibility = '';

      const text = document.getElementById('task-text');
      text.innerText = quest.text;

      const title = document.getElementById('task-text-title');
      title.innerText = quest.title;
    }

    _HideUI() {
      this._ui.inventory.style.visibility = 'hidden';
      this._ui.stats.style.visibility = 'hidden';
      this._ui.quests.style.visibility = 'hidden';
    }
    
    _OnQuestsClicked(msg) {
      const visibility = this._ui.quests.style.visibility;
      this._HideUI();
      this._ui.quests.style.visibility = (visibility ? '' : 'hidden');
    }

    _OnStatsClicked(msg) {
      const visibility = this._ui.stats.style.visibility;
      this._HideUI();
      this._ui.stats.style.visibility = (visibility ? '' : 'hidden');
    }

    _OnInventoryClicked(msg) {
      const visibility = this._ui.inventory.style.visibility;
      this._HideUI();
      this._ui.inventory.style.visibility = (visibility ? '' : 'hidden');
    }

    Update(timeInSeconds) {
    }
  };

  return {
    UIController: UIController,
  };

})();