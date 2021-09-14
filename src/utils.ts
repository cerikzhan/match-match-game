export const elFactory = (
  type: keyof HTMLElementTagNameMap,
  attributes: { [prop: string]: string },
  ...innerText: string[] | HTMLElement[]
): HTMLElement => {
  const el = document.createElement(type);

  const keys = Object.keys(attributes);
  for (let i = 0; i < keys.length; i++) {
    const attr = keys[i];
    el.setAttribute(attr, attributes[attr]);
  }
  innerText.forEach((innerEl: string | HTMLElement) => {
    if (typeof innerEl === 'string') {
      el.appendChild(document.createTextNode(innerEl));
    } else {
      el.appendChild(innerEl);
    }
  });
  return el;
};

export const selectFactory = (
  attributes: { [prop: string]: string },
  ...innerElements: HTMLElement[]
): HTMLSelectElement => {
  const select: HTMLSelectElement = document.createElement('select');
  const keys = Object.keys(attributes);
  for (let i = 0; i < keys.length; i++) {
    const attr = keys[i];
    select.setAttribute(attr, attributes[attr]);
  }
  innerElements.forEach((innerEl: HTMLElement) => {
    select.appendChild(innerEl);
  });
  return select;
};

export function delay(sleepTime: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, sleepTime);
  });
}
