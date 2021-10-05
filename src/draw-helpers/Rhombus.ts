import jsPDF from "jspdf";

const drawRhombus = (
  doc: jsPDF,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  let h = y2 - y1;
  let w = x2 - x1;

  let lines = [
    { op: "m", c: [x1 + w / 2, y1] },
    { op: "l", c: [x1, y1 + h / 2] },
    { op: "l", c: [x1 + w / 2, y2] },
    { op: "l", c: [x2, y1 + h / 2] },
    { op: "l", c: [x1 + w / 2, y1] },
    { op: "h" },
  ];

  doc.path(lines);
  doc.stroke();
};

const ROMB_PADDING = 10;

export const calcRhombus = (doc: jsPDF, text: string) => {
  let textDimensions = doc.getTextDimensions(text);

  textDimensions.w += 2 * ROMB_PADDING;
  textDimensions.h += 2 * ROMB_PADDING;

  return [textDimensions.w, textDimensions.h];
};

export default drawRhombus;
