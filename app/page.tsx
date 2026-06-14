"use client";

/* eslint-disable @next/next/no-img-element */
import { CSSProperties, PointerEvent, useEffect, useMemo, useRef, useState } from "react";

type PhaseId = "hero" | "planning" | "prepare" | "build" | "complete" | "future";

type ModalState =
  | {
      kind: "archive";
      title: string;
      meta: string;
      body: string;
      accent: "cyan" | "orange" | "red";
    }
  | {
      kind: "hotspot";
      title: string;
      body: string;
      stat: string;
      accent: "cyan" | "orange" | "green";
    }
  | null;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetUrl = (path: string) => `${basePath}${path}`;

const phases: { id: PhaseId; title: string; caption: string }[] = [
  { id: "hero", title: "卷首", caption: "从零启航" },
  { id: "planning", title: "立项", caption: "谋篇布局" },
  { id: "prepare", title: "筹备", caption: "厉兵秣马" },
  { id: "build", title: "建设", caption: "匠心筑梦" },
  { id: "complete", title: "交付", caption: "完美收官" },
  { id: "future", title: "生态", caption: "数智生态" },
];

const archiveCards = [
  {
    title: "立项批复",
    code: "ARCH-2021-0318",
    tag: "红头文件",
    metric: "投资额 XXXX 亿元",
    body: "项目纳入XXXX重点工程，定位为区域智能研发、数据运营与产业孵化综合载体。",
    accent: "orange" as const,
  },
  {
    title: "土地证书",
    code: "LAND-2021-0626",
    tag: "用地档案",
    metric: "建设用地 XXXX 亩",
    body: "园区用地边界、地下管线保护线与周边交通组织在规划阶段一次性校核完成。",
    accent: "cyan" as const,
  },
  {
    title: "规划总图",
    code: "PLAN-2021-0915",
    tag: "蓝图审定",
    metric: "总建面 XXX 万 m2",
    body: "研发楼、数据中心、能源站、景观轴线和地下连廊形成一体化智慧园区骨架。",
    accent: "cyan" as const,
  },
];

const partnerNodes = [
  { name: "总体设计", x: 22, y: 22, color: "#00f0ff" },
  { name: "施工总包", x: 77, y: 28, color: "#ff6b00" },
  { name: "智慧弱电", x: 83, y: 70, color: "#00f0ff" },
  { name: "监理单位", x: 18, y: 73, color: "#ff6b00" },
  { name: "绿建顾问", x: 51, y: 12, color: "#71f5a1" },
  { name: "检测中心", x: 49, y: 86, color: "#8ed8ff" },
];

const buildStages = [
  { date: "2021.11.08", label: "基坑开挖", days: 86, concrete: 12800, steel: 1800 },
  { date: "2022.04.26", label: "地下结构封底", days: 255, concrete: 49600, steel: 7200 },
  { date: "2022.12.18", label: "主体结构爬升", days: 491, concrete: 112000, steel: 18200 },
  { date: "2023.08.30", label: "塔楼全面封顶", days: 746, concrete: 168000, steel: 27400 },
  { date: "2024.05.16", label: "机电联调", days: 1006, concrete: 191000, steel: 31800 },
  { date: "2024.11.28", label: "竣工移交", days: 1202, concrete: 208000, steel: 34600 },
];

const honorDocs = [
  "竣工备案表",
  "消防验收意见书",
  "节能专项验收",
  "规划核实证明",
  "质检综合报告",
  "人防验收记录",
  "智能化联调纪要",
  "绿建二星证书",
  "档案移交清册",
  "数据中心测评",
];

const hotspots = [
  {
    title: "IOC 智慧大脑",
    body: "楼顶 5G 微站、视频物联、能耗监测与运维工单汇入统一 IOC，形成园区态势一张图。",
    stat: "9,600+ 物联点位",
    accent: "cyan" as const,
    left: "63%",
    top: "24%",
  },
  {
    title: "T3+ 数据中心",
    body: "核心机房采用双路市电、模块化 UPS 与冷通道封闭方案，支撑研发算力与业务连续性。",
    stat: "PUE 1.32",
    accent: "orange" as const,
    left: "36%",
    top: "55%",
  },
  {
    title: "低碳景观轴",
    body: "海绵园区、屋顶光伏、雨水回收与夜间低眩光照明共同构成低碳运行底座。",
    stat: "年减碳 1,860 吨",
    accent: "green" as const,
    left: "50%",
    top: "75%",
  },
];

