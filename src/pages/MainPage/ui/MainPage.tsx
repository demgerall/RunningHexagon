import React, { useEffect, useState }                     from 'react';

import { LandingHexagonSection } from '@/widgets/LandingHexagonSection';
import { DotsAnimation } from '@/shared/ui/DotsAnimation';
import Trophy from '@/shared/assets/svg/Trophy.svg';
import Computer from '@/shared/assets/svg/Computer.svg';
import Manager from '@/shared/assets/svg/Manager.svg';
import { getSvgDotsArray } from '@/shared/libs/getSvgDotsArray/getSvgDotsArray';
import type { SVGPathData } from "@/shared/types/SvgPathData";

export const MainPage = () => {
  const [svgDotsArray, setSvgDotsArray] = useState<Array<SVGPathData>>([])
  const [nextSvgDotsArray, setNextSvgDotsArray] = useState<Array<SVGPathData>>([]);
  
  useEffect(() => {
    getSvgDotsArray(<Trophy />).then(svgDotsArray => setSvgDotsArray(svgDotsArray));

    setTimeout(() => {
      getSvgDotsArray(<Computer />).then(svgDotsArray => setNextSvgDotsArray(svgDotsArray))
    }, 1000)
  }, [])

  return (
    <main>
      {!!svgDotsArray.length &&
        <DotsAnimation
          nextSvgDotsArray = {nextSvgDotsArray}
          svgDotsArray     = {svgDotsArray}
          duration         = {200}
        />
      }
      <LandingHexagonSection />
    </main>
  );
}
