import type { ReactElement } from "react";
import { createRoot }        from "react-dom/client";

export const svgToImage = async ( svgElement: ReactElement ): Promise<HTMLImageElement> => {
  const tempDiv = document.createElement('div');
  document.body.appendChild(tempDiv);
  const root    = createRoot(tempDiv);
  root.render(svgElement);

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const observer = new MutationObserver((mutations, obs) => {
      const svgNode = tempDiv.querySelector('svg');
      if (svgNode) {
        obs.disconnect();

        try {
          const svgString = new XMLSerializer().serializeToString(svgNode);
          const svgBlob   = new Blob([svgString], { type: 'image/svg+xml' });
          const svgUrl    = URL.createObjectURL(svgBlob);

          const img = new Image();

          img.onload  = ()    => {
            resolve(img);
            URL.revokeObjectURL(svgUrl);
            root.unmount();
            document.body.removeChild(tempDiv);
          };
          img.onerror = (err) => {
            reject(new Error('Image loading failed'));
            URL.revokeObjectURL(svgUrl);
            root.unmount();
            document.body.removeChild(tempDiv);
          };

          img.src = svgUrl;
        } catch (error) {
          reject(error);
          root.unmount();
          document.body.removeChild(tempDiv);
        }
      }
    });

    observer.observe(tempDiv, {
      childList:     true,
      subtree:       true,
      attributes:    true,
      characterData: true
    });

    const timeout = setTimeout(() => {
      observer.disconnect();
      reject(new Error('SVG element not found within timeout'));
      root.unmount();
    }, 1000);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  });
}