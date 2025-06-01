'use client';

import { useEffect, useRef } from 'react';

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let nodes: Array<{
      x: number;
      y: number;
      connections: number[];
      pulses: Array<{ progress: number; targetNode: number }>;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createNodes = () => {
      nodes = [];
      const gridSize = 100;
      const cols = Math.ceil(canvas.width / gridSize);
      const rows = Math.ceil(canvas.height / gridSize);

      // Create nodes in a grid with some randomness
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          nodes.push({
            x: j * gridSize + Math.random() * 40 - 20,
            y: i * gridSize + Math.random() * 40 - 20,
            connections: [],
            pulses: [],
          });
        }
      }

      // Create connections between nodes
      nodes.forEach((node, i) => {
        const nearbyNodes = nodes
          .map((n, index) => ({ node: n, index }))
          .filter(({ node, index }) => {
            if (index === i) return false;
            const dx = node.x - nodes[i].x;
            const dy = node.y - nodes[i].y;
            return Math.sqrt(dx * dx + dy * dy) < gridSize * 1.5;
          });

        nearbyNodes.forEach(({ index }) => {
          if (!node.connections.includes(index)) {
            node.connections.push(index);
          }
        });
      });
    };

    const createPulse = () => {
      const startNode = Math.floor(Math.random() * nodes.length);
      if (nodes[startNode].connections.length > 0) {
        const targetNode = nodes[startNode].connections[
          Math.floor(Math.random() * nodes[startNode].connections.length)
        ];
        nodes[startNode].pulses.push({
          progress: 0,
          targetNode,
        });
      }
    };

    const drawCircuits = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      nodes.forEach((node, i) => {
        node.connections.forEach(targetIndex => {
          const target = nodes[targetIndex];
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
          ctx.lineWidth = 1;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Draw and update pulses
      nodes.forEach((node, i) => {
        node.pulses = node.pulses.filter(pulse => {
          const target = nodes[pulse.targetNode];
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const x = node.x + dx * pulse.progress;
          const y = node.y + dy * pulse.progress;

          // Draw pulse
          ctx.beginPath();
          ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();

          // Update progress
          pulse.progress += 0.02;
          return pulse.progress < 1;
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Randomly create new pulses
      if (Math.random() < 0.05) {
        createPulse();
      }

      requestAnimationFrame(drawCircuits);
    };

    resize();
    createNodes();
    drawCircuits(0);

    window.addEventListener('resize', () => {
      resize();
      createNodes();
    });

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 to-black opacity-20"
    />
  );
} 