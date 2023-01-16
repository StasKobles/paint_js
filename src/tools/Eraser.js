import Tool from "./Tools";

export default class Eraser extends Tool {
  constructor(canvas) {
    super(canvas);
    this.listen();
  }
  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }
  mouseUpHandler(e) {
    this.mouseDown = false;
  }
  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.ctx.moveTo(
      e.pageX - e.target.offsetLeft,
      e.pageY - e.target.offsetTop
    );
  }
  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }
  }
  draw(x, y) {
    this.ctx.lineTo(x, y);
    const color = this.ctx.strokeStyle;
    const lineWidth = this.ctx.lineWidth;
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 15;
    this.ctx.stroke();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
  }
}
