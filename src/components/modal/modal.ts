import './modal.css';
import { elFactory } from '../../utils';
import { BaseComponent } from '../base-component';

const ANIMATION_SPEED = 200;

interface RejectPromise {
  handler(): void;
}

export class Modal extends BaseComponent {
  closing: boolean;

  destroyed: boolean;

  form: HTMLFormElement;

  title: string;

  closable: boolean;

  reject: RejectPromise | undefined;

  constructor(
    title: string,
    closable: boolean,
    form: HTMLFormElement,
    reject?: RejectPromise
  ) {
    super('div', ['modal']);
    this.closing = false;
    this.destroyed = false;
    this.title = title;
    this.closable = closable;
    this.form = form;
    this.reject = reject;
    this.fillContent();
  }

  private fillContent(): void {
    const modalTitle = elFactory('span', { class: 'modal-title' }, this.title);
    let closeSymbol = elFactory('span', {});
    if (this.closable) {
      closeSymbol = elFactory(
        'span',
        { class: 'modal-close close-btn', 'data-close': 'true' },
        'x'
      );
    }
    const modalHeader = elFactory(
      'div',
      { class: 'modal-header' },
      modalTitle,
      closeSymbol
    );
    const modalBody = elFactory('div', { class: 'modal-body' });
    modalBody.appendChild(this.form);
    const modalWindow = elFactory(
      'div',
      { class: 'modal-window' },
      modalHeader,
      modalBody
    );
    let modalOverlay = elFactory(
      'div',
      { class: 'modal-overlay' },
      modalWindow
    );
    if (this.closable) {
      modalOverlay = elFactory(
        'div',
        { class: 'modal-overlay', 'data-close': 'true' },
        modalWindow
      );
    }
    this.element.appendChild(modalOverlay);
    this.element.addEventListener('click', this.modalListener.bind(this));
    document.body.appendChild(this.element);
  }

  open(): void {
    if (this.destroyed) return;
    if (!this.closing) this.element.classList.add('open');
  }

  close(): void {
    this.closing = true;
    this.element.classList.remove('open');
    this.element.classList.add('hide');
    setTimeout(() => {
      this.element.classList.remove('hide');
      this.closing = false;
      this.destroy();
      if (this.reject) this.reject.handler();
    }, ANIMATION_SPEED);
  }

  destroy(): void {
    document.body.removeChild(this.element);
    this.element.removeEventListener('click', this.modalListener.bind(this));
    this.destroyed = true;
  }

  modalListener(event: MouseEvent): void {
    if ((event.target as HTMLElement).dataset.close) {
      event.preventDefault();
      this.close();
    }
  }
}
