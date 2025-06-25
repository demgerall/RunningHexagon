interface TCanvasDotOptions {
  radius?: number;
  color?:  string;
}

export class CanvasDot {
  private id:     string;
  private x:      number;
  private y:      number;
  private radius: number;
  private color:  string;

  constructor(id: string, x: number, y: number, options?: TCanvasDotOptions) {
    const { radius = 2, color = '#0A8EFA' } = options || {};

    this.id = id;
    this.x  = x;
    this.y  = y;

    this.radius = radius;
    this.color  = color;
  }

  getId() {
    return this.id;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(moveX: number, moveY: number, stepSize: number) {
    if (Math.abs(this.x - moveX) < stepSize / 10 && Math.abs(this.y - moveY) < stepSize / 10) {
      return;
    }

    const dx    = this.x - moveX;
    const dy    = this.y - moveY;
    const angle = Math.atan2(dy, dx);

    this.x -= stepSize * Math.cos(angle);
    this.y -= stepSize * Math.sin(angle);
  }
}