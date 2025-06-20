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
  handleMouseMove?:  (mousePosition: {x: number, y: number}) => void;
  handleResize?:     () => void;
  width?:            number;
  height?:           number;
  bgColor?:          string;
}

export const Canvas = (props: TCanvas) => {
  const {
    id,
    draw,
    handleMouseMove = _.noop,
    handleResize    = _.noop,
    width           = window.innerWidth,
    height          = window.innerHeight,
    ...otherProps
  } = props;

  const canvasRef = useCanvas({
    draw,
    onMouseMove: handleMouseMove,
    onResize: handleResize
  });

  return (
    <canvas
      className = {style.canvas}
      height    = {height}
      width     = {width}
      ref       = {canvasRef}
      id        = {id}
      {...otherProps}
    />
  );
}
