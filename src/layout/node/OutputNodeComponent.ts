import NodeComponent from "../Node";
import { OutputNode } from "../../parsers/FlowDataTypes";
import jsPDF from "jspdf";
import { PADDING_H, PADDING_V } from "../Constants";
import drawParallelogram from "../../draw-helpers/Parallelogram";
import drawText from "../../draw-helpers/Text";

class OutputNodeComponent extends NodeComponent {
  public node: OutputNode;

  constructor(node: OutputNode) {
    super();
    this.node = node;
  }

  draw(doc: jsPDF, x: number, y: number): [number, number] {
    x -= this.nodeWidth / 2;
    drawParallelogram(doc, x, y, x + this.nodeWidth, y + this.nodeHeight);
    let textDimensions = doc.getTextDimensions(this.node.label);

    drawText(
      doc,
      x + (this.nodeWidth - textDimensions.w) / 2,
      y + PADDING_V + textDimensions.h,
      this.node.label!
    );

    if (!this.children) return [x + this.nodeWidth / 2, y + this.nodeHeight];
    return this.children?.draw(
      doc,
      x + this.nodeWidth / 2,
      y + this.nodeHeight
    );
  }

  evaluate(doc: jsPDF): void {
    let textDimensions = doc.getTextDimensions(this.node.label!);

    this.nodeWidth = textDimensions.w + PADDING_H * 2;
    this.nodeHeight = textDimensions.h + PADDING_V * 2;
    this.children?.evaluate(doc);

    if (this.children == null) {
      this.width = this.nodeWidth;
      this.height = this.nodeHeight;
      return;
    }

    this.width = Math.max(this.nodeWidth, this.children.width);
    this.height = this.nodeHeight + this.children.height;
  }
}

export default OutputNodeComponent;
