import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useParams } from "react-router-dom";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import "../styles/canvas.scss";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
const Canvas = observer(() => {
  const canvasRef = useRef();
  const usernameRef = useRef();
  const [modal, setModal] = useState(true);
  const params = useParams();
  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
  }, []);
  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(process.env.REACT_APP_WEB_SOCKET_PORT);
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));
      socket.onopen = () => {
        console.log("Connection is correct");
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: "connection",
          })
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case "connection":
            console.log(`User ${msg.username} is connected`);
            break;
          case "draw":
            drawHandler(msg);
            break;
        }
      };
    }
  }, [canvasState.username]);

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext("2d");
    switch (figure.type) {
      case "brush":
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case "rect":
        Rect.staticDraw(
          ctx,
          figure.x,
          figure.y,
          figure.width,
          figure.height,
          figure.color
        );
        break;
      case "finish":
        ctx.beginPath();
        break;
    }
  };

  const mouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  };
  const connectionHandler = () => {
    canvasState.setUsername(usernameRef.current.value);
    setModal(false);
  };
  return (
    <div className="canvas">
      <Modal show={modal} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Type your name</Modal.Title>
        </Modal.Header>
        <input type="text" style={{ width: "150px" }} ref={usernameRef} />
        <Modal.Footer>
          <Button variant="primary" onClick={() => connectionHandler()}>
            Start
          </Button>
        </Modal.Footer>
      </Modal>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        onMouseDown={() => mouseDownHandler()}
      />
    </div>
  );
});

export default Canvas;
