import './form.css';
import { elFactory } from '../../utils';
import { BaseFormElement } from '../base-form-element';

import correctIcon from '../../assets/icons/match.svg';
import wrongIcon from '../../assets/icons/wrong.svg';
import { validator } from './validator';
import { UserType } from '../../db/user_model';
import { Player } from '../../services/player';
import { Canvas } from '../canvas/canvas';

const inputsData = [
  { text: 'First Name', id: 'firstName' },
  { text: 'Last Name', id: 'lastName' },
  { text: 'Email', id: 'email' },
];

export class RegisterForm extends BaseFormElement {
  inputs: { [props: string]: HTMLInputElement };

  errorMsg: { [props: string]: HTMLElement };

  player: Player;

  avatarImage: Canvas;

  constructor() {
    super(['register-form']);
    this.player = new Player();
    this.inputs = {};
    this.errorMsg = {};
    this.avatarImage = new Canvas();
    this.fillContent();
    this.element.addEventListener(
      'submit',
      this.formClickEventListener.bind(this)
    );
  }

  private fillContent(): void {
    const formGroup = elFactory('div', { class: 'form-group' }, '');

    for (let i = 0; i < inputsData.length; i++) {
      const label = elFactory(
        'label',
        { for: inputsData[i].id },
        inputsData[i].text
      );
      const input: HTMLInputElement = document.createElement('input');
      input.classList.add('input');
      input.type = 'text';
      input.name = inputsData[i].text;
      input.id = inputsData[i].id;
      input.maxLength = 30;
      this.inputs[inputsData[i].id] = input;
      const errorText = elFactory('small', { class: 'error-msg' }, '');
      this.errorMsg[`${inputsData[i].id}Error`] = errorText;
      const corrIcon = elFactory(
        'img',
        { class: 'status-icon correct', src: `${correctIcon}`, alt: 'correct' },
        ''
      );
      const errorIcon = elFactory(
        'img',
        { class: 'status-icon wrong', src: `${wrongIcon}`, alt: 'error' },
        ''
      );
      const formControl = elFactory(
        'div',
        { class: 'form-control' },
        label,
        input,
        errorText,
        corrIcon,
        errorIcon
      );
      formGroup.appendChild(formControl);
    }

    const avatarWrapper = elFactory(
      'div',
      { class: 'avatar-wrapper' },
      this.avatarImage.element
    );
    const btnInput = document.createElement('input');
    btnInput.classList.add('btn-input');
    btnInput.id = 'btn-input';
    btnInput.name = 'upload';
    btnInput.type = 'file';
    btnInput.addEventListener('change', () => {
      if (btnInput.files !== null) {
        const file = btnInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result;
          if (res !== null && typeof res === 'string')
            this.avatarImage.drawImage(res);
        };
        reader.readAsDataURL(file);
      }
    });
    const fileLoadLebel = elFactory(
      'label',
      { class: 'btn-load', for: 'btn-input' },
      'Load avatar'
    );
    fileLoadLebel.appendChild(btnInput);
    const avatarContainer = elFactory(
      'div',
      { class: 'avatar-container' },
      avatarWrapper
    );
    avatarContainer.appendChild(fileLoadLebel);
    const submitBtn = elFactory(
      'button',
      { class: 'btn accept-btn', type: 'submit' },
      'Add User'
    );
    const cancelBtn = elFactory(
      'button',
      { class: 'btn close-btn', 'data-close': 'true' },
      'Cancel'
    );
    const formFooter = elFactory(
      'div',
      { class: 'form-footer' },
      submitBtn,
      cancelBtn
    );
    this.element.appendChild(formGroup);
    this.element.appendChild(avatarContainer);
    this.element.appendChild(formFooter);
  }

  registerFormCheck(): boolean {
    const inputStates = [false, false, false];

    const keys = Object.keys(this.inputs);
    for (let i = 0; i < keys.length; i++) {
      const input = this.inputs[keys[i]];

      if (input.value === '') {
        validator.setError(
          input,
          `${input.name} can't be empty`,
          this.errorMsg[`${input.id}Error`]
        );
        return false;
      }

      if (input.id === 'firstName' || input.id === 'lastName') {
        if (!validator.correctValue(input)) {
          validator.setError(
            input,
            `${input.name} should contain only letters and numbers`,
            this.errorMsg[`${input.id}Error`]
          );
          return false;
        }

        if (!validator.onlyNumbers(input)) {
          validator.setError(
            input,
            `${input.name} can not be only numbers`,
            this.errorMsg[`${input.id}Error`]
          );
          return false;
        }

        validator.setCorrect(input);
        inputStates[i] = true;
      } else {
        if (!validator.isEmail(input)) {
          validator.setError(
            input,
            `${input.name} is not valid`,
            this.errorMsg[`${input.id}Error`]
          );
          return false;
        }

        // if (!this.model.getUser(input.value)) {
        //   validator.setError(input, `${input.value} is already exists`, this.errorMsg[`${input.id}Error`]);
        //   return false;
        // }

        validator.setCorrect(input);
        inputStates[i] = true;
      }
    }

    return inputStates.every((val) => val);
  }

  formClickEventListener(event: Event): void {
    event.preventDefault();
    const values = {} as UserType;

    const status = this.registerFormCheck();

    if (status) {
      Object.values(this.inputs).forEach((input: HTMLInputElement) => {
        const inputId = input.id as keyof UserType;
        values[inputId] = input.value;
      });

      Object.assign(values, {
        avatar: this.avatarImage.dataUrl,
      });

      this.player.setPlayer(values);

      setTimeout(() => {
        if (window.location.hash === '#landing') {
          window.location.hash = '';
        } else {
          window.location.hash = 'landing';
        }
      }, 300);
    }
  }
}
