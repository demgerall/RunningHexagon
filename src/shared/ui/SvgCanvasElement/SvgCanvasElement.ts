import type { ReactElement } from 'react';

import { svgToImage }        from '@/shared/libs/svgToImage/svgToImage';

interface TSvgCanvasElementOptions {
  maxDistance?: number;
  mouseRadius?: number;
  direction?:   'pull' | 'push';
  backSpeed?:   number;
  force?:       number;
  x?:           number;
  y?:           number;
}

export class SvgCanvasElement {
  private svgImage?:   HTMLImageElement;
  private centerX?:    number;
  private centerY?:    number;
  private maxDistance: number;
  private mouseRadius: number;
  private originalX:   number;
  private originalY:   number;
  private backSpeed:   number;
  private currentX:    number;
  private currentY:    number;
  private force:       number;
  private direction:   'pull' | 'push';

  constructor(svgElement: ReactElement, options?: TSvgCanvasElementOptions) {
    const {
      x           = 0,
      y           = 0,
      maxDistance = 15,
      mouseRadius = 300,
      backSpeed   = 0.05,
      direction   = 'push',
      force       = 0.004
    } = options || {};

    this.prepareSvg(svgElement);

    this.originalX = x;
    this.originalY = y;
    this.currentX  = x;
    this.currentY  = y;

    this.setSvgImageCenter();

    this.maxDistance = maxDistance;
    this.mouseRadius = mouseRadius;
    this.backSpeed   = backSpeed;
    this.direction   = direction;
    this.force       = force;
  };

  setPosition(x: number, y: number) {
    this.originalX = x;
    this.originalY = y;
    this.currentX  = x;
    this.currentY  = y;

    this.setSvgImageCenter();

    return this;
  };

  setDirection(direction: 'pull' | 'push') {
    this.direction = direction;

    return this;
  };

  private setSvgImageCenter() {
    if (!this.svgImage) {
      return;
    }

    this.centerX = this.currentX + this.svgImage.width  / 2;
    this.centerY = this.currentY + this.svgImage.height / 2;
  };

  private setSvgImage(svgImage: HTMLImageElement) {
    this.svgImage = svgImage;
    this.setSvgImageCenter();
  };

  private async prepareSvg(svgElement: ReactElement) {
    const img = await svgToImage(svgElement);
    this.setSvgImage(img);
  };

  draw(context: CanvasRenderingContext2D) {
    if (!this.svgImage) {
      return;
    }

    context.drawImage(this.svgImage, this.currentX, this.currentY);
  };

  update(mouseX: number, mouseY: number) {
    if (!this.centerX || !this.centerY || !this.svgImage) {
      return;
    }

    const dx               = this.centerX - mouseX;
    const dy               = this.centerY - mouseY;
    const distance         = Math.sqrt(dx ** 2 + dy ** 2);
    const svgDistance      = (this.svgImage.width > this.svgImage.height ? this.svgImage.width : this.svgImage.height) / 2
    const reactionDistance = svgDistance + this.mouseRadius;

    if (distance <= reactionDistance) {
      const force = (reactionDistance - distance) * this.force;
      const angle = Math.atan2(dy, dx);

      const offsetX = Math.cos(angle) * force;
      const offsetY = Math.sin(angle) * force;

      if (
        this.direction === 'pull'                                                                       &&
        Math.abs(this.originalX + this.svgImage.width  / 2 - offsetX - this.centerX) < this.maxDistance &&
        Math.abs(this.originalY + this.svgImage.height / 2 - offsetY - this.centerY) < this.maxDistance
      ) {
        this.currentX -= offsetX;
        this.currentY -= offsetY;
      }
      if (
        this.direction === 'push'                                                                       &&
        Math.abs(this.originalX + this.svgImage.width  / 2 + offsetX - this.centerX) < this.maxDistance &&
        Math.abs(this.originalY + this.svgImage.height / 2 + offsetY - this.centerY) < this.maxDistance
      ) {
        this.currentX += offsetX;
        this.currentY += offsetY;
      }
    }

    if (distance > svgDistance + this.maxDistance && (this.currentX !== this.originalX || this.currentY !== this.originalY)) {
      this.currentX += (this.originalX - this.currentX) * this.backSpeed;
      this.currentY += (this.originalY - this.currentY) * this.backSpeed;
    }
    
    this.setSvgImageCenter();
  };
}
