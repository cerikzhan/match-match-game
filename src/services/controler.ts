import '../style.css';
import { Header } from '../components/header/header';
import { Landing } from '../components/landing/landing';
import { Settings } from '../components/settings/settings';
import { Modal } from '../components/modal/modal';
import { Score } from '../components/score/score';
import { RegisterForm } from '../components/registerForm/form';
import { elFactory } from '../utils';
import { Game } from '../components/game/game';

import images from '../assets/data/images.json';
import { Confirmation } from '../components/confirm/confirm';
import { RecordModel, RecordType } from '../db/record_model';
import { Timer } from '../components/timer/timer';
import { Player } from './player';

interface Images {
  animals: string[];
  dogs: string[];
  nature: string[];
}

let startGameTimeout: NodeJS.Timeout;

function setRootElements(
  headerInner: HTMLElement,
  mainInner: HTMLElement
): void {
  const header = elFactory('header', { class: 'header', id: 'header' }, '');
  const main = elFactory('main', { class: 'main', id: 'app' }, '');
  header.appendChild(headerInner);
  main.appendChild(mainInner);
  document.body.innerHTML = '';
  document.body.appendChild(header);
  document.body.appendChild(main);
}

function registerModalHandler(): void {
  const form = new RegisterForm();
  const modal = new Modal('Register new Player', true, form.element);
  modal.open();
}

function stopGameModalHandler() {
  const timer = new Timer();
  timer.paused = true;
  const prom = new Promise((resolve, reject) => {
    const confirm = new Confirmation(
      'You realy want to leave the game',
      true,
      'score',
      resolve
    );
    const modal = new Modal('Quite game!', true, confirm.element, {
      handler: reject,
    });

    modal.open();
  });
  prom
    .then(() => {
      timer.paused = false;
    })
    .catch(() => {
      timer.paused = false;
    });
}

function headerListeners(header: Header) {
  header.registerBtn.onClick = () => {
    registerModalHandler();
  };
  header.startBtn.onClick = () => {
    window.location.hash = 'start';
  };
  header.stopBtn.onClick = () => {
    stopGameModalHandler();
  };
  header.logoutBtn.onClick = () => {
    const prom = new Promise((resolve) => {
      const confirm = new Confirmation(
        'You realy want to logout!',
        true,
        'landing',
        resolve
      );
      const modal = new Modal('Logout!', true, confirm.element);
      modal.open();
    });

    prom.then((status) => {
      if (status) {
        const player = new Player();
        player.removePlayer();
      }
    });
  };
}

export default {
  landingRoute(): void {
    const header = new Header('landing');
    headerListeners(header);
    const main = new Landing();
    setRootElements(header.element, main.element);
  },

  async scoreRoute(): Promise<void> {
    const model = new RecordModel();
    await model.initialize();
    let recData: RecordType[] = [];
    await model.getAll().then((arr) => arr.forEach((rec) => recData.push(rec)));
    recData = recData.sort((r1, r2) => r2.score - r1.score);
    if (recData.length > 10) recData.splice(10);
    const header = new Header('score');
    headerListeners(header);
    const score = new Score(recData);
    setRootElements(header.element, score.element);
  },

  settingsRoute(): void {
    const header = new Header('settings');
    headerListeners(header);
    const settings = new Settings();
    setRootElements(header.element, settings.element);
  },

  startRoute(): void {
    const header = new Header('game');
    headerListeners(header);
    const game = new Game();
    const settings = localStorage.getItem('settings');
    let category: keyof Images;
    let difficulty: number;
    if (!settings) {
      category = 'animals';
      difficulty = 4;
    } else {
      const { typeVal, diffVal } = JSON.parse(settings);
      category = typeVal;
      difficulty = parseInt(diffVal, 10);
    }
    document.documentElement.style.setProperty(
      '--card-for-row',
      `${difficulty}`
    );
    if (startGameTimeout) clearTimeout(startGameTimeout);
    const timeout = game.newGame(
      images[category]
        .sort(() => Math.random() - 0.5)
        .slice(0, (difficulty * difficulty) / 2)
        .map((img) => `${category}/${img}`)
    );
    startGameTimeout = timeout;
    setRootElements(header.element, game.element);
  },
};
