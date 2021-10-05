import ArrowComponent from "./Arrow";
import { ARROW_LEN } from "./Constants";
import { NodeType } from "../parsers/FlowDataTypes";
import BeginNodeComponent from "./node/BeginNodeComponent";
import EndNodeComponent from "./node/EndNodeComponent";
import IfNodeComponent from "./node/IfNodeComponent";
import LoopNodeComponent from "./node/LoopNodeComponent";
import InputNodeComponent from "./node/InputNodeComponent";
import OutputNodeComponent from "./node/OutputNodeComponent";
import OperationNodeComponent from "./node/OperationNodeComponent";
import VerticalLinearLayout from "./VerticalLinearLayout";

export const generateLayoutFromFlow = (root: any) => {
  if (!root) {
    return new VerticalLinearLayout();
  }
  let layout = new ArrowComponent(0, ARROW_LEN);

  switch (root.type) {
    case NodeType.BEGIN:
      layout.children = new BeginNodeComponent(root);
      break;
    case NodeType.END:
      layout.children = new EndNodeComponent(root);
      return layout;
    case NodeType.IF_CONDITION:
      layout.children = new IfNodeComponent(root);
      break;
    case NodeType.LOOP:
      layout.children = new LoopNodeComponent(root);
      break;
    case NodeType.INPUT:
      layout.children = new InputNodeComponent(root);
      break;
    case NodeType.OUTPUT:
      layout.children = new OutputNodeComponent(root);
      break;
    case NodeType.OPERATION:
      layout.children = new OperationNodeComponent(root);
      break;
    default:
      throw Error("Bad root");
  }
  // console.log("Child: ", layout.children);
  // console.log("Child: ", layout.children.children);
  // console.log("Next: ", root.next);
  if (root.next) layout.children.children = generateLayoutFromFlow(root.next);
  return layout;
};
