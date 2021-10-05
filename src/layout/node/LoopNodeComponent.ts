import { LoopNode } from "../../parsers/FlowDataTypes";
import Layout from "../Layout";
import NodeComponent from "../Node";
import jsPDF from "jspdf";
import drawRhombus, { calcRhombus } from "../../draw-helpers/Rhombus";
import {
  ARROW_LEN,
  FALSE_LABEL,
  IF_ARROW_PADDING,
  LOOP_ARROW_PADDING,
  PADDING_BETWEEN_V,
  TRUE_LABEL,
} from "../Constants";
import drawText from "../../draw-helpers/Text";
import drawLine from "../../draw-helpers/Line";
import drawArrow from "../../draw-helpers/Arrow";
import { generateLayoutFromFlow } from "../GenerateLayoutFromFlow";

class LoopNodeComponent extends NodeComponent {
  node: LoopNode;
  trueLayout?: Layout = undefined;

  constructor(node: LoopNode) {
    super();
    this.node = node;
  }

  draw(doc: jsPDF, x: number, y: number): [number, number] {
    x -= this.nodeWidth / 2;
    let textDimensions = doc.getTextDimensions(this.node.label);
    let [nodeWidth, nodeHeight] = calcRhombus(doc, this.node.label!);

    drawRhombus(
      doc,
      x + (this.nodeWidth - nodeWidth) / 2,
      y,
      x + (this.nodeWidth + nodeWidth) / 2,
      y + nodeHeight
    );

    let columnWidth = this.width;

    drawText(doc, x + this.nodeWidth / 2 + 1, y + nodeHeight + 5, TRUE_LABEL);
    drawText(
      doc,
      x + this.nodeWidth / 2 + nodeWidth / 2,
      y + nodeHeight / 2 - 2,
      FALSE_LABEL
    );
    drawText(
      doc,
      x + (this.nodeWidth - textDimensions.w) / 2,
      y + nodeHeight / 2 + textDimensions.h / 2,
      this.node.label!
    );

    drawLine(
      doc,
      x + this.nodeWidth / 2 + nodeWidth / 2,
      y + nodeHeight / 2,
      x + this.nodeWidth / 2 + columnWidth / 2 + IF_ARROW_PADDING,
      y + nodeHeight / 2
    );
    let [trueX, trueY] = this.trueLayout!.draw(
      doc,
      x + this.nodeWidth / 2,
      y + nodeHeight / 2 + PADDING_BETWEEN_V
    );

    trueY += IF_ARROW_PADDING;
    drawLine(
      doc,
      x + this.nodeWidth / 2,
      trueY - IF_ARROW_PADDING,
      x + this.nodeWidth / 2,
      trueY
    );
    drawLine(
      doc,
      x + this.nodeWidth / 2,
      trueY,
      x + this.nodeWidth / 2 - columnWidth / 2 - IF_ARROW_PADDING,
      trueY
    );
    drawLine(
      doc,
      x + this.nodeWidth / 2 - columnWidth / 2 - IF_ARROW_PADDING,
      y + nodeHeight / 2,
      x + this.nodeWidth / 2 - columnWidth / 2 - IF_ARROW_PADDING,
      trueY
    );
    drawArrow(
      doc,
      x + this.nodeWidth / 2 - columnWidth / 2 - IF_ARROW_PADDING,
      y + nodeHeight / 2,
      x + this.nodeWidth / 2 - nodeWidth / 2,
      y + nodeHeight / 2
    );

    trueY += LOOP_ARROW_PADDING;
    drawLine(
      doc,
      x + this.nodeWidth / 2 + columnWidth / 2 + IF_ARROW_PADDING,
      y + nodeHeight / 2,
      x + this.nodeWidth / 2 + columnWidth / 2 + IF_ARROW_PADDING,
      trueY
    );
    drawLine(
      doc,
      x + this.nodeWidth / 2 + columnWidth / 2 + IF_ARROW_PADDING,
      trueY,
      x + this.nodeWidth / 2,
      trueY
    );

    // console.log("trueY ", trueY);

    if (!this.children) {
      return [trueX, trueY];
    }
    // @ts-ignore
    // console.log(this.children.arrowHeight);
    return this.children.draw(doc, trueX, trueY);
  }

  evaluate(doc: jsPDF): void {
    let node = this.node;
    [this.nodeWidth, this.nodeHeight] = calcRhombus(doc, node.label);

    this.trueLayout = generateLayoutFromFlow(this.node.trueNode!);
    this.trueLayout.evaluate(doc);

    this.children?.evaluate(doc);

    this.width = Math.max(
      Math.max(this.trueLayout.width, this.nodeWidth) + 2 * IF_ARROW_PADDING,
      <number>this.children?.width
    );
    this.height =
      this.nodeHeight +
      2 * PADDING_BETWEEN_V +
      this.trueLayout.height +
      <number>this.children?.width;
  }
}

export default LoopNodeComponent;
