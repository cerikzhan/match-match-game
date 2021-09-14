import './score.css';
import { elFactory } from '../../utils';
import { BaseComponent } from '../base-component';
import { RecordModel, RecordType } from '../../db/record_model';

export class Score extends BaseComponent {
  scoreData: RecordType[];

  model: RecordModel;

  constructor(recData: RecordType[]) {
    super('div', ['container']);
    this.model = new RecordModel();
    this.scoreData = recData;
    this.fillContent();
  }

  private fillContent(): void {
    const scoreTitle = elFactory(
      'h3',
      { class: 'score-title' },
      'Best players'
    );
    const scoreWrapper = elFactory('ul', { class: 'score-list' }, '');
    if (this.scoreData.length === 0) {
      const text = elFactory(
        'p',
        { class: 'not-players' },
        'Records list is empty'
      );
      scoreWrapper.appendChild(text);
    } else {
      for (let i = 0; i < this.scoreData.length; i++) {
        Score.scoreList(this.scoreData[i], scoreWrapper);
      }
    }
    this.element.appendChild(scoreTitle);
    this.element.appendChild(scoreWrapper);
  }

  static scoreList(score: RecordType, scoreWrapper: HTMLElement): void {
    const avatar = elFactory(
      'div',
      { class: 'avatar-image' },
      elFactory('img', { src: score.avatar, alt: 'avatar' }, '')
    );

    const userInfo = elFactory(
      'div',
      { class: 'user-info' },
      elFactory(
        'h4',
        { class: 'username' },
        `${score.firstName} ${score.lastName}`
      ),
      elFactory('p', { class: 'useremail' }, score.email)
    );
    const scoreText = elFactory(
      'div',
      { class: 'score' },
      elFactory('span', { class: 'score-text' }, 'Score:'),
      elFactory('span', { class: 'score-number' }, `${score.score}`)
    );
    const scoreItem = elFactory(
      'li',
      { class: 'score-item' },
      avatar,
      userInfo,
      scoreText
    );
    scoreWrapper.appendChild(scoreItem);
  }
}
