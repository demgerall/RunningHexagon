import { useEffect, useRef, useState } from 'react'

interface TUseCanvas {
  draw:        (context: CanvasRenderingContext2D) => void;
  onResize:    () => void;
  onMouseMove: (mousePosition: {x: number, y: number}) => void;
}

export const useCanvas = (props: TUseCanvas) => {
  const { draw, onMouseMove, onResize } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const handleResize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        onResize();
      };

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [onResize])

  useEffect(() => {
    const mouseMoveHandler = (e: MouseEvent) => {
      setMousePosition({x: e.clientX, y: e.clientY});
    };

    window.addEventListener('mousemove', mouseMoveHandler);

    const intervalId = setInterval(() => {
      onMouseMove(mousePosition);
    }, 1)

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', mouseMoveHandler)
    };
  }, [ onMouseMove, mousePosition ])

  useEffect(() => {
    const canvas  = canvasRef.current;
    const context = canvas?.getContext('2d');

    let animationId: number;
    
    const renderer = () => {
      if (context) {
        const bufferCanvas  = document.createElement('canvas');
        bufferCanvas.width  = context.canvas.width;
        bufferCanvas.height = context.canvas.height;
        const bufferContext = bufferCanvas.getContext('2d');

        if (!bufferContext) return;

        bufferContext.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

        draw(bufferContext);

        context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        context.drawImage(bufferCanvas, 0, 0)

        animationId = window.requestAnimationFrame(renderer);
      }
    };

    renderer();

    return () => window.cancelAnimationFrame(animationId);
  }, [draw])
  
  return canvasRef;
}
