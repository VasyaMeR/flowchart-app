import { Node } from "./parsers/FlowDataTypes";
import jsPDF from "jspdf";
import { generateLayoutFromFlow } from "./layout/GenerateLayoutFromFlow";

const compileFlowChart = (root: Node) => {
  let w = 500;
  let h = 500;
  let doc = new jsPDF("l", "mm", [w, h]);

  doc.setDrawColor("black");
  doc.setLineWidth(0.5);

  let l = generateLayoutFromFlow(root).children!;
  l.evaluate(doc);
  l.draw(doc, w / 2, 5);

  return doc;
};

export default compileFlowChart;
