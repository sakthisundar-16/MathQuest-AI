import React, { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Mesh3D {
  vertices: Point3D[];
  edges: [number, number][];
  pos: Point3D;
  rot: Point3D;
  rotSpeed: Point3D;
  driftSpeed: Point3D;
  scale: number;
  color: string;
}

// Generate simple 3D Polyhedra
function createCube(scale: number): { vertices: Point3D[]; edges: [number, number][] } {
  const d = scale / 2;
  const vertices: Point3D[] = [
    { x: -d, y: -d, z: -d },
    { x: d, y: -d, z: -d },
    { x: d, y: d, z: -d },
    { x: -d, y: d, z: -d },
    { x: -d, y: -d, z: d },
    { x: d, y: -d, z: d },
    { x: d, y: d, z: d },
    { x: -d, y: d, z: d }
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];
  return { vertices, edges };
}

function createOctahedron(scale: number): { vertices: Point3D[]; edges: [number, number][] } {
  const d = scale / 1.4;
  const vertices: Point3D[] = [
    { x: d, y: 0, z: 0 },
    { x: -d, y: 0, z: 0 },
    { x: 0, y: d, z: 0 },
    { x: 0, y: -d, z: 0 },
    { x: 0, y: 0, z: d },
    { x: 0, y: 0, z: -d }
  ];
  const edges: [number, number][] = [
    [0, 2], [2, 1], [1, 3], [3, 0],
    [0, 4], [1, 4], [2, 4], [3, 4],
    [0, 5], [1, 5], [2, 5], [3, 5]
  ];
  return { vertices, edges };
}

function createTetrahedron(scale: number): { vertices: Point3D[]; edges: [number, number][] } {
  const a = scale / 1.5;
  const vertices: Point3D[] = [
    { x: a, y: a, z: a },
    { x: -a, y: -a, z: a },
    { x: -a, y: a, z: -a },
    { x: a, y: -a, z: -a }
  ];
  const edges: [number, number][] = [
    [0, 1], [0, 2], [0, 3],
    [1, 2], [2, 3], [3, 1]
  ];
  return { vertices, edges };
}

export const Floating3DBackground: React.FC<{ isGrade6?: boolean }> = ({ isGrade6 = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Color palettes for 3D gem edges
    const colors = isGrade6
      ? ['rgba(244, 114, 182, 0.45)', 'rgba(251, 146, 60, 0.4)', 'rgba(167, 139, 250, 0.45)', 'rgba(252, 211, 77, 0.45)']
      : ['rgba(56, 189, 248, 0.45)', 'rgba(245, 158, 11, 0.4)', 'rgba(16, 185, 129, 0.4)', 'rgba(59, 130, 246, 0.45)'];

    // Instantiate 6 floating 3D mathematical shapes
    const meshes: Mesh3D[] = [
      {
        ...createOctahedron(48),
        pos: { x: width * 0.15, y: height * 0.22, z: 300 },
        rot: { x: 0.2, y: 0.5, z: 0 },
        rotSpeed: { x: 0.006, y: 0.009, z: 0.003 },
        driftSpeed: { x: 0.15, y: -0.1, z: 0 },
        scale: 1,
        color: colors[0]
      },
      {
        ...createCube(44),
        pos: { x: width * 0.85, y: height * 0.35, z: 320 },
        rot: { x: 0.5, y: 0.2, z: 0.4 },
        rotSpeed: { x: 0.005, y: 0.008, z: 0.004 },
        driftSpeed: { x: -0.12, y: 0.08, z: 0 },
        scale: 1,
        color: colors[1]
      },
      {
        ...createTetrahedron(52),
        pos: { x: width * 0.22, y: height * 0.75, z: 280 },
        rot: { x: 0.1, y: 0.8, z: 0.2 },
        rotSpeed: { x: 0.008, y: 0.004, z: 0.006 },
        driftSpeed: { x: 0.1, y: 0.12, z: 0 },
        scale: 1,
        color: colors[2]
      },
      {
        ...createOctahedron(38),
        pos: { x: width * 0.78, y: height * 0.82, z: 340 },
        rot: { x: 0.4, y: 0.3, z: 0.7 },
        rotSpeed: { x: 0.007, y: 0.006, z: 0.005 },
        driftSpeed: { x: -0.1, y: -0.15, z: 0 },
        scale: 1,
        color: colors[3]
      },
      {
        ...createCube(34),
        pos: { x: width * 0.5, y: height * 0.15, z: 360 },
        rot: { x: 0.3, y: 0.6, z: 0.1 },
        rotSpeed: { x: 0.004, y: 0.007, z: 0.003 },
        driftSpeed: { x: 0.08, y: 0.06, z: 0 },
        scale: 0.9,
        color: colors[0]
      }
    ];

    const fov = 400;

    let isDocumentVisible = !document.hidden;
    const handleVisibility = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      if (!isDocumentVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      meshes.forEach((mesh) => {
        // Drift movement within screen boundaries
        mesh.pos.x += mesh.driftSpeed.x;
        mesh.pos.y += mesh.driftSpeed.y;

        if (mesh.pos.x < 50 || mesh.pos.x > width - 50) mesh.driftSpeed.x *= -1;
        if (mesh.pos.y < 50 || mesh.pos.y > height - 50) mesh.driftSpeed.y *= -1;

        // Rotation
        mesh.rot.x += mesh.rotSpeed.x;
        mesh.rot.y += mesh.rotSpeed.y;
        mesh.rot.z += mesh.rotSpeed.z;

        const cosX = Math.cos(mesh.rot.x);
        const sinX = Math.sin(mesh.rot.x);
        const cosY = Math.cos(mesh.rot.y);
        const sinY = Math.sin(mesh.rot.y);
        const cosZ = Math.cos(mesh.rot.z);
        const sinZ = Math.sin(mesh.rot.z);

        // Transform vertices
        const projected = mesh.vertices.map((v) => {
          // Rotate around X
          let y1 = v.y * cosX - v.z * sinX;
          let z1 = v.y * sinX + v.z * cosX;
          // Rotate around Y
          let x2 = v.x * cosY + z1 * sinY;
          let z2 = -v.x * sinY + z1 * cosY;
          // Rotate around Z
          let x3 = x2 * cosZ - y1 * sinZ;
          let y3 = x2 * sinZ + y1 * cosZ;

          // 3D Perspective Projection
          const totalZ = z2 + mesh.pos.z;
          const scaleFactor = fov / Math.max(10, totalZ);
          return {
            x: mesh.pos.x + x3 * scaleFactor,
            y: mesh.pos.y + y3 * scaleFactor
          };
        });

        // Draw 3D Edges
        ctx.strokeStyle = mesh.color;
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';

        mesh.edges.forEach(([i, j]) => {
          const p1 = projected[i];
          const p2 = projected[j];
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // Draw glowing vertex points
        ctx.fillStyle = mesh.color;
        projected.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isGrade6, prefersReduced]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-1 overflow-hidden"
    />
  );
};
