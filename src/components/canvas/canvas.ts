import avatarImage from '../../assets/images/avatar.jpg';

const MAX_WIDTH = 300;

export class Canvas {
  element: HTMLCanvasElement;

  img: HTMLImageElement;

  dataUrl: string | undefined;

  constructor() {
    this.element = document.createElement('canvas');
    this.element.classList.add('avatar-image');
    this.img = new Image();
    this.drawImage();
  }

  drawImage(src?: string): void {
    this.img.setAttribute('crossOrigin', 'anonymous');
    if (src) this.img.src = src;
    else this.img.src = avatarImage;
    this.img.onload = this.loadImage.bind(this);
  }

  loadImage(): void {
    const scaleSize = MAX_WIDTH / this.img.width;
    this.element.width = MAX_WIDTH;
    this.element.height = scaleSize * this.img.height;
    const ctx = this.element.getContext('2d');
    ctx?.drawImage(this.img, 0, 0, this.element.width, this.element.height);
    this.dataUrl = this.element.toDataURL('image/jpeg');
  }
}
