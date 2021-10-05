import Layout from "./Layout";
import jsPDF from "jspdf";
import drawArrow from "../draw-helpers/Arrow";
import { ARROW_LEN } from "./Constants";

class ArrowComponent extends Layout {
  offset: number;
  arrowHeight: number;

  constructor(offset: number = 0, arrowHeight: number = ARROW_LEN) {
    super();
    this.offset = offset;
    this.arrowHeight = arrowHeight;
  }

  evaluate(doc: jsPDF) {
    this.nodeWidth = Math.abs(this.offset);
    this.nodeHeight = this.arrowHeight;
    this.children?.evaluate(doc);

    if (this.children == null) {
      this.width = this.nodeWidth;
      this.height = this.nodeHeight;
      return;
    }
    console.log("Max ", this.nodeWidth, this.children.width);
    this.width = Math.max(this.nodeWidth, this.children.width);
    this.height = this.nodeHeight + this.children.height;
  }

  draw(doc: jsPDF, x: number, y: number): [number, number] {
    drawArrow(
      doc,
      x + Math.max(0, this.offset),
      y,
      x + Math.max(0, -this.offset),
      y + this.arrowHeight
    );

    if (!this.children) return [x, y + this.arrowHeight];
    return this.children?.draw(doc, x, y + this.arrowHeight);
  }
}

export default ArrowComponent;
