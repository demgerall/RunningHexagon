import type { ReactElement } from "react";
import  ReactDOM         from "react-dom";

export const svgToImage = (svgElement: React.ReactElement): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // Создаем временный контейнер
    const tempDiv = document.createElement('div');
    
    // Стили для изоляции контейнера
    tempDiv.style.position = 'fixed';
    tempDiv.style.top = '0';
    tempDiv.style.left = '0';
    tempDiv.style.width = '0';
    tempDiv.style.height = '0';
    tempDiv.style.overflow = 'hidden';
    
    document.body.appendChild(tempDiv);

    // Рендерим SVG с помощью React 16 API
    ReactDOM.render(svgElement, tempDiv, () => {
      // Callback вызывается после завершения рендеринга
      setTimeout(() => {
        const svgNode = tempDiv.querySelector('svg');
        
        if (!svgNode) {
          cleanup();
          return reject(new Error('SVG element not found'));
        }

        try {
          const svgString = new XMLSerializer().serializeToString(svgNode);
          const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
          const svgUrl = URL.createObjectURL(svgBlob);

          const img = new Image();
          
          img.onload = () => {
            cleanup();
            resolve(img);
          };
          
          img.onerror = () => {
            cleanup();
            reject(new Error('Failed to load SVG image'));
          };
          
          img.src = svgUrl;
        } catch (error) {
          cleanup();
          reject(error);
        }
      }, 50); // Небольшая задержка для гарантии рендеринга
    });

    const cleanup = () => {
      ReactDOM.unmountComponentAtNode(tempDiv);
      tempDiv.remove();
    };

    // Таймаут на случай проблем с рендерингом
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('SVG rendering timeout'));
    }, 3000);

    // Очистка при размонтировании
    return () => {
      clearTimeout(timeout);
      cleanup();
    };
  });
};