const credits = [
  "建设单位项目管理部",
  "总包工程指挥部",
  "设计院建筑与机电联合团队",
  "监理驻场办公室",
  "档案编研工作组",
  "BIM 与智慧运维专项组",
  "安全文明施工班组",
  "幕墙与钢结构施工团队",
  "机电安装与调试团队",
  "园区每一位建设者",
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}

function CustomCursor() {
  const [cursor, setCursor] = useState({ x: -100, y: -100, view: false });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      setCursor({
        x: event.clientX,
        y: event.clientY,
        view: Boolean(target?.closest("[data-cursor='view']")),
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className={`cursor-ring ${cursor.view ? "is-view" : ""}`}
      style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}
    >
      {cursor.view ? "View" : ""}
    </div>
  );
}

function LoadingVeil() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1450);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-veil ${ready ? "is-ready" : ""}`} aria-hidden="true">
      <div className="loader-grid">
        {Array.from({ length: 84 }).map((_, index) => (
          <span key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>
      <div className="loader-building">
        <span />
        <span />
        <span />
        <span />
      </div>
      <p>ARCHIVE STREAM INITIALIZING</p>
    </div>
  );
}

function Timeline({ active, progress }: { active: PhaseId; progress: number }) {
  return (
    <aside className="timeline-rail" aria-label="建设阶段导航">
      <div className="timeline-fiber">
        <span className="timeline-glow" style={{ height: `${progress * 100}%` }} />
        <span className="timeline-orb" style={{ top: `${progress * 100}%` }} />
      </div>
      <nav>
        {phases.map((phase) => (
          <button
            key={phase.id}
            className={active === phase.id ? "active" : ""}
            data-cursor="view"
            onClick={() => document.getElementById(phase.id)?.scrollIntoView({ behavior: "smooth" })}
          >
            <span>{phase.title}</span>
            <strong>{phase.caption}</strong>
          </button>
        ))}
      </nav>
    </aside>
  );
}

function Hero({ progress }: { progress: number }) {
  const heroScale = 1 + clamp(progress * 7, 0, 0.22);
  const heroOpacity = 1 - clamp(progress * 6, 0, 0.95);

  return (
    <section id="hero" className="hero-section section-observe" data-phase="hero">
      <div
        className="hero-media"
        style={{
          transform: `scale(${1 + clamp(progress * 4, 0, 0.08)})`,
          backgroundPositionY: `${48 + progress * 20}%`,
        }}
      />
      <div className="hero-scanline" />
      <div className="hero-content" style={{ transform: `scale(${heroScale})`, opacity: heroOpacity }}>
        <p className="kicker">仙林所区建设档案编研</p>
        <h1>从零启航</h1>
        <p className="hero-subtitle">从图纸到现实，记录新所区诞生的XX个月。</p>
      </div>
      <div className="hero-metrics" aria-label="项目关键数据">
        <span>
          <strong>XX</strong>万 m2
        </span>
        <span>
          <strong>1202</strong>天安全生产无事故
        </span>
        <span>
          <strong>9,600+</strong>物联点
        </span>
      </div>
      <div className="scroll-cue">Scroll Down</div>
    </section>
  );
}

function ArchiveCard({
  card,
  onOpen,
}: {
  card: (typeof archiveCards)[number];
  onOpen: (card: (typeof archiveCards)[number]) => void;
}) {
  return (
    <article className={`archive-card accent-${card.accent}`} data-cursor="view">
      <div className="archive-card-inner">
        <div className="archive-front">
          <span>{card.tag}</span>
          <h3>{card.title}</h3>
          <p>{card.code}</p>
          <div className="archive-seal">归档</div>
        </div>
        <div className="archive-back">
          <span>核心提要</span>
          <strong>{card.metric}</strong>
          <p>{card.body}</p>
          <button onClick={() => onOpen(card)}>查看原件</button>
        </div>
      </div>
    </article>
  );
}

function PlanningModel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef({ x: -0.7, y: 0.7 });
  const dragRef = useRef({ active: false, x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", { alpha: true, antialias: true });
    if (!canvas || !gl) return;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    gl.shaderSource(
      vertexShader,
      `
        attribute vec3 position;
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
    );
    gl.shaderSource(
      fragmentShader,
      `
        precision mediump float;
        uniform vec4 color;
        void main() {
          gl_FragColor = color;
        }
      `,
    );
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const position = gl.getAttribLocation(program, "position");
    const colorLocation = gl.getUniformLocation(program, "color");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

    const cubeLines = (cx: number, cy: number, cz: number, sx: number, sy: number, sz: number) => {
      const x = sx / 2;
      const y = sy / 2;
      const z = sz / 2;
      const points = [
        [-x, -y, -z],
        [x, -y, -z],
        [x, y, -z],
        [-x, y, -z],
        [-x, -y, z],
        [x, -y, z],
        [x, y, z],
        [-x, y, z],
      ].map(([px, py, pz]) => [px + cx, py + cy, pz + cz]);
      const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
      ];
      return edges.flatMap(([a, b]) => [...points[a], ...points[b]]);
    };

    const grid: number[] = [
      -4.6, -0.02, -3.2, 4.6, -0.02, -3.2,
      4.6, -0.02, -3.2, 4.6, -0.02, 3.2,
      4.6, -0.02, 3.2, -4.6, -0.02, 3.2,
      -4.6, -0.02, 3.2, -4.6, -0.02, -3.2,
      -3.8, -0.02, 0, 3.8, -0.02, 0,
      0, -0.02, -2.8, 0, -0.02, 2.8,
      -2.9, -0.02, 1.9, 2.9, -0.02, -1.9,
    ];
    const buildings = [
      cubeLines(-2.4, 0.45, -1.4, 1.2, 0.95, 1.8),
      cubeLines(-0.7, 0.75, -0.9, 1.15, 1.55, 1.2),
      cubeLines(1.05, 0.55, -1.1, 1.6, 1.15, 1.55),
      cubeLines(2.7, 0.35, 0.8, 1.25, 0.75, 1.4),
      cubeLines(-1.5, 0.32, 1.55, 1.9, 0.7, 1.05),
      cubeLines(0.7, 0.42, 1.25, 1.2, 0.9, 1.0),
    ].flat();
    const sourceVertices = new Float32Array([...grid, ...buildings]);
    const projectedVertices = new Float32Array(sourceVertices.length);
    const gridCount = grid.length / 3;

    const project = (width: number, height: number) => {
      const aspect = width / height;
      const rx = rotationRef.current.x;
      const ry = rotationRef.current.y;
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);

      for (let i = 0; i < sourceVertices.length; i += 3) {
        const x = sourceVertices[i];
        const y = sourceVertices[i + 1];
        const z = sourceVertices[i + 2];
        const y1 = y * cx - z * sx;
        const z1 = y * sx + z * cx;
        const x2 = x * cy + z1 * sy;
        const scale = 0.23;
        projectedVertices[i] = (x2 * scale) / aspect;
        projectedVertices[i + 1] = y1 * scale - 0.08;
        projectedVertices[i + 2] = 0;
      }
      return projectedVertices;
    };

    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      const dpr = window.devicePixelRatio || 1;
      const width = Math.floor(canvas.clientWidth * dpr);
      const height = Math.floor(canvas.clientHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      if (!dragRef.current.active) {
        rotationRef.current.y += 0.0025;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const vertices = project(width, height);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      gl.uniform4f(colorLocation, 0.24, 0.45, 0.66, 0.38);
      gl.lineWidth(1);
      gl.drawArrays(gl.LINES, 0, gridCount);
      gl.uniform4f(colorLocation, 0.08, 0.22, 0.36, 0.82);
      gl.drawArrays(gl.LINES, gridCount, sourceVertices.length / 3 - gridCount);
    };
    render();
    return () => cancelAnimationFrame(frame);
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = { active: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    rotationRef.current.y += dx * 0.008;
    rotationRef.current.x = clamp(rotationRef.current.x + dy * 0.006, -1.15, -0.15);
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
  };
  const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    dragRef.current.active = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div className="planning-model" data-cursor="view">
      <canvas ref={canvasRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} />
      <div className="model-hud">
        <span>EARLY MASSING</span>
        <strong>仙林所区 沙盘白模</strong>
      </div>
    </div>
  );
}

