import jsPDF from "jspdf";

const drawText = (doc: jsPDF, x: number, y: number, text: string) => {
  doc.text(text, x, y);
};

export default drawText;
