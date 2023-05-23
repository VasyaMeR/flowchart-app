import NodeComponent from "../Node";
import jsPDF from "jspdf";
import drawRhombus, { calcRhombus } from "../../draw-helpers/Rhombus";
import { IfConditionNode } from "../../parsers/FlowDataTypes";
import Layout from "../Layout";
import drawText from "../../draw-helpers/Text";
import {
  FALSE_LABEL,
  IF_ARROW_PADDING,
  PADDING_BETWEEN_V,
  TRUE_LABEL,
} from "../Constants";
import drawLine from "../../draw-helpers/Line";
import { generateLayoutFromFlow } from "../GenerateLayoutFromFlow";

class IfNodeComponent extends NodeComponent {
  private node: IfConditionNode;
  trueLayout?: Layout = undefined;
  falseLayout?: Layout = undefined;

  constructor(node: IfConditionNode) {
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

    let columnWidth = Math.max(
      this.trueLayout ? this.trueLayout.width : 0,
      this.falseLayout ? this.falseLayout.width : 0,
      nodeWidth
    );

    drawText(
      doc,
      x +
        this.nodeWidth / 2 -
        nodeWidth / 2 -
        doc.getTextDimensions(TRUE_LABEL).w,
      y + nodeHeight / 2 - 2,
      TRUE_LABEL
    );
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
    drawLine(
      doc,
      x + this.nodeWidth / 2 - nodeWidth / 2,
      y + nodeHeight / 2,
      x + this.nodeWidth / 2 - columnWidth / 2 - IF_ARROW_PADDING,
      y + nodeHeight / 2
    );

    let [trueX, trueY] = this.trueLayout!.draw(
      doc,
      x + this.nodeWidth / 2 - columnWidth / 2 - IF_ARROW_PADDING,
      y + nodeHeight / 2
    );

    let [falseX, falseY] = this.falseLayout!.draw(
      doc,
      x + this.nodeWidth / 2 + columnWidth / 2 + IF_ARROW_PADDING,
      y + nodeHeight / 2
    );
    let maxY = Math.max(trueY, falseY);
    maxY += IF_ARROW_PADDING;

    drawLine(
      doc,
      x + this.nodeWidth / 2 + columnWidth / 2 + IF_ARROW_PADDING,
      y + nodeHeight / 2,
      x + this.nodeWidth / 2 + columnWidth / 2 + IF_ARROW_PADDING,
      this.falseLayout!.children ? y + nodeHeight / 2 + PADDING_BETWEEN_V : maxY
    );
    drawLine(
      doc,
      x + this.nodeWidth / 2 - columnWidth / 2 - IF_ARROW_PADDING,
      y + nodeHeight / 2,
      x + this.nodeWidth / 2 - columnWidth / 2 - IF_ARROW_PADDING,
      this.trueLayout!.children ? y + nodeHeight / 2 + PADDING_BETWEEN_V : maxY
    );

    drawLine(doc, trueX, trueY, trueX, maxY);
    drawLine(doc, falseX, falseY, falseX, maxY);

    drawLine(doc, trueX, maxY, x + this.nodeWidth / 2, maxY);
    drawLine(doc, falseX, maxY, x + this.nodeWidth / 2, maxY);

    if (!this.children) {
      return [(trueX + falseX) / 2, maxY];
    }
    return this.children.draw(doc, (trueX + falseX) / 2, maxY);
  }

  evaluate(doc: jsPDF): void {
    [this.nodeWidth, this.nodeHeight] = calcRhombus(doc, this.node.label!);

    this.trueLayout = generateLayoutFromFlow(this.node.trueNode!);
    this.trueLayout.evaluate(doc);

    this.falseLayout = generateLayoutFromFlow(this.node.falseNode!);
    this.falseLayout.evaluate(doc);

    if (!this.children) {
      this.width = Math.max(
        this.trueLayout.width +
          this.falseLayout.width +
          this.nodeWidth / 2 +
          2 * IF_ARROW_PADDING
      );
      this.height =
        this.nodeHeight +
        PADDING_BETWEEN_V +
        Math.max(this.trueLayout.height, this.falseLayout.height);
      return;
    }

    this.children?.evaluate(doc);
    this.width = Math.max(
      this.trueLayout.width +
        this.falseLayout.width +
        this.nodeWidth / 2 +
        2 * IF_ARROW_PADDING,
      this.children.width
    );
    this.height =
      this.nodeHeight +
      PADDING_BETWEEN_V +
      Math.max(this.trueLayout.height, this.falseLayout.height) +
      this.children.height;
  }
}

export default IfNodeComponent;
