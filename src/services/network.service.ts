import type { Person, Relationship, GraphNode, GraphLink, NetworkVisualizationData } from '../types/network.types';

/**
 * Service layer for network graph operations
 */
export class NetworkService {
  /**
   * Calculate distances from index person using BFS (Breadth-First Search)
   * @param startId - ID of the index person
   * @param relationships - Array of relationships
   * @returns Map with person ID and their distance from index
   */
  static calculateDistances(
    startId: string,
    relationships: Relationship[]
  ): Map<string, number> {
    const distances = new Map<string, number>();
    const queue: { id: string; distance: number }[] = [{ id: startId, distance: 0 }];
    const visited = new Set<string>();

    distances.set(startId, 0);
    visited.add(startId);

    while (queue.length > 0) {
      const current = queue.shift()!;

      // Stop at distance 2 (max D2)
      if (current.distance >= 2) continue;

      // Find all connected people
      relationships.forEach(rel => {
        let nextId: string | null = null;
        if (rel.from === current.id && !visited.has(rel.to)) {
          nextId = rel.to;
        } else if (rel.to === current.id && !visited.has(rel.from)) {
          nextId = rel.from;
        }

        if (nextId) {
          visited.add(nextId);
          const newDistance = current.distance + 1;
          distances.set(nextId, newDistance);
          queue.push({ id: nextId, distance: newDistance });
        }
      });
    }

    return distances;
  }

  /**
   * Generate Graphviz DOT code for network visualization
   * @param people - Array of people
   * @param distances - Distance map from index person
   * @param relationships - Array of relationships
   * @returns DOT format string
   */
  static generateDotCode(
    people: Person[],
    distances: Map<string, number>,
    relationships: Relationship[]
  ): string {
    const lines: string[] = ['graph NetworkGraph {'];
    lines.push('  rankdir=LR;');
    lines.push('  node [shape=circle, style=filled];');
    lines.push('');

    // Add nodes with styling based on distance
    people.forEach(person => {
      const distance = distances.get(person.id);
      if (distance !== undefined) {
        let style = '';
        let label = `${person.name} (D${distance})`;
        
        if (distance === 0) {
          style = 'fillcolor=lightblue';
          label = `${person.name} (INDEX)`;
        } else if (distance === 1) {
          style = 'fillcolor=yellow';
        } else if (distance === 2) {
          style = 'fillcolor=red, fontcolor=white, penwidth=3';
          label = `${person.name} (⚠ CRITICAL ALERT D2 ⚠)`;
        }

        lines.push(`  "${person.id}" [label="${label}", ${style}];`);
      }
    });

    lines.push('');

    // Add edges
    const addedEdges = new Set<string>();
    relationships.forEach(rel => {
      const d1 = distances.get(rel.from);
      const d2 = distances.get(rel.to);
      
      // Only include edges where both nodes are within distance 2
      if (d1 !== undefined && d2 !== undefined) {
        const edgeKey = [rel.from, rel.to].sort((a, b) => a.localeCompare(b)).join('-');
        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);
          lines.push(`  "${rel.from}" -- "${rel.to}";`);
        }
      }
    });

    lines.push('}');
    return lines.join('\n');
  }

  /**
   * Prepare data for D3 visualization
   * @param people - Array of people
   * @param relationships - Array of relationships
   * @param distances - Distance map from index person
   * @returns Object containing nodes and links for D3
   */
  static prepareVisualizationData(
    people: Person[],
    relationships: Relationship[],
    distances: Map<string, number>
  ): NetworkVisualizationData {
    const nodes: GraphNode[] = people
      .filter(p => distances.has(p.id))
      .map(p => ({
        id: p.id,
        name: p.name,
        distance: distances.get(p.id)!,
        isCritical: distances.get(p.id) === 2
      }));

    const links: GraphLink[] = relationships
      .filter(rel => distances.has(rel.from) && distances.has(rel.to))
      .map(rel => ({
        source: rel.from,
        target: rel.to
      }));

    return { nodes, links, distances };
  }

  /**
   * Get color for node based on distance
   * @param distance - Distance from index person
   * @returns Color string
   */
  static getNodeColor(distance: number): string {
    if (distance === 0) return 'lightblue';
    if (distance === 1) return 'yellow';
    if (distance === 2) return 'red';
    return 'gray';
  }

  /**
   * Get label for node based on distance
   * @param distance - Distance from index person
   * @returns Label string
   */
  static getNodeLabel(distance: number): string {
    if (distance === 0) return 'INDEX';
    if (distance === 2) return '⚠ D2 ALERT';
    return `D${distance}`;
  }
}
