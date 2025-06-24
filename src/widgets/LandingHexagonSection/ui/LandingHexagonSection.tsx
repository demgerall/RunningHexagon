import React, { useRef }    from 'react';

import { Canvas }           from '@/shared/ui/Canvas';
import { SvgCanvasElement } from '@/shared/ui/SvgCanvasElement';
import HEXAGON1             from "@/shared/assets/svg/Hexagon1.svg";
import HEXAGON2             from "@/shared/assets/svg/Hexagon2.svg";
import HEXAGON3             from "@/shared/assets/svg/Hexagon3.svg";
import HEXAGON4             from "@/shared/assets/svg/Hexagon4.svg";
import HEXAGON5             from "@/shared/assets/svg/Hexagon5.svg";

import style                from './LandingHexagonSection.module.scss';

export const LandingHexagonSection = () => {
  const getFiguresOptions = () => [
    { x: -102,                        y: -193                         },
    { x: window.innerWidth - 234,     y: 0                            },
    { x: window.innerWidth / 2 - 538, y: window.innerHeight - 159     },
    { x: window.innerWidth / 2 + 85,  y: window.innerHeight / 2 + 196 },
    { x: window.innerWidth / 2 + 322, y: window.innerHeight / 2 + 210 }
  ]

  const svgImagesRef = useRef<Array<SvgCanvasElement>>([
      new SvgCanvasElement(<HEXAGON1 />, {direction: "pull"}),
      new SvgCanvasElement(<HEXAGON2 />, {direction: "pull"}),
      new SvgCanvasElement(<HEXAGON3 />, {direction: "pull"}),
      new SvgCanvasElement(<HEXAGON4 />),
      new SvgCanvasElement(<HEXAGON5 />)
    ]
    .map((svgImage, index) => svgImage.setPosition(getFiguresOptions()[index].x, getFiguresOptions()[index].y))
  );

  const handleRenderSvgImages = (context: CanvasRenderingContext2D) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    svgImagesRef.current.forEach(svgImage => {
      svgImage.draw(context);
    })
  }

  const handleMouseMove = (mousePosition: {x: number, y: number}) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    svgImagesRef.current.forEach(svgImage => {
      svgImage.update(mousePosition.x, mousePosition.y);
    });
  }

  const handleResize = () => {
    svgImagesRef.current.forEach((svgImage, index) => {
      svgImage.setPosition(getFiguresOptions()[index].x, getFiguresOptions()[index].y);
    });
  }

  return (
    <section className = {style.section}>
      <Canvas
        handleMouseMove  = {handleMouseMove}
        handleResize     = {handleResize}
        draw             = {handleRenderSvgImages}
        id               = 'canvas'
      />
    </section>
  )
}
