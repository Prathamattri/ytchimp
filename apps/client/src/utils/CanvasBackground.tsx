import { useEffect, useRef, useState } from "react";

type CircleProps = {
  x: number;
  y: number;
  radius: number;
  color: string;
};
export function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  const [circles, setCircles] = useState<CircleProps[]>([
    {
      x: 0,
      y: 0,
      radius: 0,
      color: "#000000",
    },
  ]);
  const [mousePos, setMousePos] = useState({
    x: 0,
    y: 0,
  });

  const colorList = [
    "#FF5733", // Vivid Orange
    "#33FF57", // Lime Green
    "#3357FF", // Royal Blue
    "#F0F0F0", // Light Gray
    "#FF33A6", // Hot Pink
    "#33FFC4", // Turquoise
    "#FF8C00", // Dark Orange
    "#8A2BE2", // Blue Violet
    "#FF1493", // Deep Pink
    "#00FA9A", // Medium Spring Green
  ];

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
    generateCircles().forEach((circle) => drawCircle(ctx, circle));
    document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      document.removeEventListener("mousemove", () => {
        console.log("Removed Mouse move event listener");
      });
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      ctx = canvasRef.current.getContext("2d") as CanvasRenderingContext2D;
      canvas = canvasRef.current;
      if (mousePos.x > 0 && mousePos.y > 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles!.forEach((circle) => {
        drawCircle(ctx, circle);
        if (getDistance(circle.x, circle.y, mousePos.x, mousePos.y) < 150) {
          drawLine(circle.x, circle.y, mousePos.x, mousePos.y, circle.color);
        }
      });
    }
  }, [mousePos]);

  function getDistance(x: number, y: number, mx: number, my: number) {
    let delX = mx - x,
      delY = my - y;
    let distance = Math.sqrt(delX * delX + delY * delY);
    return distance;
  }
  function drawLine(
    x: number,
    y: number,
    mx: number,
    my: number,
    color: string,
  ) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x, y);
    ctx.lineTo(mx, my);
    ctx.stroke();
  }
  function mouseMoveHandler(e: MouseEvent) {
    setMousePos({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function selectColor(): string {
    const ind = Math.floor(Math.random() * 10);
    return colorList[ind];
  }

  function drawCircle(ctx: CanvasRenderingContext2D, circleProps: CircleProps) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.arc(circleProps.x, circleProps.y, circleProps.radius, 0, 2 * Math.PI);
    ctx.fillStyle = circleProps.color;
    ctx.fill();
  }

  function generateCircles() {
    if (!canvasRef.current) {
      return [];
    }
    const canvasWidth = canvasRef.current.clientWidth;
    const canvasHeight = canvasRef.current.clientHeight;
    let newCirclesArray: CircleProps[] = [];
    let circleQty = window.innerWidth < 500 ? 30 : 100;
    for (let i = 0; i < circleQty; i++) {
      let x = Math.floor(Math.random() * canvasWidth);
      let y = Math.floor(Math.random() * canvasHeight);
      let radius = Math.floor(Math.random() * 10 + 5);

      const circleObject: CircleProps = {
        color: selectColor(),
        x,
        y,
        radius,
      };
      newCirclesArray.push(circleObject);
    }
    setCircles(newCirclesArray);
    return newCirclesArray;
  }

  return (
    <canvas
      style={{ zIndex: "-1", position: "absolute", top: 0, left: 0 }}
      ref={canvasRef}
    />
  );
}
