import React, { useRef, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import * as d3 from 'd3';
import type { GraphNode, GraphLink } from '../../types/network.types';
import { NetworkService } from '../../services/network.service';

interface NetworkVisualizationProps {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

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
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    node.call(drag as any);

    node.append('circle')
      .attr('r', 30)
      .attr('fill', d => NetworkService.getNodeColor(d.distance))
      .attr('stroke', d => d.isCritical ? '#000' : '#fff')
      .attr('stroke-width', d => d.isCritical ? 4 : 2);

    node.append('text')
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', -35)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');

    node.append('text')
      .text(d => NetworkService.getNodeLabel(d.distance))
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

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Network Visualization (D3.js)
      </Typography>
      <Box sx={{ bgcolor: '#f9f9f9', border: '1px solid #ddd', borderRadius: 1 }}>
        <svg ref={svgRef} style={{ display: 'block' }}></svg>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        <strong>Legend:</strong> 🔵 Index (D0) | 🟡 Distance 1 | 🔴 CRITICAL ALERT Distance 2
      </Typography>
    </Paper>
  );
};
