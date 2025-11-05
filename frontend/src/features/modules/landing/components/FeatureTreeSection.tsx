import { useMemo, useRef } from "react";
import type { FeatureNode } from "@/infrastructure/shared/data/landing";
import { computeTreeLayout } from "@/infrastructure/shared/vendor/treejs";
import { useFeatureTreeAnimation } from "../hooks/useFeatureTreeAnimation";

interface FeatureTreeSectionProps {
  tree: FeatureNode;
}

export const FeatureTreeSection = ({ tree }: FeatureTreeSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  useFeatureTreeAnimation(sectionRef);

  const { nodes, links, width, height } = useMemo(() => {
    const layout = computeTreeLayout(tree, { levelGap: 160, nodeGap: 220 });
    const maxX = Math.max(...layout.nodes.map((node) => node.x));
    const maxY = Math.max(...layout.nodes.map((node) => node.y));

    return {
      nodes: layout.nodes,
      links: layout.links,
      width: maxX + 240,
      height: maxY + 200,
    };
  }, [tree]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative z-0 mt-24 rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#0f172a] to-[#050b1a] px-4 py-24 text-white shadow-xl"
    >
      <div className="mx-auto max-w-5xl text-center">
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-blue-200">
          عرض تفصيلي
        </span>
        <h2 className="mt-6 text-3xl font-bold md:text-4xl">
          خريطة وظائف المنصة
        </h2>
        <p className="mt-4 text-base text-white/70 md:text-lg">
          تصور شجري يجمع مراحل التخطيط، إدارة المتطوعين، العمليات، والتحليلات في
          مخطط واحد يساعد فرقك على فهم الترابط.
        </p>
      </div>

      <div className="relative mx-auto mt-16 flex max-w-5xl justify-center overflow-x-auto rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        <svg
          role="presentation"
          className="h-[520px] w-full min-w-[720px]"
          viewBox={`0 0 ${width} ${height}`}
        >
          {links.map((link) => {
            const from = nodes.find((node) => node.id === link.from);
            const to = nodes.find((node) => node.id === link.to);

            if (!from || !to) return null;

            const midY = (from.y + to.y) / 2;

            return (
              <path
                key={`${link.from}-${link.to}`}
                data-tree-link
                d={`M${from.x + 120},${from.y + 60} C${from.x + 120},${midY} ${to.x + 120},${midY} ${to.x + 120},${to.y}`}
                stroke="url(#treeGradient)"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={260}
              />
            );
          })}

          <defs>
            <linearGradient
              id="treeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>

          {nodes.map((node) => (
            <g
              key={node.id}
              transform={`translate(${node.x + 120}, ${node.y})`}
              data-tree-node
            >
              <rect
                width={220}
                height={120}
                rx={28}
                fill="rgba(255,255,255,0.08)"
                stroke="rgba(255,255,255,0.18)"
              />
              <text
                x={110}
                y={65}
                textAnchor="middle"
                fontSize={18}
                fontWeight={600}
                letterSpacing="0.05em"
                fill="#f8fafc"
              >
                {node.title}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
};
