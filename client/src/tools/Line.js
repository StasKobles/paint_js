import Tool from "./Tools";

export default class Line extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
    this.name = "Line";
  }

  listen() {
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.currentX = e.pageX - e.target.offsetLeft;
    this.currentY = e.pageY - e.target.offsetTop;
    this.ctx.beginPath();
    this.ctx.moveTo(this.currentX, this.currentY);
    this.saved = this.canvas.toDataURL();
  }

  mouseUpHandler(e) {
    this.mouseDown = false;
    this.x = e.pageX - e.target.offsetLeft;
    this.y = e.pageY - e.target.offsetTop;
    this.socket.send(
      JSON.stringify({
        method: "draw",
        id: this.id,
        figure: {
          type: "line",
          x: this.x,
          y: this.y,
          currentX: this.currentX,
          currentY: this.currentY,
          colorFill: this.ctx.fillStyle,
          lineWidth: this.ctx.lineWidth,
          strokeStyle: this.ctx.strokeStyle,
        },
      })
    );
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
    }
  }

  draw(x, y) {
    const img = new Image();
    img.src = this.saved;
    img.onload = async function () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentX, this.currentY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }.bind(this);
  }
  static staticDraw(
    ctx,
    x,
    y,
    currentX,
    currentY,
    colorFill,
    strokeStyle,
    lineWidth
  ) {
    ctx.fillStyle = colorFill;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(currentX, currentY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