function Planning({ onOpen }: { onOpen: (card: (typeof archiveCards)[number]) => void }) {
  return (
    <section id="planning" className="section planning-section section-observe" data-phase="planning">
      <div className="section-heading">
        <span>第一篇章</span>
        <h2>谋篇布局</h2>
        <p>批复、用地、总图在蓝图网格中浮现，早期规划白模同步建立园区的第一层秩序。</p>
      </div>
      <div className="planning-grid">
        <div className="archive-stack">
          {archiveCards.map((card) => (
            <ArchiveCard key={card.title} card={card} onOpen={onOpen} />
          ))}
        </div>
        <PlanningModel />
      </div>
    </section>
  );
}

function PartnerGraph() {
  return (
    <div className="partner-graph" aria-label="筹备单位动态图谱">
      <svg viewBox="0 0 100 100" role="img">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {partnerNodes.map((node) => (
          <line key={node.name} x1="50" y1="50" x2={node.x} y2={node.y} stroke={node.color} strokeWidth="0.5" filter="url(#glow)" />
        ))}
        <circle cx="50" cy="50" r="10" className="graph-core" />
        <text x="50" y="49" textAnchor="middle">
          仙林园区
        </text>
        <text x="50" y="55" textAnchor="middle" className="graph-small">
          建设指挥部
        </text>
        {partnerNodes.map((node) => (
          <g key={node.name}>
            <circle cx={node.x} cy={node.y} r="5" fill="rgba(10,17,40,.92)" stroke={node.color} strokeWidth="0.9" />
            <text x={node.x} y={node.y + 10} textAnchor="middle">
              {node.name}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Prepare() {
  const stampRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = stampRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("stamp-hit");
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="prepare" className="section prepare-section section-observe" data-phase="prepare">
      <div className="section-heading">
        <span>第二篇章</span>
        <h2>厉兵秣马</h2>
        <p>招采、许可、监理与专项顾问在同一张协同网络上完成链接，项目正式进入战备状态。</p>
      </div>
      <div className="prepare-layout">
        <PartnerGraph />
        <div className="permit-stage" ref={stampRef}>
          <div className="permit-document">
            <span>施工许可证</span>
            <h3>合规开工节点确认</h3>
            <dl>
              <div>
                <dt>许可编号</dt>
                <dd>CON-2021-1108</dd>
              </div>
              <div>
                <dt>合同标段</dt>
                <dd>总承包一标段</dd>
              </div>
              <div>
                <dt>开工条件</dt>
                <dd>七项核验完成</dd>
              </div>
            </dl>
            <div className="red-stamp">准予施工</div>
            <div className="stamp-wave" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelapseCanvas({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, `rgba(${224 + progress * 18}, ${233 + progress * 12}, ${239 + progress * 8}, 1)`);
    sky.addColorStop(1, `rgba(${199 + progress * 26}, ${216 + progress * 19}, ${228 + progress * 12}, 1)`);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(176, 83, 49, 0.18)";
    ctx.beginPath();
    ctx.arc(w * (0.18 + progress * 0.58), h * 0.18, 58, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(74, 111, 143, 0.24)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 18; i += 1) {
      const y = h * 0.66 + i * 18;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y - i * 3);
      ctx.stroke();
    }

    ctx.fillStyle = "#d5c9b8";
    ctx.fillRect(0, h * 0.72, w, h * 0.28);

    const pit = clamp(progress * 3.2);
    ctx.fillStyle = `rgba(118, 93, 70, ${0.72 - progress * 0.28})`;
    ctx.fillRect(w * 0.12, h * 0.68, w * 0.72, 42 * pit);
    ctx.strokeStyle = "rgba(153, 73, 44, 0.58)";
    ctx.strokeRect(w * 0.12, h * 0.68, w * 0.72, 42);

    const structure = clamp((progress - 0.18) / 0.55);
    const floors = Math.floor(2 + structure * 13);
    const baseX = w * 0.23;
    const baseY = h * 0.7;
    const bw = w * 0.46;
    const floorH = h * 0.034;
    ctx.strokeStyle = "rgba(25, 61, 91, 0.72)";
    ctx.lineWidth = 2;
    for (let floor = 0; floor < floors; floor += 1) {
      const y = baseY - floor * floorH;
      ctx.beginPath();
      ctx.moveTo(baseX, y);
      ctx.lineTo(baseX + bw, y - floor * 5);
      ctx.stroke();
      for (let col = 0; col <= 7; col += 1) {
        const x = baseX + (bw / 7) * col;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - floorH);
        ctx.stroke();
      }
    }

    const facade = clamp((progress - 0.62) / 0.24);
    ctx.fillStyle = `rgba(68, 116, 154, ${0.1 + facade * 0.18})`;
    ctx.fillRect(baseX, baseY - floors * floorH + 8, bw, floors * floorH - 8);
    ctx.strokeStyle = `rgba(25, 61, 91, ${facade * 0.58})`;
    for (let i = 0; i < 20; i += 1) {
      ctx.beginPath();
      ctx.moveTo(baseX + i * (bw / 20), baseY - floors * floorH + 8);
      ctx.lineTo(baseX + i * (bw / 20), baseY);
      ctx.stroke();
    }

    const crane = clamp((0.75 - progress) / 0.75);
    ctx.strokeStyle = `rgba(153, 73, 44, ${0.78 * crane})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.73, h * 0.7);
    ctx.lineTo(w * 0.73, h * 0.23);
    ctx.moveTo(w * 0.61, h * 0.25);
    ctx.lineTo(w * 0.91, h * 0.25);
    ctx.moveTo(w * 0.73, h * 0.23);
    ctx.lineTo(w * 0.84, h * 0.35);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,.76)";
    for (let i = 0; i < 42; i += 1) {
      const x = (i * 73) % w;
      const y = (i * 41) % h;
      const alpha = clamp(progress * 2 - (i % 4) * 0.18);
      ctx.fillStyle = `rgba(40, 84, 118, ${alpha * 0.34})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }, [progress]);

  return <canvas ref={canvasRef} className="timelapse-canvas" aria-label="滚动绑定施工延时影像" />;
}

function BuildChronicle() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [local, setLocal] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        const distance = rect.height - window.innerHeight;
        setLocal(distance > 0 ? clamp(-rect.top / distance) : 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const stageIndex = Math.min(buildStages.length - 1, Math.floor(local * buildStages.length));
  const current = buildStages[stageIndex];
  const horizontal = -(local * 55);

  return (
    <section id="build" ref={sectionRef} className="build-section section-observe" data-phase="build">
      <div className="build-sticky">
        <div className="build-dawn" style={{ opacity: local }} />
        <div className="build-copy">
          <span>第三篇章</span>
          <h2>匠心筑梦</h2>
          <time>{current.date}</time>
          <strong>{current.label}</strong>
          <div className="stage-progress">
            <span style={{ width: `${local * 100}%` }} />
          </div>
          <div className="build-counters">
            <Counter label="安全生产天数" value={current.days} suffix="天" />
            <Counter label="浇筑混凝土" value={current.concrete} suffix="吨" />
            <Counter label="钢结构吊装" value={current.steel} suffix="吨" />
          </div>
        </div>
        <div className="build-screen">
          <TimelapseCanvas progress={local} />
          <div className="screen-overlay">
            <span>TIME-LAPSE STREAM</span>
            <b>{Math.round(local * 100)}%</b>
          </div>
        </div>
        <div className="horizontal-archive" style={{ transform: `translateX(${horizontal}vw)` }}>
          {buildStages.map((stage) => (
            <article key={stage.date}>
              <span>{stage.date}</span>
              <strong>{stage.label}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const formatted = useMemo(() => value.toLocaleString("zh-CN"), [value]);
  return (
    <div>
      <span>{label}</span>
      <strong>
        {formatted}
        <em>{suffix}</em>
      </strong>
    </div>
  );
}

function BeforeAfterSlider() {
  const [split, setSplit] = useState(50);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const update = (clientX: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSplit(clamp((clientX - rect.left) / rect.width, 0.05, 0.95) * 100);
  };

  return (
    <div
      ref={wrapRef}
      className="before-after"
      data-cursor="view"
      onPointerDown={(event) => {
        update(event.clientX);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (event.buttons === 1) update(event.clientX);
      }}
    >
      <img className="ba-image" src={assetUrl("/assets/campus-hero.png")} alt="竣工后的智慧研发园区航拍实景" />
      <div className="before-layer" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        <img className="ba-image" src={assetUrl("/assets/campus-construction.png")} alt="建设早期的园区施工现场" />
      </div>
      <div className="ba-handle" style={{ left: `${split}%` }}>
        <span />
      </div>
      <div className="ba-labels">
        <span>开工</span>
        <span>竣工</span>
      </div>
    </div>
  );
}

function Completion({ onDocOpen }: { onDocOpen: (title: string) => void }) {
  return (
    <section id="complete" className="section complete-section section-observe" data-phase="complete">
      <div className="section-heading light">
        <span>第四篇章</span>
        <h2>完美收官</h2>
        <p>同一片土地在滑动之间完成转换，验收档案如片尾胶片般缓慢经过。</p>
      </div>
      <div className="complete-layout">
        <BeforeAfterSlider />
        <div className="honor-wall">
          <div className="honor-track">
            {[...honorDocs, ...honorDocs].map((doc, index) => (
              <button key={`${doc}-${index}`} data-cursor="view" onClick={() => onDocOpen(doc)}>
                <span>ARCHIVE</span>
                <strong>{doc}</strong>
                <em>{String(index + 1).padStart(2, "0")}</em>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Future({ onOpen }: { onOpen: (hotspot: (typeof hotspots)[number]) => void }) {
  return (
    <section id="future" className="future-section section-observe" data-phase="future">
      <div className="future-bg" />
      <div className="section-heading">
        <span>第五篇章</span>
        <h2>数智生态</h2>
        <p>开园后的建筑不再只是空间，而是持续感知、计算、反馈的研发生态系统。</p>
      </div>
      <div className="hotspot-map">
        <img className="map-image" src={assetUrl("/assets/campus-hero.png")} alt="智慧研发园区数智生态总览" />
        {hotspots.map((spot) => (
          <button
            key={spot.title}
            className={`hotspot ${spot.accent}`}
            style={{ left: spot.left, top: spot.top }}
            data-cursor="view"
            onClick={() => onOpen(spot)}
          >
            <span />
            <strong>{spot.title}</strong>
          </button>
        ))}
      </div>
      <div className="credits" aria-label="建设者名单">
        <div>
          {credits.map((name) => (
            <p key={name}>{name}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function DetailModal({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  if (!modal) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`detail-modal ${modal.accent}`} onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="关闭">
          x
        </button>
        <span>{modal.kind === "archive" ? "ARCHIVE VIEWER" : "SYSTEM LAYER"}</span>
        <h3>{modal.title}</h3>
        {"meta" in modal ? <strong>{modal.meta}</strong> : <strong>{modal.stat}</strong>}
        <p>{modal.body}</p>
        <div className="modal-facsimile">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const progress = useScrollProgress();
  const [active, setActive] = useState<PhaseId>("hero");
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".section-observe"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const phase = visible?.target.getAttribute("data-phase") as PhaseId | null;
        if (phase) setActive(phase);
      },
      { threshold: [0.22, 0.45, 0.7] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main
      className="site-shell"
      style={
        {
          "--campus-hero": `url(${assetUrl("/assets/campus-hero.png")})`,
        } as CSSProperties
      }
    >
      <LoadingVeil />
      <CustomCursor />
      <Timeline active={active} progress={progress} />
      <Hero progress={progress} />
      <Planning
        onOpen={(card) =>
          setModal({
            kind: "archive",
            title: card.title,
            meta: `${card.code} / ${card.metric}`,
            body: card.body,
            accent: card.accent,
          })
        }
      />
      <Prepare />
      <BuildChronicle />
      <Completion
        onDocOpen={(title) =>
          setModal({
            kind: "archive",
            title,
            meta: "竣工验收档案影印件",
            body: "该档案记录了验收意见、签章流转、整改闭环与移交节点，是园区交付证据链的重要组成。",
            accent: "red",
          })
        }
      />
      <Future
        onOpen={(hotspot) =>
          setModal({
            kind: "hotspot",
            title: hotspot.title,
            body: hotspot.body,
            stat: hotspot.stat,
            accent: hotspot.accent,
          })
        }
      />
      <DetailModal modal={modal} onClose={() => setModal(null)} />
    </main>
  );
}
