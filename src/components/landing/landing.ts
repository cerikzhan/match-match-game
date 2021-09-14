import { BaseComponent } from '../base-component';
import './landing.css';
import registerImage from '../../assets/images/register.jpg';
import settingsImage from '../../assets/images/settings.jpg';
import gameImage from '../../assets/images/game.jpg';

export class Landing extends BaseComponent {
  constructor() {
    super('div', ['container']);
    this.element.innerHTML = `
    <h2 class="main-title">How to play?</h2>
      <div class="blocks">
        <div class="block-item block">
          <div class="block-number">1</div>
          <p class="block-text">Register new player in game</p>
        </div>
        <div class="block-item block-image">
          <img src="${registerImage}" alt="register">
        </div>
        <div class="block-item block">
          <div class="block-number">2</div>          
          <p class="block-text">Configure your game settings</p>
        </div>
        <div class="block-item block-image">
          <img src="${settingsImage}" alt="settings">
        </div>
        <div class="block-item block">
          <div class="block-number">3</div>      
          <p class="block-text">Start you new game! Remember block positions and match it before times up.</p>
        </div>
        <div class="block-item block-image">
          <img src="${gameImage}" alt="game">
        </div>
      </div>
    `;
  }
}
