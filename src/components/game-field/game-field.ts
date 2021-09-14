import { BaseComponent } from '../base-component';
import { Card } from '../card/card';

export class GameField extends BaseComponent {
  private cards: Card[] = [];

  constructor() {
    super('div', ['cards']);
  }

  clear(): void {
    this.cards = [];
    this.element.innerHTML = '';
  }

  addCards(cards: Card[]): void {
    this.cards = cards;
    this.cards.forEach((card) => {
      this.element.appendChild(card.element);
      card.flipToFront();
    });
  }
}
