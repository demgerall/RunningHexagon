import React, {
  useRef,
  type MouseEvent
}                           from 'react';

import { Canvas }           from '@/shared/ui/Canvas';
import { SvgCanvasElement } from '@/shared/ui/SvgCanvasElement';
import HEXAGON1             from "@/shared/assets/svg/Hexagon1.svg";
import HEXAGON2             from "@/shared/assets/svg/Hexagon2.svg";
import HEXAGON3             from "@/shared/assets/svg/Hexagon3.svg";
import HEXAGON4             from "@/shared/assets/svg/Hexagon4.svg";
import HEXAGON5             from "@/shared/assets/svg/Hexagon5.svg";

import style                from './LandingHexagonSection.module.scss';

export const LandingHexagonSection = () => {
  const svgImagesRef = useRef<Array<SvgCanvasElement>>([
    new SvgCanvasElement(<HEXAGON1 />),
    new SvgCanvasElement(<HEXAGON2 />, { x: window.innerWidth - 234 }),
    new SvgCanvasElement(<HEXAGON3 />, { x: 414, y: window.innerHeight - 159 }),
    new SvgCanvasElement(<HEXAGON4 />, { x: 1061, y: 420 }),
    new SvgCanvasElement(<HEXAGON5 />, { x: 1325, y: 434 })
  ]);

  const handleRenderSvgImages = (context: CanvasRenderingContext2D) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    svgImagesRef.current.forEach(svgImage => {
      svgImage.draw(context);
    })
  }

  const handleMouseMove = (setMousePosition: ({x, y}: {x: number, y: number}) => void) =>
    (e: MouseEvent<HTMLCanvasElement, MouseEvent>) =>
      {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }

  const animateSvgImages = (mousePosition: {x: number, y: number}) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    svgImagesRef.current.forEach(svgImage => {
      svgImage.update(mousePosition.x, mousePosition.y);
    });
  }

  return (
    <section className = {style.section}>
      <Canvas
        animateMouseMove = {animateSvgImages}
        handleMouseMove  = {handleMouseMove}
        draw             = {handleRenderSvgImages}
        id               = 'canvas'
      />
    </section>
  )
}
