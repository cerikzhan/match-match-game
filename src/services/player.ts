import { UserType } from '../db/user_model';

export class Player {
  static instance: Player;

  name: string;

  player: UserType = {} as UserType;

  constructor() {
    this.name = 'player';
    if (!Player.instance) {
      Player.instance = this;
    }
    return Player.instance;
  }

  getPlayer(): UserType {
    const localStorageData = localStorage.getItem(this.name);
    let player: UserType = {} as UserType;
    if (localStorageData) {
      player = JSON.parse(localStorageData);
    }
    this.player = player;
    return this.player;
  }

  setPlayer(values: UserType): void {
    this.player = values;
    localStorage.setItem(this.name, JSON.stringify(values));
  }

  removePlayer(): void {
    localStorage.removeItem(this.name);
    localStorage.removeItem('settings');
  }
}
