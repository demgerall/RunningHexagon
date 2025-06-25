import React, { useEffect, useRef } from 'react'
import type { SVGPathData } from '@/shared/types/SvgPathData';
import { CanvasDot } from '../CanvasDot';
import { Canvas } from '../Canvas';
import _ from 'lodash/fp';

import style from "./DotsAnimation.module.scss";

interface TDotsAnimation {
  nextSvgDotsArray: Array<SVGPathData>;
  svgDotsArray:     Array<SVGPathData>;
  duration:         number;
}

export const DotsAnimation = (props: TDotsAnimation) => {
  const { duration, svgDotsArray, nextSvgDotsArray } = props;

  const dotsRef = useRef<Array<CanvasDot>>(
    svgDotsArray.map(svgDot => new CanvasDot(svgDot.id, svgDot.x, svgDot.y))
  );

  const handleRenderDots = (context: CanvasRenderingContext2D) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    dotsRef.current.forEach(svgImage => {
      if (svgImage) {
        svgImage.draw(context);
      }
    })
  };

  const getNearestDotsMap = (
    svgDotsArray:     Array<SVGPathData>,
    nextSvgDotsArray: Array<SVGPathData>
  ) => {
    const arrayFrom: Array<SVGPathData & { available?: boolean }> = _.cloneDeep(svgDotsArray);
    const arrayTo:   Array<SVGPathData & { available?: boolean }> = _.cloneDeep(nextSvgDotsArray);

    const nearestDotsMap = new Map();

    if (arrayFrom.length === arrayTo.length) {
      for (let i = 0; i < arrayFrom.length; i++) {
        let minDistance = Number.POSITIVE_INFINITY;
        let arrayToMinDistanceIndex = 0;

        for (let j = 0; j < arrayTo.length; j++) {
          const distance = Math.sqrt((arrayFrom[i].x - arrayTo[j].x)**2 + (arrayFrom[i].y - arrayTo[j].y)**2);

          if (distance < minDistance && arrayTo[j].available !== false) {
            minDistance = distance;
            arrayToMinDistanceIndex = j;
          }
        }

        const mappedArrayToDot = { ...arrayTo[arrayToMinDistanceIndex], distance: minDistance }

        arrayTo[arrayToMinDistanceIndex].available = false;

        nearestDotsMap.set(arrayFrom[i].id, mappedArrayToDot);
      }
    }

    if (arrayFrom.length < arrayTo.length) {
      dotsRef.current.push(...Array(arrayTo.length - arrayFrom.length).fill(undefined))

      for (let i = 0; i < arrayTo.length; i++) {
        let minDistance = Number.POSITIVE_INFINITY;
        let arrayFromMinDistanceIndex = 0;

        if (i < arrayFrom.length) {
          for (let j = 0; j < arrayFrom.length; j++) {
            const distance = Math.sqrt((arrayTo[i].x - arrayFrom[j].x)**2 + (arrayTo[i].y - arrayFrom[j].y)**2);

            if (distance < minDistance && arrayFrom[j].available !== false) {
              minDistance = distance;
              arrayFromMinDistanceIndex = j;
            }
          }

          const mappedArrayToDot = { ...arrayTo[i], distance: minDistance }

          arrayFrom[arrayFromMinDistanceIndex].available = false;

          nearestDotsMap.set(arrayFrom[arrayFromMinDistanceIndex].id, mappedArrayToDot);
        }

        if (i >= arrayFrom.length) {
          for (let j = 0; j < arrayFrom.length; j++) {
            const distance = Math.sqrt((arrayTo[i].x - arrayFrom[j].x)**2 + (arrayTo[i].y - arrayFrom[j].y)**2);

            if (distance < minDistance) {
              minDistance = distance;
              arrayFromMinDistanceIndex = j;
            }
          }

          const newId = `path-${i}`

          dotsRef.current[i] = new CanvasDot(newId, arrayFrom[arrayFromMinDistanceIndex].x, arrayFrom[arrayFromMinDistanceIndex].y)

          const mappedArrayToDot = { ...arrayTo[i], distance: minDistance };

          arrayFrom[arrayFromMinDistanceIndex].available = false;

          nearestDotsMap.set(newId, mappedArrayToDot);
        }
      }
    }

    return nearestDotsMap;
  };

  const handleAnimateDots = (animateMap: Map<string, SVGPathData & { distance: number }>) => {
    if (!animateMap) {
      return;
    };

    return setInterval(() => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      dotsRef.current.forEach(dot => {
        const { x, y, distance } = animateMap.get(dot.getId());
        dot.update(x, y, distance / duration);
      });
    }, 1)
  }

  useEffect(() => {
    if (!nextSvgDotsArray || (nextSvgDotsArray.length === dotsRef.current.length && nextSvgDotsArray.length !== svgDotsArray.length)) {
      return;
    }

    const map        = getNearestDotsMap(svgDotsArray, nextSvgDotsArray);
    const intervalId = handleAnimateDots(map);

    return () => {
      clearInterval(intervalId);
    }
  }, [nextSvgDotsArray]);

  return (
    <Canvas
      className = {style.canvas_animation}
      height    = {400}
      width     = {400}
      draw      = {handleRenderDots}
      id        = 'canvas-animation'
    />
  )
}
