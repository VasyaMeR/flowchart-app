import jsPDF from "jspdf";

const ANGLE = (60 / 180) * Math.PI;

const drawParallelogram = (
  doc: jsPDF,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  let h = y2 - y1;
  let x = h / Math.tan(ANGLE);
  let lines = [
    { op: "m", c: [x1, y1] },
    { op: "l", c: [x1 - x, y2] },
    { op: "l", c: [x2, y2] },
    { op: "l", c: [x2 + x, y1] },
    { op: "l", c: [x2, y1] },
    { op: "h" },
  ];

  doc.path(lines);
  doc.stroke();
};

export default drawParallelogram;
