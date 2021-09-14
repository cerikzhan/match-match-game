import './game.css';
import { delay, elFactory } from '../../utils';
import { BaseComponent } from '../base-component';
import { Card } from '../card/card';
import { GameField } from '../game-field/game-field';
import { Modal } from '../modal/modal';
import { Confirmation } from '../confirm/confirm';
import { Timer } from '../timer/timer';
import { Player } from '../../services/player';
import { RecordModel } from '../../db/record_model';

const SHOW_TIME = 30000;

export class Game extends BaseComponent {
  private cardsContainer: GameField;

  private activeCard?: Card;

  private isAnimation = false;

  private cardAmount = 0;

  private triesNumber = 0;

  private wrongTries = 0;

  timer: Timer;

  tries: HTMLElement;

  paused = false;

  playerClass: Player;

  recordModel: RecordModel;

  constructor() {
    super('div', ['container']);
    this.timer = new Timer();
    this.playerClass = new Player();
    this.recordModel = new RecordModel();
    this.recordModel.initialize();

    this.tries = elFactory('span', { id: 'flip-number' }, '0');

    const flips = elFactory(
      'p',
      { class: 'flips' },
      elFactory('span', {}, 'Tries: '),
      this.tries
    );

    const gameInfo = elFactory(
      'div',
      { class: 'game-info' },
      this.timer.element,
      flips
    );
    this.element.appendChild(gameInfo);
    this.cardsContainer = new GameField();
    this.element.appendChild(this.cardsContainer.element);
  }

  newGame(images: string[]): NodeJS.Timeout {
    this.cardsContainer.clear();
    this.cardAmount = 0;
    this.cardAmount = images.length;
    const cards = images
      .concat(images)
      .map((url) => new Card(url))
      .sort(() => Math.random() - 0.5);
    cards.forEach((card) => {
      card.element.addEventListener('click', () => {
        this.cardStateHandler(card);
      });
    });
    this.cardsContainer.addCards(cards);
    this.timer.startCountDown(SHOW_TIME);
    const startGameTimeout = setTimeout(() => {
      cards.forEach((card) => card.flipToBack());
      this.timer.startTimer();
    }, SHOW_TIME + 1000);
    return startGameTimeout;
  }

  stopGame(title: string, text: string): void {
    this.timer.clear();
    const confirmForm = new Confirmation(text, title === 'Quit game!', 'score');
    const confirm = new Modal(title, false, confirmForm.element);
    confirm.open();
  }

  private async cardStateHandler(card: Card) {
    if (this.isAnimation) return;
    this.isAnimation = true;
    await card.flipToFront();
    if (!this.activeCard) {
      this.activeCard = card;
      this.isAnimation = false;
      return;
    }
    if (this.activeCard.image !== card.image) {
      await delay(2000);
      this.activeCard.notMatchCard();
      card.notMatchCard();
      this.wrongTries++;
      await Promise.all([this.activeCard.flipToBack(), card.flipToBack()]);
    } else {
      await delay(2000);
      this.activeCard.matchCard();
      card.matchCard();
      this.cardAmount--;
      if (this.cardAmount <= 0) {
        this.stopGame(
          'Congratulations!',
          `You win! Your score is ${this.calculateScore()} points!`
        );
      }
    }
    this.activeCard = undefined;
    this.isAnimation = false;
    this.triesCountUp();
  }

  calculateScore(): number {
    let score =
      (this.triesNumber - this.wrongTries) * 100 - this.timer.timerNumber * 10;
    score = score > 0 ? score : 0;
    const player = this.playerClass.getPlayer();
    this.recordModel.write({
      firstName: player.firstName,
      lastName: player.lastName,
      email: player.email,
      avatar: player.avatar,
      score,
    });
    return score;
  }

  private triesCountUp() {
    this.triesNumber += 1;
    this.tries.innerText = this.triesNumber.toString();
  }
}
