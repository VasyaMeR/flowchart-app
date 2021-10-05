import jsPDF from "jspdf";

const ARROW_ANGLE = (30 / 180) * Math.PI;

const drawArrow = (
  doc: jsPDF,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const ARROWHEAD_SIZE = 4;

  let angle = Math.atan2(x2 - x1, y2 - y1);
  let lines = [
    { op: "m", c: [x1, y1] },
    { op: "l", c: [x2, y2] },
    { op: "h" },
    {
      op: "m",
      c: [
        x2 + ARROWHEAD_SIZE * Math.sin(angle + (Math.PI - ARROW_ANGLE)),
        y2 + ARROWHEAD_SIZE * Math.cos(angle + (Math.PI - ARROW_ANGLE)),
      ],
    },
    { op: "l", c: [x2, y2] },
    {
      op: "l",
      c: [
        x2 + ARROWHEAD_SIZE * Math.sin(angle - (Math.PI - ARROW_ANGLE)),
        y2 + ARROWHEAD_SIZE * Math.cos(angle - (Math.PI - ARROW_ANGLE)),
      ],
    },
    { op: "m", c: [x2, y2] },
    { op: "h" },
  ];

  doc.path(lines);
  doc.stroke();
};

export default drawArrow;
