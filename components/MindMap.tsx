import React, { useRef, useEffect, useMemo, useState, useContext, createContext, useCallback } from 'react';
import * as d3 from 'd3';
import { MindMapNode as MindMapData, Doodle, MindMapLayout } from '../types';
import { IconBody } from './Icons';

interface MindMapProps {
  data: MindMapData;
  mapId: string;
  width?: number;
  height?: number;
  isStatic?: boolean;
  layout?: MindMapLayout;
  onLayoutUpdate?: (mapId: string, layout: MindMapLayout) => void;
}

interface MindMapContextType {
  currentZoom: d3.ZoomTransform;
  updateNodePosition: (nodeId: string, dx: number, dy: number) => void;
  updateDoodlePosition: (doodleIndex: number, dx: number, dy: number) => void;
  isStatic: boolean;
}

const MindMapContext = createContext<MindMapContextType | null>(null);

const PADDING = { top: 30, right: 30, bottom: 30, left: 30 };
const NODE_WIDTH = 140;
const NODE_HEIGHT = 80;
const FONT_SIZE = 16;
const ICON_SIZE = 32;

const INK_COLOR = '#262626';
const PAPER_COLOR = '#fff';
const HIGHLIGHT_COLOR = '#fef08a';
const DEPTH_COLORS = ['#64b5f6', '#ffb74d', '#81c784', '#ba68c8', '#e57373'];

const CONTEXTUAL_DOODLES: { [key: string]: React.ReactNode } = {
  ideaBulb: <path d="M0-12c-4.4,0-8,3.6-8,8c0,3.2,1.9,6,4.5,7.2V5h7v2.2C5.6,6.1,7.5,3.2,7.5,0C7.5-6.6,3.9-12,0-12z M-2,8h4v2h-4V8z" />,
  flowArrow: <path d="M-15,0 C-5, -10, 5, 10, 15, 0 M10,-5 L15,0 L10,5" fill="none" />,
  puzzlePiece: <path d="M-8-15H0c-4.4,0-4.4,8,0,8h-4v4c-4.4,0-4.4,8,0,8H8c4.4,0,4.4-8,0-8h4v-4c4.4,0,4.4-8,0-8H8" />,
  bankBuilding: <path d="M0-15 L-12, -8 V15 H12 V-8 L0-15 M-8,15V0 M0,15V-2 M8,15V0 M-10,-6 H10" fill="none" />,
  dollarSign: <path d="M5-12c-4.3,0-6,2.2-6,5.5s1.7,5.5,6,5.5c3.7,0,6-2.2,6-5 M-2,0h10 M2-15v30" fill="none" />,
  scales: <path d="M-15,0H15 M0-15V15 M-12-3l-5,2.5c-3,0-3-5,0-5l5,2.5 M12-3l5,2.5c3,0,3-5,0-5l-5,2.5 M0,0 L-12,-3 M0,0 L12,-3" fill="none" />,
  shoppingCart: <path d="M-12-10H-8l4,12H10c2,0,2,4,0,4h-1c-2,0-2-4,0-4H0 M-6,-5H12L10,2H-4 M-8,-10c-2,0-2-4,0-4h1c2,0,2,4,0,4" fill="none"/>,
  airplane: <path d="M0,0 L15,-15 l-15,5 L-10,-12 l-3,10 10-2 Z" />,
  deliveryTruck: <path d="M-15,-10 V5 H5 l8-5 v-10 H-5z M-12,8a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 M8,8a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 M-15,-2 H-5" fill="none" />,
  factory: <path d="M-15,10h30 M-12,10V-5 l8-5 8,5 v15 M-10,-2 h2 M-2,-2 h2 M6,-2 h2" fill="none" />,
  cellTower: <path d="M0,15 L-5, -15 H5 Z M-8,-10 H8 M-6,-5 H6 M-4,0 H4" fill="none" />,
  cog: <path d="M0-12 l-2,4h4z M10.4-6 l-4,2v-4z M10.4,6 l-4-2v4z M0,12 l2-4h-4z M-10.4,6 l4-2v4z M-10.4,-6 l4,2v-4z M0,0a6,6 0 1,0 0,1z" fill="none" />,
  heartbeat: <path d="M-15,2 L-8,2 l-2-8 l4,12 l5-18 l4,14 L15,2" fill="none" />,
  capitol: <path d="M-12,10h24 M-10,10V0 h2 M-2,10V0 h2 M6,10V0 h2 M12,10V0 h2 M0-8a8,8 0 0 1 0,16 M0-8 L-15,0 H15Z" />,
  graduationCap: <path d="M-15,0 L0,8 L15,0 L0,-8Z M-2,8V12 h4 V8 l4,2 V15 H-6 V10Z" />,
  dataFlow: <path d="M-10-10 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0 M-10,10 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0 M-5,0 h10 M-12,0 h-3 M15,0 h-3 M0,-5 v-3 M0,15 v-3" fill="none" />,
  chatBubbles: <path d="M-12-8a8,8 0 0,1 16,0 a8,8 0 0,1 -16,0 M-12-8 l-3,5h3 M5-2a6,6 0 0,1 12,0 a6,6 0 0,1 -12,0 M5-2 l-3,5h3" fill="none" />,
};

