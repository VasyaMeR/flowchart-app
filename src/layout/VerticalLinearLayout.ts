import Layout from "./Layout";
import jsPDF from "jspdf";

class VerticalLinearLayout extends Layout {
  constructor(
    width: number = 0,
    height: number = 0,
    children: Layout | null = null
  ) {
    super(width, height, children);
  }

  evaluate(doc: jsPDF) {
    if (this.children) {
      this.children.evaluate(doc);
      this.nodeWidth = Math.max(this.nodeWidth, this.children.width);
    }
    if (this.children == null) {
      this.width = this.nodeWidth;
      this.height = this.nodeHeight;
      return;
    }

    this.height = this.children.height + this.nodeHeight;
    this.width = Math.max(this.children.width, this.nodeWidth);
  }

  draw(doc: jsPDF, x: number, y: number): [number, number] {
    if (this.children) {
      let [downX, downY] = this.children.draw(
        doc,
        x + (this.nodeWidth - this.children.nodeWidth) / 2,
        y
      );
      return [downX, downY];
    }
    return [x, y];
  }
}

export default VerticalLinearLayout;
