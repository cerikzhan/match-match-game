import './header.css';
import { BaseComponent } from '../base-component';
import { elFactory } from '../../utils';
import { UserType } from '../../db/user_model';
import { Player } from '../../services/player';
import { Button } from '../button/button';
import logo from '../../assets/icons/logo.svg';
import about from '../../assets/icons/about.svg';
import settings from '../../assets/icons/gear.svg';
import star from '../../assets/icons/star.svg';

const navItems = [
  { text: 'About Game', link: 'landing' },
  { text: 'Best Score', link: 'score' },
  { text: 'Settings', link: 'settings' },
];

export class Header extends BaseComponent {
  navbarItems: HTMLElement[];

  player: UserType = {} as UserType;

  page: string;

  logoutBtn: Button;

  startBtn: Button;

  registerBtn: Button;

  stopBtn: Button;

  constructor(page: string) {
    super('div', ['container']);
    this.player = new Player().getPlayer();
    this.startBtn = new Button('start game');
    this.stopBtn = new Button('stop game');
    this.logoutBtn = new Button('logout');
    this.registerBtn = new Button('register new player');
    this.page = page;
    this.navbarItems = [];
    this.element.appendChild(
      elFactory(
        'div',
        { class: 'logo-wrapper' },
        elFactory(
          'span',
          { class: 'logo' },
          elFactory('img', { class: 'logo', src: `${logo}` }, '')
        )
      )
    );
    this.navbar();
    this.playerInfo();
  }

  private navbar(): void {
    const navIcons = [about, star, settings];
    for (let i = 0; i < navItems.length; i++) {
      const icon = elFactory('img', { class: 'icon', src: navIcons[i] });
      const text = elFactory('span', { class: 'text' }, navItems[i].text);
      const link = elFactory(
        'a',
        { href: `#${navItems[i].link}`, class: 'navbar-link' },
        icon,
        text
      );
      const li = elFactory(
        'li',
        {
          class: `navbar-item ${
            this.page === navItems[i].link ? 'active' : ''
          }`,
        },
        link
      );
      this.navbarItems.push(li);
    }
    const ul = elFactory('ul', { class: 'navbar-list' }, ...this.navbarItems);
    const navbar = elFactory('nav', { class: 'navbar' }, ul);
    this.element.appendChild(navbar);
  }

  private playerInfo(): void {
    const childs = [];
    if (this.player.firstName) {
      const avatar = elFactory(
        'div',
        { class: 'avatar' },
        elFactory(
          'img',
          { class: 'avatar-image', src: this.player.avatar, alt: 'avatar' },
          ''
        )
      );
      if (this.page === 'game') {
        childs.push(this.stopBtn.element);
      } else {
        childs.push(this.startBtn.element);
        childs.push(this.logoutBtn.element);
      }
      childs.push(avatar);
    } else {
      childs.push(this.registerBtn.element);
    }
    const wrapper = elFactory('div', { class: 'player-wrapper' }, ...childs);
    this.element.appendChild(wrapper);
  }
}
