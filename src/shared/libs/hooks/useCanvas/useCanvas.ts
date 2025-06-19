import { useEffect, useRef, type MouseEvent } from 'react'

interface TUseCanvas {
  draw:        (context: CanvasRenderingContext2D) => void;
  onMouseMove: (e: MouseEvent<HTMLCanvasElement, MouseEvent>) => void
}

export const useCanvas = (props: TUseCanvas) => {
  const { draw, onMouseMove } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const handleResize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('resize',    handleResize);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize',    handleResize)
      };
    }
  }, [ onMouseMove ])

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
