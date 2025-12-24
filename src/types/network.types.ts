import * as d3 from 'd3';

export interface Person {
  id: string;
  name: string;
}

export interface Relationship {
  from: string;
  to: string;
}

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  distance: number;
  isCritical: boolean;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

export interface NetworkVisualizationData {
  nodes: GraphNode[];
  links: GraphLink[];
  distances: Map<string, number>;
}
