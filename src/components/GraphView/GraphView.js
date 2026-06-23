import {
  ForceGraph2D
} from "react-force-graph";

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

        graphData={
          graphData
        }

        nodeLabel="id"

        onNodeClick={
          onNodeClick
        }

      />

    </div>

  );

}