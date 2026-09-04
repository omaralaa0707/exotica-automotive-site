"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import histogramData from "@/data/histogram.json";
import { CARS, HISTOGRAM_KEY, POSITIONS, type CarId } from "@/content/media";
import { useWebglHealth } from "@/lib/use-webgl-health";
import { useLocale } from "@/i18n/locale-provider";

/* ------------------------------------------------------------- decoding -- */

const { hueN: HUE_N, satN: SAT_N, lightN: LIGHT_N, satEdges: SAT_EDGES } =
  histogramData.meta as { hueN: number; satN: number; lightN: number; satEdges: number[] };

const CAPACITY = 232;
const RADIUS = 2.1;
const HEIGHT = 2.6;
const CELL = 0.11;

type Cell = { idx: number; count: number; x: number; y: number; z: number; color: [number, number, number]; satRing: number };

function hsl2rgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

function decodeCell(idx: number): { hi: number; si: number; li: number; achromatic: boolean } {
  if (idx < LIGHT_N) return { hi: 0, si: 0, li: idx, achromatic: true };
  const rem = idx - LIGHT_N;
  const li = Math.floor(rem / (HUE_N * SAT_N));
  const rem2 = rem % (HUE_N * SAT_N);
  const hi = Math.floor(rem2 / SAT_N);
  const si = rem2 % SAT_N;
  return { hi, si, li, achromatic: false };
}

type HistogramCars = Record<string, { positions: { pos: number; cells: number[][] }[] }>;

function cellsForPosition(carKey: string, pos: number): Cell[] {
  const car = (histogramData.cars as unknown as HistogramCars)[carKey];
  if (!car) return [];
  const posData = car.positions.find((p) => p.pos === pos);
  if (!posData) return [];
  return posData.cells.map(([idx, count]) => {
    const { hi, si, li, achromatic } = decodeCell(idx);
    const y = (li + 0.5) / LIGHT_N * HEIGHT - HEIGHT / 2;
    if (achromatic) {
      const l = (li + 0.5) / LIGHT_N;
      return { idx, count, x: 0, y, z: 0, color: [l, l, l], satRing: -1 };
    }
    const angle = ((hi + 0.5) / HUE_N) * Math.PI * 2;
    const satMid = (SAT_EDGES[si] + Math.min(SAT_EDGES[si + 1], 0.6)) / 2;
    const radius = RADIUS * Math.sqrt((si + 0.5) / SAT_N);
    const hue = ((hi + 0.5) / HUE_N) * 360;
    const light = (li + 0.5) / LIGHT_N;
    const rgb = hsl2rgb(hue, Math.min(satMid * 1.6, 0.9), light);
    return { idx, count, x: radius * Math.cos(angle), y, z: radius * Math.sin(angle), color: rgb, satRing: si };
  });
}

/* ------------------------------------------------------------------ room -- */

function Room() {
  return (
    <group>
      <mesh position={[0, -HEIGHT / 2 - 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={false}>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial color="#292929" roughness={0.35} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.6, -3.4]}>
        <planeGeometry args={[9, 6]} />
        <meshStandardMaterial color="#242424" roughness={0.75} />
      </mesh>
      <mesh position={[-4.2, 0.6, -1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#bdbdbd" roughness={0.85} />
      </mesh>
      {/* the neutral axis: every grey in the room is a fixed point on it */}
      <mesh>
        <cylinderGeometry args={[0.006, 0.006, HEIGHT + 0.4, 8]} />
        <meshBasicMaterial color="#dfdfdf" transparent opacity={0.35} />
      </mesh>
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 3]} intensity={1.15} />
      <directionalLight position={[-3, 2, 1]} intensity={0.4} />
    </group>
  );
}

/* --------------------------------------------------------------- voxels -- */

function Voxels({ cells, gate }: { cells: Cell[]; gate: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    // Constructed here, not via useMemo: the compiler's purity rule treats a
    // useMemo-returned object as immutable, and this dummy is mutated below.
    const dummy = new THREE.Object3D();
    const maxCount = cells.reduce((m, c) => Math.max(m, c.count), 0.0001);
    for (let i = 0; i < CAPACITY; i++) {
      const cell = cells[i];
      if (!cell) {
        dummy.position.set(0, -999, 0);
        dummy.scale.setScalar(0.0001);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, new THREE.Color(0, 0, 0));
        continue;
      }
      const scale = Math.max(0.02, CELL * Math.cbrt(cell.count / maxCount));
      dummy.position.set(cell.x, cell.y, cell.z);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      const gated = cell.satRing >= 0 && cell.satRing < gate;
      const col = gated ? new THREE.Color(0.42, 0.42, 0.42) : new THREE.Color(...cell.color);
      mesh.setColorAt(i, col);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [cells, gate]);

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.18;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, CAPACITY]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.4} metalness={0.05} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Scene({ cells, gate }: { cells: Cell[]; gate: number }) {
  return (
    <>
      <Room />
      <Voxels cells={cells} gate={gate} />
    </>
  );
}

