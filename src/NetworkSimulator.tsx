import React, { useState, useRef } from 'react';
import * as d3 from 'd3';

interface Person {
  id: string;
  name: string;
}

interface Relationship {
  from: string;
  to: string;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  distance: number;
  isCritical: boolean;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

const NetworkSimulator: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [fromPerson, setFromPerson] = useState('');
  const [toPerson, setToPerson] = useState('');
  const [indexPerson, setIndexPerson] = useState('');
  const [dotCode, setDotCode] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  const addPerson = () => {
    if (newPersonName.trim()) {
      const newPerson: Person = {
        id: `person-${Date.now()}`,
        name: newPersonName.trim()
      };
      setPeople([...people, newPerson]);
      setNewPersonName('');
    }
  };

  const addRelationship = () => {
    if (fromPerson && toPerson && fromPerson !== toPerson) {
      const newRelationship: Relationship = { from: fromPerson, to: toPerson };
      setRelationships([...relationships, newRelationship]);
      setFromPerson('');
      setToPerson('');
    }
  };

  // BFS to calculate distance from index person
  const calculateDistances = (startId: string): Map<string, number> => {
    const distances = new Map<string, number>();
    const queue: { id: string; distance: number }[] = [{ id: startId, distance: 0 }];
    const visited = new Set<string>();

    distances.set(startId, 0);
    visited.add(startId);

    while (queue.length > 0) {
      const current = queue.shift()!;

      // Stop at distance 2 (max D3)
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
  };

  // Generate Graphviz DOT code
  const generateDotCode = (distances: Map<string, number>): string => {
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
        const edgeKey = [rel.from, rel.to].sort().join('-');
        if (!addedEdges.has(edgeKey)) {
          addedEdges.add(edgeKey);
          lines.push(`  "${rel.from}" -- "${rel.to}";`);
        }
      }
    });

    lines.push('}');
    return lines.join('\n');
  };

  const visualizeNetwork = () => {
    if (!indexPerson || !svgRef.current) return;

    const distances = calculateDistances(indexPerson);
    const dot = generateDotCode(distances);
    setDotCode(dot);

    // Prepare data for D3
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

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 2);

    // Create nodes
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g');
    
    // Add drag behavior
    node.call(d3.drag<SVGGElement, GraphNode>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended) as any);

    node.append('circle')
      .attr('r', 30)
      .attr('fill', d => {
        if (d.distance === 0) return 'lightblue';
        if (d.distance === 1) return 'yellow';
        if (d.distance === 2) return 'red';
        return 'gray';
      })
      .attr('stroke', d => d.isCritical ? '#000' : '#fff')
      .attr('stroke-width', d => d.isCritical ? 4 : 2);

    node.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', -35)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');

    node.append('text')
      .text(d => {
        if (d.distance === 0) return 'INDEX';
        if (d.distance === 2) return '⚠ D2 ALERT';
        return `D${d.distance}`;
      })
      .attr('text-anchor', 'middle')
      .attr('dy', 5)
      .attr('font-size', '10px')
      .attr('fill', d => d.distance === 2 ? 'white' : 'black');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x!)
        .attr('y1', d => (d.source as GraphNode).y!)
        .attr('x2', d => (d.target as GraphNode).x!)
        .attr('y2', d => (d.target as GraphNode).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>NÃO MONO - Network Relationship Visualizer</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Anonymous STI signaling via network visualization (Distance 2 = Critical Alert)
      </p>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Input Section */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Add Person</h3>
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              placeholder="Person name"
              style={{ padding: '8px', marginRight: '10px', width: '200px' }}
              onKeyPress={(e) => e.key === 'Enter' && addPerson()}
            />
            <button onClick={addPerson} style={{ padding: '8px 15px', cursor: 'pointer' }}>
              Add Person
            </button>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Add Relationship</h3>
            <select
              value={fromPerson}
              onChange={(e) => setFromPerson(e.target.value)}
              style={{ padding: '8px', marginRight: '10px', width: '120px' }}
            >
              <option value="">From</option>
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select
              value={toPerson}
              onChange={(e) => setToPerson(e.target.value)}
              style={{ padding: '8px', marginRight: '10px', width: '120px' }}
            >
              <option value="">To</option>
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button onClick={addRelationship} style={{ padding: '8px 15px', cursor: 'pointer' }}>
              Add Relationship
            </button>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Visualize Network</h3>
            <select
              value={indexPerson}
              onChange={(e) => setIndexPerson(e.target.value)}
              style={{ padding: '8px', marginRight: '10px', width: '200px' }}
            >
              <option value="">Select Index Person</option>
              {people.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={visualizeNetwork}
              disabled={!indexPerson}
              style={{
                padding: '8px 15px',
                cursor: indexPerson ? 'pointer' : 'not-allowed',
                backgroundColor: indexPerson ? '#4CAF50' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '3px'
              }}
            >
              Generate Network
            </button>
          </div>

          <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>People ({people.length})</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {people.map(p => (
                <li key={p.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
                  {p.name}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h3>Relationships ({relationships.length})</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {relationships.map((r, idx) => {
                const fromName = people.find(p => p.id === r.from)?.name;
                const toName = people.find(p => p.id === r.to)?.name;
                return (
                  <li key={idx} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
                    {fromName} ↔ {toName}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Visualization Section */}
        <div style={{ flex: '2', minWidth: '400px' }}>
          <div style={{ marginBottom: '20px', padding: '15px', border: '2px solid #333', borderRadius: '5px' }}>
            <h3>Network Visualization (D3.js)</h3>
            <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '3px' }}>
              <svg ref={svgRef} style={{ display: 'block' }}></svg>
            </div>
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              <strong>Legend:</strong> 🔵 Index (D0) | 🟡 Distance 1 | 🔴 CRITICAL ALERT Distance 2
            </div>
          </div>

          {dotCode && (
            <div style={{ padding: '15px', border: '2px solid #333', borderRadius: '5px' }}>
              <h3>Graphviz DOT Code</h3>
              <pre
                style={{
                  backgroundColor: '#f4f4f4',
                  padding: '15px',
                  borderRadius: '3px',
                  overflow: 'auto',
                  maxHeight: '400px',
                  fontSize: '12px'
                }}
              >
                {dotCode}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(dotCode)}
                style={{
                  marginTop: '10px',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px'
                }}
              >
                Copy DOT Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkSimulator;
