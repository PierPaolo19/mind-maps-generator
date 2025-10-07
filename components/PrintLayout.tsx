import React, { useState } from 'react';
import MindMap from './MindMap';
// FIX: Import MindMapObject for the component props type.
import { MindMapNode, MindMapLayout, MindMapObject } from '../types';
import { Icon } from './Icons';

// FIX: Define PrintLayoutProps interface for the component's props.
interface PrintLayoutProps {
  mindMap: MindMapObject;
  layout: MindMapLayout;
  onExit: () => void;
}

// Helper function to fetch a font, convert it to a data URI, and embed it in an SVG string.
const getSvgWithEmbeddedFont = async (svgElement: SVGSVGElement): Promise<string> => {
  try {
    // 1. Fetch the Google Fonts CSS file.
    const fontCssResponse = await fetch(
      "https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap"
    );
    if (!fontCssResponse.ok) throw new Error("Failed to fetch font CSS");
    const cssText = await fontCssResponse.text();

    // 2. Extract the font file URL from the CSS.
    const fontUrlMatch = cssText.match(/url\((https:\/\/[^)]+)\)/);
    if (!fontUrlMatch || !fontUrlMatch[1]) throw new Error("Could not find font URL in CSS");
    const fontUrl = fontUrlMatch[1];

    // 3. Fetch the font file as a blob.
    const fontBlobResponse = await fetch(fontUrl);
    if (!fontBlobResponse.ok) throw new Error("Failed to fetch font file");
    const fontBlob = await fontBlobResponse.blob();

    // 4. Convert the blob to a base64 data URI.
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fontBlob);
    });

    // 5. Create the <style> element with the @font-face rule.
    const styleElement = `
      <style>
        @font-face {
          font-family: 'Gochi Hand';
          src: url(${dataUrl}) format('woff2');
        }
      </style>
    `;

    // 6. Clone the SVG and inject the style.
    const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
    let defs = svgClone.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      svgClone.prepend(defs);
    }
    defs.innerHTML = styleElement + defs.innerHTML;
    
    // 7. Serialize the modified SVG to a string.
    return new XMLSerializer().serializeToString(svgClone);

  } catch (error) {
    console.error("Failed to embed font, exporting with fallback font:", error);
    // Fallback to the original SVG if any step fails
    return new XMLSerializer().serializeToString(svgElement);
  }
};


const PrintLayout: React.FC<PrintLayoutProps> = ({ mindMap, layout, onExit }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    const section = document.querySelector('.print-page') as HTMLElement;
    if (!section) {
        console.error("Could not find print page element.");
        setIsExporting(false);
        return;
    };
    
    const svgElement = section.querySelector('svg');

    if (!svgElement) {
      console.error(`Could not find SVG for map: ${mindMap.title}`);
      setIsExporting(false);
      return;
    }

    try {
      const viewBoxAttr = svgElement.getAttribute('viewBox');
      if (!viewBoxAttr) {
        console.error(`SVG for map "${mindMap.title}" is missing a viewBox attribute.`);
        setIsExporting(false);
        return;
      }

      const viewBox = viewBoxAttr.split(' ').map(parseFloat);
      const svgWidth = viewBox[2];
      const svgHeight = viewBox[3];

      const titleHeight = 100; // Extra vertical space for the title
      const canvasWidth = svgWidth;
      const canvasHeight = svgHeight + titleHeight;
      
      const svgString = await getSvgWithEmbeddedFont(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const dpr = 2; // Export at 2x resolution for better quality
          canvas.width = canvasWidth * dpr;
          canvas.height = canvasHeight * dpr;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context.'));
            return;
          }
          ctx.scale(dpr, dpr);

          // Fill background
          ctx.fillStyle = '#fdfbf6';
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          
          // Draw title
          ctx.font = "bold 40px 'Gochi Hand', cursive";
          ctx.fillStyle = '#334155'; // slate-700
          ctx.textAlign = 'center';
          ctx.fillText(mindMap.title, canvasWidth / 2, titleHeight / 2 + 15);

          // Draw mind map image below the title
          ctx.drawImage(img, 0, titleHeight, svgWidth, svgHeight);

          const pngUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${mindMap.title.replace(/[\s&]+/g, '_')}.png`;
          link.href = pngUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = (e) => {
          console.error("Failed to load SVG image for PNG conversion.", e);
          URL.revokeObjectURL(url);
          reject(new Error('Image loading failed.'));
        };
        img.src = url;
      });

    } catch (error) {
      console.error(`Failed to export map: ${mindMap.title}`, error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen antialiased flex flex-col">
      <header className="p-4 bg-white shadow-sm no-print flex items-center border-b border-slate-200 sticky top-0 z-20">
        <button
          onClick={onExit}
          className="flex items-center text-slate-600 hover:text-slate-900 transition-colors rounded-lg p-2 -ml-2 group"
        >
          <Icon name="arrow-left" className="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="text-lg font-semibold">Back to Editor</span>
        </button>
      </header>

      <main className="flex-grow w-full max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-8 p-4 md:p-8">
        <aside className="w-full md:w-1/3 lg:w-1/4 no-print">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 sticky top-28">
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Export Options</h2>
            <p className="text-slate-500 mb-6">Download your mind map as a high-quality PNG image.</p>
            
            <div className="mb-6 p-4 bg-slate-50 border-l-4 border-blue-400 rounded-r-lg">
                <p className="text-sm text-slate-500">Current Map:</p>
                <h3 className="text-lg font-semibold text-slate-800">{mindMap.title}</h3>
            </div>
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full px-6 py-4 text-lg font-bold rounded-lg transition-all duration-300 transform bg-green-500 text-white hover:bg-green-600 hover:scale-105 shadow-lg flex items-center justify-center disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
              title="Export this map as a PNG image"
            >
              <Icon name="download" className="w-6 h-6 mr-3" />
              <span>{isExporting ? 'Exporting...' : 'Download PNG'}</span>
            </button>
            
            {isExporting && <p className="text-sm text-slate-500 text-center mt-4 animate-pulse">Preparing your file, please wait...</p>}
          </div>
        </aside>

        <div className="flex-grow flex items-start justify-center">
            <section className="print-page bg-white p-8 shadow-2xl rounded-2xl border-2 border-slate-200 w-full">
                <h2 className="text-4xl font-bold text-center mb-8 text-slate-700 tracking-wide">{mindMap.title}</h2>
                <div className="flex justify-center">
                    <MindMap 
                        data={mindMap.data} 
                        mapId={mindMap.id} 
                        isStatic={true} 
                        layout={layout}
                    />
                </div>
            </section>
        </div>
      </main>
    </div>
  );
};

export default PrintLayout;