/* ------------------------------------------------------------------- UI -- */

const PHOTOGRAPHED_CARS = CARS.filter((c) => c.hasPhotos);

export function ColourSolid({
  labels,
}: {
  labels: {
    carLabel: string;
    positionLabel: string;
    caliperLabel: string;
    /** Contains "{pct}". */
    caliperReadout: string;
    legendCore: string;
    legendChroma: string;
  };
}) {
  const [carId, setCarId] = useState<CarId>(PHOTOGRAPHED_CARS[0].id);
  const [pos, setPos] = useState(0);
  const [gate, setGate] = useState(0);
  const [ready, setReady] = useState<boolean | null>(null);
  const { lost, bind } = useWebglHealth();

  useEffect(() => {
    // A capability probe cannot be lifted out of an effect: a lazy useState
    // initialiser reading `document` would disagree with the server's HTML.
    try {
      const c = document.createElement("canvas");
      const ctx = c.getContext("webgl2") || c.getContext("webgl");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReady(!!ctx);
    } catch {
      setReady(false);
    }
  }, []);

  const carKey = HISTOGRAM_KEY[carId];
  const cells = useMemo(() => (carKey ? cellsForPosition(carKey, pos) : []), [carKey, pos]);
  const total = cells.reduce((s, c) => s + c.count, 0);
  const surviving = cells.filter((c) => c.satRing < 0 || c.satRing >= gate).reduce((s, c) => s + c.count, 0);
  const pct = total > 0 ? (surviving / total) * 100 : 0;

  const car = CARS.find((c) => c.id === carId)!;
  const posLabel = POSITIONS[pos];
  const { dir } = useLocale();
  const posText = dir === "rtl" ? posLabel.ar : posLabel.en;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="min-w-0">
        <div className="solid-host relative aspect-square w-full overflow-hidden rounded-sm bg-floor sm:aspect-[4/3]">
          {ready && !lost ? (
            <Canvas
              camera={{ position: [0, 1.1, 6.2], fov: 32 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true }}
              onCreated={({ gl }) => bind(gl.domElement)}
            >
              <Scene cells={cells} gate={gate} />
            </Canvas>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="label text-plate">{car.marque} {car.model}</p>
              <div className="flex w-full max-w-xs flex-col gap-1">
                {cells.slice(0, 10).map((c) => (
                  <div key={c.idx} className="h-2 rounded-sm" style={{ width: `${Math.max(8, c.count * 100)}%`, background: `rgb(${c.color.map((v) => Math.round(v * 255)).join(",")})` }} />
                ))}
              </div>
              <p className="fine text-plate/70">WebGL unavailable — static histogram shown.</p>
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-ink-soft">
          <p className="fine tnum">{labels.caliperReadout.replace("{pct}", pct.toFixed(1))}</p>
          <div className="flex items-center gap-2">
            <span className="chip">{labels.legendCore}</span>
            <span className="chip">{labels.legendChroma}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <p className="label mb-2">{labels.carLabel}</p>
          <div className="flex flex-wrap gap-1.5">
            {PHOTOGRAPHED_CARS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCarId(c.id)}
                className={`hard-cut rounded-sm border px-2.5 py-1 text-left text-[0.68rem] font-display uppercase tracking-tight ${
                  carId === c.id ? "border-ink bg-ink text-plate" : "border-rule/60 text-ink-soft"
                }`}
              >
                {c.marque} {c.model.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="label mb-2 tnum">
            {labels.positionLabel} — {String(pos).padStart(2, "0")}/10 ·{" "}
            {dir === "rtl" ? <span className="chip-loc">{posText}</span> : <span className="latin">{posText}</span>}
          </p>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            className="hard-cut w-full accent-ink"
            aria-valuetext={posText}
          />
        </div>

        <div>
          <p className="label mb-2">{labels.caliperLabel}</p>
          <input
            type="range"
            min={0}
            max={SAT_N}
            step={1}
            value={gate}
            onChange={(e) => setGate(Number(e.target.value))}
            className="w-full accent-ink"
            aria-valuetext={`${gate}/${SAT_N}`}
          />
        </div>
      </div>
    </div>
  );
}
