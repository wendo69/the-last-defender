import {entity} from "./entity.js";


export const task_component = (() => {

  const _TITLE = 'Welcome Adventurer!';
  const _TEXT = `In the village of Grimhollow, nestled at the edge of the Enchanted Forest, a dark and ominous portal has opened, unleashing a horde of menacing monsters upon the unsuspecting townsfolk. The terrified villagers seek a brave adventurer to delve into the heart of the Enchanted Forest, close the portal, and eliminate the monstrous threat.`;

  class QuestComponent extends entity.Component {
    constructor() {
      super();

      const e = document.getElementById('task-ui');
      e.style.visibility = 'hidden';
    }

    InitComponent() {
      this._RegisterHandler('input.picked', (m) => this._OnPicked(m));
    }

    _OnPicked(msg) {
      // HARDCODE A QUEST
      const quest = {
        id: 'foo',
        title: _TITLE,
        text: _TEXT,
      };
      this._AddQuestToJournal(quest);
    }

    _AddQuestToJournal(quest) {
      const ui = this.FindEntity('ui').GetComponent('UIController');
      ui.AddQuest(quest);
    }
  };

  return {
      QuestComponent: QuestComponent,
  };
})();