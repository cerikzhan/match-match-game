export class BaseFormElement {
  readonly element: HTMLFormElement;

  constructor(styles: string[] = []) {
    this.element = document.createElement('form');
    this.element.classList.add(...styles);
  }
}
