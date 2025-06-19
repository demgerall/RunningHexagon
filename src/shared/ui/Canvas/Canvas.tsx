import _             from 'lodash/fp';
import React, {
  useEffect,
  useState,
  type HTMLAttributes,
  type MouseEvent
}                    from 'react'

import { useCanvas } from '@/shared/libs/hooks/useCanvas/useCanvas';

import style         from './Canvas.module.scss';

interface TCanvas extends HTMLAttributes<HTMLCanvasElement> {
  id:                string;
  draw:              (context: CanvasRenderingContext2D) => void;
  handleMouseMove?:  (setMousePosition: ({x, y}: {x: number, y: number}) => void) =>
    (e: MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  animateMouseMove?: (mousePosition: {x: number, y: number}) => void;
  width?:            number;
  height?:           number;
  bgColor?:          string;
}

export const Canvas = (props: TCanvas) => {
  const {
    id,
    draw,
    handleMouseMove,
    animateMouseMove = _.noop,
    width            = window.innerWidth,
    height           = window.innerHeight,
    ...otherProps
  } = props;

  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  const onMouseMove = handleMouseMove ? handleMouseMove(setMousePosition) : _.noop;

  const canvasRef = useCanvas({draw, onMouseMove});

  useEffect(() => {
    animateMouseMove(mousePosition);
  }, [ animateMouseMove, mousePosition ])

  return (
    <canvas
      className   = {style.canvas}
      height      = {height}
      width       = {width}
      ref         = {canvasRef}
      id          = {id}
      {...otherProps}
    />
  );
}
