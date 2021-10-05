import jsPDF from "jspdf";

const drawEllipse = (
  doc: jsPDF,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  let h = y2 - y1;
  let w = x2 - x1;

  doc.ellipse(x1 + w / 2, y1 + h / 2, w / 2, h / 2);
};

export default drawEllipse;
