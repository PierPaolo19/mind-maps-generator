import * as d3 from 'd3';

export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
  imageUrl?: string;
}

export interface Doodle {
  name: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

// Using 'any' for the d3 hierarchy object as its full type is very complex
// and not easily serializable or transferable via props.
export interface MindMapLayout {
  root: d3.HierarchyPointNode<MindMapNode>;
  doodles: Doodle[];
}

export interface MindMapObject {
  title: string;
  id: string;
  data: MindMapNode;
}
