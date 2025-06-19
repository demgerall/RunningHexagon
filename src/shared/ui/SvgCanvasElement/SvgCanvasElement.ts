import type { ReactElement } from 'react';

import { svgToImage }        from '@/shared/libs/svgToImage/svgToImage';

interface TSvgCanvasElementOptions {
  maxDistance?: number;
  mouseRadius?: number;
  backSpeed?:   number;
  force?:       number;
  x?:           number;
  y?:           number;
}

export class SvgCanvasElement {
  svgImage?:   HTMLImageElement;
  centerX?:    number | undefined;
  centerY?:    number | undefined;
  maxDistance: number;
  mouseRadius: number;
  originalX:   number;
  originalY:   number;
  backSpeed:   number;
  currentX:    number;
  currentY:    number;
  force:       number;

  constructor(svgElement: ReactElement, options?: TSvgCanvasElementOptions) {
    const {
      x           = 0,
      y           = 0,
      maxDistance = 15,
      mouseRadius = 300,
      force       = 250,
      backSpeed   = 0.05
    } = options || {};

    this.prepareSvg(svgElement);

    this.originalX   = x;
    this.originalY   = y;
    this.currentX    = x;
    this.currentY    = y;
    this.maxDistance = maxDistance;
    this.mouseRadius = mouseRadius;
    this.force       = 1 / force;
    this.backSpeed   = backSpeed;
  };

  private setSvgImageCenter() {
    if (!this.svgImage) {
      return;
    }

    this.centerX = this.currentX + this.svgImage.width / 2;
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
    const reactionDistance = this.svgImage.width / 2 + this.mouseRadius;

    if (
      distance <= reactionDistance                                      &&
      Math.abs(this.originalX - this.currentX) < this.maxDistance &&
      Math.abs(this.originalY - this.currentY) < this.maxDistance
    ) {
      const force = (reactionDistance - distance) * this.force;
      const angle = Math.atan2(dy, dx);

      this.currentX += Math.cos(angle) * force;
      this.currentY += Math.sin(angle) * force;

      this.setSvgImageCenter();
    }

    if (this.currentX !== this.originalX || this.currentY !== this.originalY) {
      this.currentX += (this.originalX - this.currentX) * this.backSpeed;
      this.currentY += (this.originalY - this.currentY) * this.backSpeed;

      this.setSvgImageCenter();
    }
  };
}
