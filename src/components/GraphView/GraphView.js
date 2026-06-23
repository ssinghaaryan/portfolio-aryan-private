import ForceGraph2D
  from "react-force-graph-2d";

export default function GraphView({
  graphData,
  onNodeClick
}) {

  return (

    <div
      style={{
        width: "100%",
        height: "100%"
      }}
    >

      <ForceGraph2D
      linkColor={() =>
  "rgba(255,255,255,.15)"}
  linkWidth={1.5}
  nodeVal={node =>
  node.connections || 1}
  cooldownTicks={100}
  d3VelocityDecay={0.25}
  enableNodeDrag={true}
  graphData={graphData}
  nodeLabel="id"
  onNodeClick={onNodeClick}

  nodeCanvasObject={(
    node,
    ctx,
    globalScale
  ) => {

    const label =
      node.id;

    const fontSize =
      12 / globalScale;

    ctx.beginPath();

    const radius =
  Math.max(
    4,
    4 + (node.connections || 0)
  );

ctx.arc(
  node.x,
  node.y,
  radius,
  0,
  2 * Math.PI
);

    if (node.connections >= 10) {

  ctx.fillStyle = "#ef4444";

} else if (node.connections >= 5) {

  ctx.fillStyle = "#f59e0b";

} else {

  ctx.fillStyle = "#7c3aed";

}

    ctx.fill();

    ctx.font =
      `${fontSize}px Sans-Serif`;

    ctx.fillStyle =
      "#ffffff";

    if (globalScale > 1.5) {

  ctx.fillText(
    label,
    node.x + radius + 4,
    node.y + 4
  );

}

  }}
/>

    </div>

  );

}