import './button.css';
import { BaseComponent } from '../base-component';

export class Button extends BaseComponent {
  public onClick!: () => void;

  constructor(caption: string, ...styles: string[]) {
    super('button', ['btn', ...styles]);
    this.element.textContent = caption;
    this.element.onclick = () => {
      if (this.onClick) this.onClick();
    };
  }
}
