import { BaseComponent } from '../base-component';
import cardBack from '../../assets/images/card-back.jpg';
import { delay, elFactory } from '../../utils';

export class Card extends BaseComponent {
  image: string;

  constructor(image: string) {
    super('div', ['card']);
    this.image = image;
    this.fillContent();
  }

  fillContent(): void {
    const cardBackEl = elFactory(
      'div',
      { class: 'card-back' },
      elFactory('img', { src: `${cardBack}`, alt: 'card-back' }, '')
    );
    const cardFrontEl = elFactory(
      'div',
      { class: 'card-front' },
      elFactory('img', { src: `images/${this.image}`, alt: 'pingvin' }, '')
    );
    this.element.appendChild(cardBackEl);
    this.element.appendChild(cardFrontEl);
  }

  flipToFront(): void {
    this.flipCard(true);
  }

  flipToBack(): void {
    this.flipCard();
  }

  private flipCard(isFront = false): Promise<void> {
    this.element.classList.add('hiding');
    return new Promise((resolve) => {
      this.element.classList.toggle('visible', isFront);
      this.element.addEventListener(
        'transitionend',
        () => {
          this.element.classList.remove('hiding');
          resolve();
        },
        {
          once: true,
        }
      );
    });
  }

  async notMatchCard(): Promise<void> {
    this.element.classList.add('wrong');
    await delay(1000);
    this.flipToBack();
    this.element.classList.remove('wrong');
  }

  matchCard(): void {
    this.element.style.zIndex = '0';
    this.element.classList.add('match');
  }
}
