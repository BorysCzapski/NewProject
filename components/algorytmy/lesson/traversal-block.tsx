"use client";

// ============================================================================
// components/algorytmy/lesson/traversal-block.tsx
// Steps through BFS or DFS on the authored graph, drawn as inline SVG.
//
// Both traversals share ONE implementation here, differing only in which end
// of the pending list the next vertex is taken from — a queue for BFS, a stack
// for DFS. That is not a shortcut: it is the point the lesson makes, and
// writing it as two separate functions would hide the very symmetry the block
// exists to show.
// ============================================================================
import { useMemo } from "react";
import { Stepper, type Frame } from "@/components/algorytmy/lesson/stepper";
import type { AlgoGraphEdge, AlgoGraphNode, AlgoTraversalAlgorithm } from "@/lib/algorytmy/lesson-blocks";
import { cn } from "@/lib/utils";

interface TraversalState {
  visited: string[];
  pending: string[];
  current: string | null;
}

function run(
  nodes: AlgoGraphNode[],
  edges: AlgoGraphEdge[],
  startId: string,
  algorithm: AlgoTraversalAlgorithm
): Frame<TraversalState>[] {
  // Undirected adjacency, neighbours in authored order so the trace is stable.
  const neighbours = new Map<string, string[]>(nodes.map((n) => [n.id, []]));
  for (const edge of edges) {
    neighbours.get(edge.from)?.push(edge.to);
    neighbours.get(edge.to)?.push(edge.from);
  }

  const label = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;
  const containerName = algorithm === "bfs" ? "kolejce" : "na stosie";

  const frames: Frame<TraversalState>[] = [];
  const visited: string[] = [];
  const pending: string[] = [startId];
  const queued = new Set<string>([startId]);

  frames.push({
    state: { visited: [], pending: [...pending], current: null },
    note: `Start w ${label(startId)}. Wierzchołki do odwiedzenia trzymamy w ${containerName}.`,
  });

  while (pending.length > 0) {
    // The one line that separates the two algorithms.
    const current = algorithm === "bfs" ? pending.shift()! : pending.pop()!;
    visited.push(current);
    frames.push({
      state: { visited: [...visited], pending: [...pending], current },
      note: `Odwiedzamy ${label(current)}.`,
    });

    const fresh = (neighbours.get(current) ?? []).filter((id) => !queued.has(id));
    for (const id of fresh) {
      queued.add(id);
      pending.push(id);
    }
    if (fresh.length > 0) {
      frames.push({
        state: { visited: [...visited], pending: [...pending], current },
        note: `Dokładamy sąsiadów: ${fresh.map(label).join(", ")}.`,
      });
    }
  }

  frames.push({
    state: { visited: [...visited], pending: [], current: null },
    note: `Koniec. Kolejność odwiedzin: ${visited.map(label).join(" → ")}.`,
  });
  return frames;
}

export function TraversalBlock({
  title,
  algorithm,
  nodes,
  edges,
  startId,
  caption,
}: {
  title: string;
  algorithm: AlgoTraversalAlgorithm;
  nodes: AlgoGraphNode[];
  edges: AlgoGraphEdge[];
  startId: string;
  caption?: string;
}) {
  const frames = useMemo(
    () => run(nodes, edges, startId, algorithm),
    [nodes, edges, startId, algorithm]
  );
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <Stepper
      title={title}
      frames={frames}
      caption={caption}
      render={(state) => (
        <div className="flex flex-col gap-2">
          <svg viewBox="0 0 100 100" className="h-40 w-full" role="img" aria-label="Graf">
            {edges.map((edge, i) => {
              const from = byId.get(edge.from);
              const to = byId.get(edge.to);
              if (!from || !to) return null;
              const traversed =
                state.visited.includes(edge.from) && state.visited.includes(edge.to);
              return (
                <line
                  key={i}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  strokeWidth={traversed ? 1.2 : 0.7}
                  className={traversed ? "stroke-primary" : "stroke-border"}
                />
              );
            })}
            {nodes.map((node) => {
              const isCurrent = state.current === node.id;
              const isVisited = state.visited.includes(node.id);
              const isPending = state.pending.includes(node.id);
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={7}
                    className={cn(
                      "transition-colors",
                      isCurrent
                        ? "fill-accent"
                        : isVisited
                          ? "fill-primary"
                          : isPending
                            ? "fill-warning"
                            : "fill-surface-muted"
                    )}
                  />
                  <text
                    x={node.x}
                    y={node.y + 2.4}
                    textAnchor="middle"
                    className={cn(
                      "text-[6px] font-bold",
                      isCurrent || isVisited ? "fill-white" : "fill-foreground"
                    )}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="text-foreground-muted">
              Odwiedzone:{" "}
              <span className="font-medium text-foreground">
                {state.visited.map((id) => byId.get(id)?.label ?? id).join(", ") || "—"}
              </span>
            </span>
            <span className="text-foreground-muted">
              {algorithm === "bfs" ? "W kolejce" : "Na stosie"}:{" "}
              <span className="font-medium text-foreground">
                {state.pending.map((id) => byId.get(id)?.label ?? id).join(", ") || "—"}
              </span>
            </span>
          </div>
        </div>
      )}
    />
  );
}
