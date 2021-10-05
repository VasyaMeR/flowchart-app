import jsPDF from "jspdf";

const drawRectangle = (
  doc: jsPDF,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  let lines = [
    { op: "m", c: [x1, y1] },
    { op: "l", c: [x1, y2] },
    { op: "l", c: [x2, y2] },
    { op: "l", c: [x2, y1] },
    { op: "h" },
  ];

  doc.path(lines);
  doc.stroke();
};

export default drawRectangle;
