import './confirm.css';
import { elFactory } from '../../utils';
import { BaseFormElement } from '../base-form-element';

export class Confirmation extends BaseFormElement {
  text: string;

  cancelable: boolean;

  constructor(
    text: string,
    cancelable: boolean,
    page: string,
    resolve?: (status: boolean) => void
  ) {
    super(['confirm-form']);
    this.text = text;
    this.cancelable = cancelable;
    this.fillContent();
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      if (resolve) resolve(true);
      window.location.hash =
        page === window.location.hash.substr(1) ? '' : page;
    });
  }

  fillContent(): void {
    const msg = elFactory('p', { class: 'messege' }, this.text);
    const formBody = elFactory('div', { class: 'form-body' }, msg);
    const submitBtn = elFactory(
      'button',
      { class: 'btn accept-btn', type: 'submit' },
      'OK'
    );
    const formFooter = elFactory('div', { class: 'form-footer' }, submitBtn);
    if (this.cancelable) {
      const cancelBtn = elFactory(
        'button',
        { class: 'btn close-btn', 'data-close': 'true' },
        'Cancel'
      );
      formFooter.appendChild(cancelBtn);
    }
    this.element.appendChild(formBody);
    this.element.appendChild(formFooter);
  }
}