const DOODLES_BY_THEME: { [key: string]: string[] } = {
  landscape: ['ideaBulb', 'flowArrow', 'puzzlePiece'],
  finance: ['bankBuilding', 'dollarSign', 'scales'],
  consumer: ['shoppingCart', 'airplane', 'deliveryTruck'],
  tech: ['factory', 'cellTower', 'cog'],
  social: ['heartbeat', 'capitol', 'graduationCap'],
  horizontal: ['ideaBulb', 'flowArrow', 'puzzlePiece'],
  patterns: ['dataFlow', 'chatBubbles', 'cog'],
};

let canvas: HTMLCanvasElement | undefined;

const wrapText = (text: string, maxWidth: number): string[] => {
  if (typeof window !== 'undefined' && !canvas) {
    canvas = document.createElement('canvas');
  }
  const context = canvas?.getContext('2d');
  if (!context) {
    const words = text.split(/\s+/).reverse();
    let word;
    const lines: string[] = [];
    let line: string[] = [];
    while ((word = words.pop())) {
      line.push(word);
      const testLine = line.join(" ");
      if (testLine.length * (FONT_SIZE * 0.7) > maxWidth && line.length > 1) {
        line.pop();
        lines.push(line.join(" "));
        line = [word];
      }
    }
    lines.push(line.join(" "));
    return lines;
  }
  context.font = `${FONT_SIZE}px 'Gochi Hand', cursive`;
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const { width } = context.measureText(testLine);
    if (width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
};

const ContextualDoodle: React.FC<{ doodle: Doodle; index: number }> = ({ doodle, index }) => {
    const context = useContext(MindMapContext);
    const gRef = useRef<SVGGElement>(null);
    const { name, x, y, rotation, scale, color } = doodle;

    useEffect(() => {
        if (!gRef.current || !context || context.isStatic) return;
        const { currentZoom, updateDoodlePosition } = context;

        const drag = d3.drag<SVGGElement, Doodle>()
            .on('start', (event) => event.sourceEvent.stopPropagation())
            .on('drag', (event) => {
                updateDoodlePosition(index, event.dx / currentZoom.k, event.dy / currentZoom.k);
            });
        
        d3.select(gRef.current).datum(doodle).call(drag);

    }, [doodle, index, context]);

    return (
      <g 
        ref={gRef}
        transform={`translate(${x},${y}) rotate(${rotation}) scale(${scale})`} 
        style={{ filter: 'url(#sketchy-line)', pointerEvents: context?.isStatic ? 'none' : 'all' }}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={!context?.isStatic ? "draggable cursor-move" : ""}
      >
          {CONTEXTUAL_DOODLES[name]}
      </g>
    );
};


const Node: React.FC<{ node: d3.HierarchyPointNode<MindMapData> }> = ({ node }) => {
    const context = useContext(MindMapContext);
    const gRef = useRef<SVGGElement>(null);

    useEffect(() => {
        if (!gRef.current || !context || context.isStatic) return;
        const { currentZoom, updateNodePosition } = context;

        const drag = d3.drag<SVGGElement, d3.HierarchyPointNode<MindMapData>>()
            .on('start', (event) => event.sourceEvent.stopPropagation())
            .on('drag', (event, d) => {
                if (d.id) {
                    updateNodePosition(d.id, event.dx / currentZoom.k, event.dy / currentZoom.k);
                }
            });

        d3.select(gRef.current).datum(node).call(drag);
    }, [node, context]);

    const lines = useMemo(() => wrapText(node.data.name, NODE_WIDTH - 20), [node.data.name]);
    const isRoot = node.depth === 0;
    const hasIcon = !!node.data.imageUrl;
    const textYOffset = hasIcon ? 10 : 0;
    
    const branchIndex = (node as any).branchIndex ?? 0;
    const nodeColor = isRoot ? INK_COLOR : DEPTH_COLORS[branchIndex % DEPTH_COLORS.length];

    const random = useMemo(() => d3.randomLcg(node.id || (node.x + node.y)), [node.id, node.x, node.y]);
    const outlineRotation = useMemo(() => (random() - 0.5) * 1.5, [random]);
    const outlineDx = useMemo(() => (random() - 0.5) * 2, [random]);
    const outlineDy = useMemo(() => (random() - 0.5) * 2, [random]);

    return (
      <g transform={`translate(${node.y},${node.x})`} ref={gRef} className={!context?.isStatic ? "draggable cursor-move" : ""}>
        <rect
          x={-NODE_WIDTH / 2}
          y={-NODE_HEIGHT / 2}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx="15"
          ry="15"
          fill={PAPER_COLOR}
        />
        
        {isRoot && (
           <rect
            x={-NODE_WIDTH / 2}
            y={-NODE_HEIGHT / 2}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            rx="15"
            ry="15"
            fill="url(#scribble-highlight)"
            transform={`rotate(${(random() - 0.5) * 2})`}
            opacity="0.9"
          />
        )}
        
        <rect
          x={-NODE_WIDTH / 2}
          y={-NODE_HEIGHT / 2}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx="15"
          ry="15"
          fill="none"
          stroke={nodeColor}
          strokeWidth="3"
          style={{ filter: 'url(#sketchy)' }}
          transform={`translate(${outlineDx}, ${outlineDy}) rotate(${outlineRotation})`}
        />

        {hasIcon && (
          <g
            transform={`translate(0, ${-NODE_HEIGHT / 2 + 8 + ICON_SIZE / 2}) scale(${ICON_SIZE / 24}) translate(-12, -12)`}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke={isRoot ? INK_COLOR : '#334155'}
          >
             <IconBody name={node.data.imageUrl!} />
          </g>
        )}
        <text
          y={textYOffset}
          fontSize={FONT_SIZE}
          textAnchor="middle"
          fill={INK_COLOR}
          className="select-none"
          dominantBaseline="middle"
          style={{ fontFamily: "'Gochi Hand', cursive" }}
        >
          {lines.map((line, i) => (
            <tspan
              key={i}
              x="0"
              dy={i === 0 ? `${(lines.length > 1 ? -0.6 : 0) + (hasIcon ? 0.8 : 0)}em` : '1.2em'}
            >
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
};

const Link: React.FC<{ link: d3.HierarchyPointLink<MindMapData>; color: string }> = ({ link, color }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const path = useMemo(() => {
    const p = d3.path();
    const startX = link.source.y;
    const startY = link.source.x;
    const endX = link.target.y;
    const endY = link.target.x;

    // For nearly horizontal lines, create a slight S-curve. This ensures the sketchy
    // filter has an effect and makes the line appear thicker, consistent with others.
    if (Math.abs(startY - endY) < 1) {
        const midX1 = d3.interpolate(startX, endX)(0.4);
        const midX2 = d3.interpolate(startX, endX)(0.6);
        const curve = 15;
        p.moveTo(startX, startY);
        p.bezierCurveTo(midX1, startY - curve, midX2, endY + curve, endX, endY);
        return p.toString();
    }
    
    // For all other lines, use the standard "elbow" curve.
    const midX = (startX + endX) / 2;
    p.moveTo(startX, startY);
    p.bezierCurveTo(midX, startY, midX, endY, endX, endY);
    return p.toString();
  }, [link.source.x, link.source.y, link.target.x, link.target.y]);

  const isStatic = useContext(MindMapContext)?.isStatic ?? false;

  useEffect(() => {
    const pathElement = pathRef.current;
    if (pathElement && !isStatic) {
      const length = pathElement.getTotalLength();
      pathElement.style.strokeDasharray = `${length} ${length}`;
      pathElement.style.strokeDashoffset = `${length}`;
      pathElement.getBoundingClientRect();
      pathElement.style.transition = 'stroke-dashoffset 1s ease-in-out';
      pathElement.style.strokeDashoffset = '0';
    }
  }, [path, isStatic]);

  return (
    <g style={{ filter: 'url(#sketchy-line)' }}>
      <path d={path} fill="none" stroke={color} strokeWidth="6" strokeOpacity={0.3} strokeLinecap="round" />
      <path ref={pathRef} d={path} fill="none" stroke={color} strokeWidth="3" strokeOpacity={0.8} strokeLinecap="round" />
    </g>
  );
};

const calculateDoodles = (root: d3.HierarchyPointNode<MindMapData>, mapId: string): Doodle[] => {
    const nodes = root.descendants();
    if (nodes.length <= 1) return [];

    const nodePoints = nodes.map(n => ({ x: n.y, y: n.x }));
    const linkPoints: { x: number, y: number }[] = [];
    
    root.links().forEach(link => {
      const startX = link.source.y;
      const startY = link.source.x;
      const endX = link.target.y;
      const endY = link.target.x;
      const midX = (startX + endX) / 2;
      
      for (let t = 0; t <= 1; t += 0.1) {
        const b = (p0: number, p1: number, p2: number, p3: number) => {
            const mt = 1 - t;
            return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
        };
        linkPoints.push({ x: b(startX, midX, midX, endX), y: b(startY, startY, endY, endY) });
      }
    });

    const allPoints = [...nodePoints, ...linkPoints];
    if (allPoints.length === 0) return [];

    const [minX, maxX] = d3.extent(allPoints, d => d.x) as [number, number];
    const [minY, maxY] = d3.extent(allPoints, d => d.y) as [number, number];

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const centerX = minX + contentWidth / 2;
    const centerY = minY + contentHeight / 2;

    const ellipseRx = contentWidth / 2 + 100;
    const ellipseRy = contentHeight / 2 + 100;

    const candidates: { x: number, y: number, score: number }[] = [];
    const numCandidates = 500;

    for (let i = 0; i < numCandidates; i++) {
        const x = d3.randomUniform(minX - 50, maxX + 50)();
        const y = d3.randomUniform(minY - 50, maxY + 50)();

        const isInsideEllipse = ((x - centerX) ** 2) / (ellipseRx ** 2) + ((y - centerY) ** 2) / (ellipseRy ** 2) <= 1;
        if (!isInsideEllipse) continue;

        let minDistSq = Infinity;
        for (const p of allPoints) {
            const distSq = (x - p.x) ** 2 + (y - p.y) ** 2;
            if (distSq < minDistSq) minDistSq = distSq;
        }
        candidates.push({ x, y, score: minDistSq });
    }

    candidates.sort((a, b) => b.score - a.score);

    const doodleTypes = DOODLES_BY_THEME[mapId] || [];
    if (doodleTypes.length === 0) return [];
    
    const shuffledDoodleTypes = [...doodleTypes].sort(() => 0.5 - Math.random());

    const numDoodles = Math.min(
      Math.floor(nodes.length / 2.5),
      shuffledDoodleTypes.length,
      8
    );

    const chosenDoodles: Doodle[] = [];
    const MIN_SEPARATION_SQ = (ICON_SIZE * 2.5) ** 2;

    const candidatePool = candidates.slice(0, Math.max(numDoodles * 4, 30));
    
    while (chosenDoodles.length < numDoodles && candidatePool.length > 0) {
        const poolIndex = Math.floor(Math.random() * candidatePool.length);
        const candidate = candidatePool[poolIndex];
        candidatePool.splice(poolIndex, 1);
      
        if (candidate.score < MIN_SEPARATION_SQ) continue;

        let isFarEnough = true;
        for (const placedDoodle of chosenDoodles) {
            const distSq = (candidate.x - placedDoodle.x) ** 2 + (candidate.y - placedDoodle.y) ** 2;
            if (distSq < MIN_SEPARATION_SQ) {
                isFarEnough = false;
                break;
            }
        }

        if (isFarEnough) {
            chosenDoodles.push({
              name: shuffledDoodleTypes[chosenDoodles.length],
              x: candidate.x,
              y: candidate.y,
              rotation: d3.randomUniform(-25, 25)(),
              scale: d3.randomUniform(0.8, 1.2)(),
              color: DEPTH_COLORS[d3.randomInt(0, DEPTH_COLORS.length)()]
            });
        }
    }
    return chosenDoodles;
}

const MindMap: React.FC<MindMapProps> = ({ data, mapId, width = 0, height = 0, isStatic = false, layout, onLayoutUpdate }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentZoom, setCurrentZoom] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [, setVersion] = useState(0);
  const forceUpdate = useCallback(() => setVersion(v => v + 1), []);

  const { root, doodles } = useMemo<MindMapLayout>(() => {
    if (layout) {
      return layout;
    }
    const hierarchy = d3.hierarchy(data).eachBefore(node => {
      // Create a unique ID by building a path from the root.
      // This ensures that even nodes with the same name are distinguishable.
      if (node.parent) {
        // Find the node's index within its parent's children array.
        const index = node.parent.children?.indexOf(node) ?? 0;
        // Append the child index and sanitized name to the parent's ID.
        node.id = `${node.parent.id}/${index}-${node.data.name.replace(/\s+/g, '_')}`;
      } else {
        // The root node has a base ID.
        node.id = `0-${node.data.name.replace(/\s+/g, '_')}`;
      }
    });

    hierarchy.each(node => {
        if (node.depth > 0) {
            const ancestors = node.ancestors();
            const branchHead = ancestors[ancestors.length - 2]; 
            const rootNode = ancestors[ancestors.length - 1];
            (node as any).branchIndex = rootNode.children?.indexOf(branchHead) ?? 0;
        } else {
            (node as any).branchIndex = -1;
        }
    });

    const leaves = hierarchy.leaves().length;
    const treeHeight = hierarchy.height; 
    const verticalSpacing = NODE_HEIGHT + 30;
    const horizontalSpacing = NODE_WIDTH + 120;
    const layoutHeight = leaves * verticalSpacing;
    const layoutWidth = (treeHeight + 1) * horizontalSpacing;
    const treeLayout = d3.tree<MindMapData>().size([layoutHeight, layoutWidth]);
    const calculatedRoot = treeLayout(hierarchy);
    const calculatedDoodles = calculateDoodles(calculatedRoot, mapId);

    return { root: calculatedRoot, doodles: calculatedDoodles };
  }, [data, layout, mapId]);

  useEffect(() => {
    if (!layout && root && onLayoutUpdate) {
        onLayoutUpdate(mapId, { root, doodles });
    }
  }, [layout, root, doodles, mapId, onLayoutUpdate]);

  const updateNodePosition = useCallback((nodeId: string, dx: number, dy: number) => {
    const node = root.descendants().find(d => d.id === nodeId);
    if(node) {
        node.y += dx;
        node.x += dy;
        forceUpdate();
        if (onLayoutUpdate) {
            onLayoutUpdate(mapId, { root, doodles });
        }
    }
  }, [root, doodles, mapId, onLayoutUpdate, forceUpdate]);
  
  const updateDoodlePosition = useCallback((doodleIndex: number, dx: number, dy: number) => {
    const doodle = doodles[doodleIndex];
    if (doodle) {
        doodle.x += dx;
        doodle.y += dy;
        forceUpdate();
        if (onLayoutUpdate) {
            onLayoutUpdate(mapId, { root, doodles });
        }
    }
  }, [root, doodles, mapId, onLayoutUpdate, forceUpdate]);

  useEffect(() => {
    if (isStatic || !svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.3, 2])
      .filter(event => event.type !== 'mousedown' || !event.target.closest('.draggable'))
      .on('zoom', (event) => {
        setCurrentZoom(event.transform);
      });

    svg.call(zoom);

    const descendants = root.descendants();
    if (descendants.length === 0) return;

    const xExtent = d3.extent(descendants, d => d.y) as [number, number];
    const yExtent = d3.extent(descendants, d => d.x) as [number, number];

    const contentWidth = xExtent[1] - xExtent[0] + NODE_WIDTH * 2;
    const contentHeight = yExtent[1] - yExtent[0] + NODE_HEIGHT * 2;

    const scaleX = width / contentWidth;
    const scaleY = height / contentHeight;
    const initialScale = Math.min(scaleX, scaleY) * 0.9;

    const initialTx = width / 2 - (xExtent[0] + (xExtent[1] - xExtent[0]) / 2) * initialScale;
    const initialTy = height / 2 - (yExtent[0] + (yExtent[1] - yExtent[0]) / 2) * initialScale;

    const initialTransform = d3.zoomIdentity
        .translate(initialTx, initialTy)
        .scale(initialScale);
        
    svg.call(zoom.transform as any, initialTransform);
    setCurrentZoom(initialTransform);

    return () => {
      svg.on('.zoom', null); // Clean up zoom listener
    };
  }, [data, width, height, isStatic, root]);

  const staticDims = useMemo(() => {
    if (!isStatic) return null;
    const descendants = root.descendants();
    if (descendants.length === 0) return { width: 1000, height: 800, viewBox: '0 0 1000 800' };

    const xExtent = d3.extent(descendants, d => d.y) as [number, number];
    const yExtent = d3.extent(descendants, d => d.x) as [number, number];

    const minX = xExtent[0] - NODE_WIDTH / 2 - PADDING.left;
    const minY = yExtent[0] - NODE_HEIGHT / 2 - PADDING.top;
    const contentWidth = xExtent[1] - xExtent[0] + NODE_WIDTH + PADDING.left + PADDING.right;
    const contentHeight = yExtent[1] - yExtent[0] + NODE_HEIGHT + PADDING.top + PADDING.bottom;

    return {
      width: contentWidth,
      height: contentHeight,
      viewBox: `${minX} ${minY} ${contentWidth} ${contentHeight}`,
    };
  }, [isStatic, root]);
  
  const contextValue = useMemo(() => ({
    currentZoom,
    updateNodePosition,
    updateDoodlePosition,
    isStatic,
  }), [currentZoom, updateNodePosition, updateDoodlePosition, isStatic]);

  if (!root) {
    return null;
  }

  return (
    <svg 
      ref={svgRef} 
      width={isStatic ? staticDims?.width : width} 
      height={isStatic ? staticDims?.height : height}
      viewBox={isStatic ? staticDims?.viewBox : undefined}
      className={`w-full h-full ${!isStatic ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <defs>
        <pattern id="scribble-highlight" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
          <path d="M-1,2 l3,-3 M0,10 l10,-10 M9,11 l3,-3" stroke={HIGHLIGHT_COLOR} strokeWidth="2.5" strokeLinecap="round" />
        </pattern>
        <filter id="sketchy">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
         <filter id="sketchy-line">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <MindMapContext.Provider value={contextValue}>
        <g className="zoom-container" transform={isStatic ? undefined : currentZoom.toString()}>
          {root.links().map((link) => {
            const branchIndex = (link.target as any).branchIndex ?? 0;
            return <Link key={`${link.source.id}-${link.target.id}`} link={link} color={DEPTH_COLORS[branchIndex % DEPTH_COLORS.length]} />;
          })}
          {root.descendants().map((node) => (
            <Node key={node.id} node={node} />
          ))}
          {doodles.map((doodle, i) => (
            <ContextualDoodle key={i} doodle={doodle} index={i} />
          ))}
        </g>
      </MindMapContext.Provider>
    </svg>
  );
};

export default MindMap;