export const validator = {
  getParent(input: HTMLInputElement): HTMLElement {
    const formControl = input.parentElement;
    if (!formControl) throw Error('Form control element does not exist');
    return formControl;
  },
  setCorrect(input: HTMLInputElement): void {
    const formControl = this.getParent(input);
    formControl.className = 'form-control correct';
  },
  setError(input: HTMLInputElement, msg: string, error: HTMLElement): void {
    const formControl = this.getParent(input);
    formControl.className = 'form-control wrong';
    error.innerHTML = msg;
  },
  isEmail(emailInput: HTMLInputElement): boolean {
    const re = new RegExp(
      // eslint-disable-next-line max-len
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return re.test(emailInput.value);
  },
  correctValue(input: HTMLInputElement): boolean {
    const re = new RegExp(/[^~!@#&$%*()[\]_—+=|:;"'`<>,.?/^]+[0-9]*$/g);
    return re.test(input.value);
  },
  onlyNumbers(input: HTMLInputElement): boolean {
    const re = new RegExp(/^\d+$/);
    return !re.test(input.value);
  },
};
