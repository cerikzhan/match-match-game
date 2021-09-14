import { elFactory } from '../../utils';
import { BaseComponent } from '../base-component';

export class Timer extends BaseComponent {
  timer: HTMLElement;

  static instance: Timer;

  public timerNumber = 0;

  countUpInterval: NodeJS.Timeout = setInterval(() => {});

  countDownInterval: NodeJS.Timeout = setInterval(() => {});

  public paused = false;

  constructor() {
    super('span', ['time']);
    this.timer = elFactory('span', { id: 'time-number' }, '00:00');
    const text = elFactory('span', {}, 'Time: ');
    this.element.appendChild(text);
    this.element.appendChild(this.timer);
    if (!Timer.instance) {
      Timer.instance = this;
    }
    return Timer.instance;
  }

  startCountDown(start: number): void {
    this.clear();
    this.timerNumber = start / 1000;
    let minutes;
    let seconds;
    this.countDownInterval = setInterval(() => {
      minutes = Math.floor(this.timerNumber / 60);
      seconds = this.timerNumber % 60;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      if (!this.paused) {
        this.timer.innerText = `${minutes}:${seconds}`;
        this.timerNumber -= 1;
      }
    }, 1000);
  }

  startTimer(): void {
    this.clear();
    this.timerNumber = 0;
    let minutes;
    let seconds;
    this.countUpInterval = setInterval(() => {
      minutes = Math.floor(this.timerNumber / 60);
      seconds = this.timerNumber % 60;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      if (!this.paused) {
        this.timer.innerText = `${minutes}:${seconds}`;
        this.timerNumber += 1;
      }
    }, 1000);
  }

  clear(): void {
    clearInterval(this.countUpInterval);
    clearInterval(this.countDownInterval);
    this.timerNumber = 0;
  }
}
