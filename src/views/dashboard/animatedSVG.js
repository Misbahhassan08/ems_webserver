import React from "react";

function SecondAnimatedSVGEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data = {},
}) {
  let path = "";

  // Decide L path based on handle positions
  if (
    (sourcePosition === "right" && targetPosition === "left") ||
    (sourcePosition === "left" && targetPosition === "right")
  ) {
    // Horizontal then vertical
    const midX = (sourceX + targetX) /1;
    path = `M ${sourceX},${sourceY} L ${midX},${sourceY} L ${midX},${targetY} L ${targetX},${targetY}`;
  } else if (
    (sourcePosition === "bottom" && targetPosition === "top") ||
    (sourcePosition === "top" && targetPosition === "bottom")
  ) {
    // Vertical then horizontal
    const midY = (sourceY + targetY) / 1.5;
    path = `M ${sourceX},${sourceY} L ${sourceX},${midY} L ${targetX},${midY} L ${targetX},${targetY}`;
  } else {
    // Fallback straight line
    path = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  }

  return (
    <>
      {/* L-shaped edge path */}
      <path
        id={id}
        d={path}
        stroke="#3da58a"
        strokeWidth={2}
        fill="none"
      />

      {/* Optional animated circle */}
      {data.flow > 0 && (
        <circle r="5" fill="#3da58a">
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      )}
    </>
  );
}

export default SecondAnimatedSVGEdge;
