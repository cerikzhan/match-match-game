import './settings.css';
import { elFactory, selectFactory } from '../../utils';
import { BaseComponent } from '../base-component';

export class Settings extends BaseComponent {
  settings: { [prop: string]: string };

  typeSelect: HTMLSelectElement;

  diffSelect: HTMLSelectElement;

  constructor() {
    super('div', ['container']);

    this.settings = {};
    this.typeSelect = selectFactory(
      {
        class: 'setting-select',
        name: 'card-types-select',
        id: 'card-types-select',
      },
      elFactory('option', { value: 'animals' }, 'Animals'),
      elFactory('option', { value: 'dogs' }, 'Dogs'),
      elFactory('option', { value: 'nature' }, 'Nature')
    );
    this.diffSelect = selectFactory(
      {
        class: 'setting-select',
        name: 'difficulty-select',
        id: 'difficulty-select',
      },
      elFactory('option', { value: '4' }, '4x4'),
      elFactory('option', { value: '6' }, '6x6'),
      elFactory('option', { value: '8' }, '8x8')
    );
    this.fillContent();
  }

  private fillContent(): void {
    const localSettings = localStorage.getItem('settings');
    if (localSettings) {
      this.settings = JSON.parse(localSettings);
    }
    const typeTitle = elFactory(
      'h3',
      { class: 'settings-title' },
      'Game Cards'
    );
    const cardTypesNode = elFactory(
      'div',
      { class: 'card-types-setting' },
      typeTitle,
      this.typeSelect
    );

    const diffTitle = elFactory(
      'h3',
      { class: 'settings-title' },
      'Difficulty'
    );

    const cardDiffNode = elFactory(
      'div',
      { class: 'difficulty-setting' },
      diffTitle,
      this.diffSelect
    );

    const settingsNode = elFactory(
      'div',
      { class: 'settings' },
      cardTypesNode,
      cardDiffNode
    );

    if (this.settings.typeVal) {
      this.typeSelect.value = this.settings.typeVal;
    }
    if (this.settings.diffVal) {
      this.diffSelect.value = this.settings.diffVal;
    }

    settingsNode.addEventListener('change', this.settingsListener.bind(this));
    this.element.appendChild(settingsNode);
  }

  settingsListener(): void {
    const typeVal = this.typeSelect.value;
    const diffVal = this.diffSelect.value;
    localStorage.setItem('settings', JSON.stringify({ typeVal, diffVal }));
  }
}
