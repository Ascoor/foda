export interface TreeNode {
  id: string;
  title: string;
  children?: TreeNode[];
}

export interface PositionedNode extends TreeNode {
  depth: number;
  x: number;
  y: number;
  parentId?: string;
}

export interface TreeLayout {
  nodes: PositionedNode[];
  links: Array<{ from: string; to: string }>;
}

export interface TreeLayoutOptions {
  levelGap?: number;
  nodeGap?: number;
}

interface LayoutState {
  nodes: PositionedNode[];
  links: Array<{ from: string; to: string }>;
  column: number;
  options: Required<TreeLayoutOptions>;
}

const defaultOptions: Required<TreeLayoutOptions> = {
  levelGap: 140,
  nodeGap: 200,
};

export const computeTreeLayout = (
  root: TreeNode,
  options: TreeLayoutOptions = {},
): TreeLayout => {
  const config: LayoutState = {
    nodes: [],
    links: [],
    column: 0,
    options: { ...defaultOptions, ...options },
  };

  const traverse = (
    node: TreeNode,
    depth: number,
  ): { min: number; max: number; center: number } => {
    if (!node.children || node.children.length === 0) {
      const position = config.column;
      config.column += 1;

      config.nodes.push({
        ...node,
        depth,
        x: position * config.options.nodeGap,
        y: depth * config.options.levelGap,
      });

      return { min: position, max: position, center: position };
    }

    const childPositions = node.children.map((child) => {
      const layout = traverse(child, depth + 1);
      config.links.push({ from: node.id, to: child.id });
      return layout;
    });

    const min = Math.min(...childPositions.map((p) => p.min));
    const max = Math.max(...childPositions.map((p) => p.max));
    const center = (min + max) / 2;

    config.nodes.push({
      ...node,
      depth,
      x: center * config.options.nodeGap,
      y: depth * config.options.levelGap,
    });

    return { min, max, center };
  };

  traverse(root, 0);

  const nodeById = new Map(config.nodes.map((node) => [node.id, node]));

  config.links = config.links.map((link) => {
    const parent = nodeById.get(link.from);
    const child = nodeById.get(link.to);

    if (child) {
      child.parentId = parent?.id;
    }

    return link;
  });

  // Normalize X positions so that the minimum column starts at zero.
  const minX = Math.min(...config.nodes.map((node) => node.x));
  if (minX !== 0) {
    config.nodes = config.nodes.map((node) => ({
      ...node,
      x: node.x - minX,
    }));
  }

  return {
    nodes: config.nodes,
    links: config.links,
  };
};
