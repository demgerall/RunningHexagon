import type { ReactElement } from "react";
import  ReactDOM         from "react-dom";
import type { SVGPathData } from "@/shared/types/SvgPathData";

function getCircleCenterFromPath(path: string) {
    let x                 = 0;
    let y                 = 0;
    let cx: number | null = null;
    let cy: number | null = null;

    const commandRegex = /([M|C])\s*(-?\d+\.?\d*)\s*(-?\d+\.?\d*)/g;
    let match = commandRegex.exec(path);
    
    while (match !== null) {
      const [_, cmd, p1, p2] = match;
      const px = Number.parseFloat(p1);
      const py = Number.parseFloat(p2);
      
      if (cmd === "M") {
        x = px;
        y = py;
      } else if (cmd === "C") {
        if (cx === null) {
          cx = (x + px) / 2;
          cy = (y + py) / 2;
          break;
        }
      }

      match = commandRegex.exec(path);
    }
    
    return { x: cx || 0, y: cy || 0 };
}

export const getSvgDotsArray = (svgElement: ReactElement): Promise<Array<SVGPathData>> => {
  return new Promise((resolve, reject) => {
    const tempDiv = document.createElement('div');

    tempDiv.style.position = 'fixed';
    tempDiv.style.top = '0';
    tempDiv.style.left = '0';
    tempDiv.style.width = '0';
    tempDiv.style.height = '0';
    tempDiv.style.overflow = 'hidden';

    document.body.appendChild(tempDiv);

    ReactDOM.render(svgElement, tempDiv, () => {
      setTimeout(() => {
        try {
          const svg = tempDiv.querySelector('svg');
          if (!svg) {
            throw new Error('SVG element not found');
          }

          const paths = svg.querySelectorAll('path');
          if (paths.length === 0) {
            throw new Error('No <path> elements found in SVG');
          }

          const result = Array.from(paths).map((path, index) => {
            const d = path.getAttribute('d') || '';
            const { x, y } = getCircleCenterFromPath(d);
            
            return {
              id: path.id || `path-${index}`,
              x,
              y
            }
          });

          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          ReactDOM.unmountComponentAtNode(tempDiv);
          tempDiv.remove();
        }
      }, 0);
    });
  });
};