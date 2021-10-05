export enum NodeType {
  BEGIN,
  END,
  INPUT,
  OUTPUT,
  OPERATION,
  IF_CONDITION,
  LOOP,
}

export abstract class Node {
  public type: NodeType;
  public label: string;
  public next: Node | null;

  constructor(type: NodeType, label: string = "", next: Node | null = null) {
    this.type = type;
    this.label = label;
    this.next = next;
  }
}

export class OperationNode extends Node {
  constructor(label: string, next: Node | null) {
    super(NodeType.OPERATION, label, next);
  }
}

export class InputNode extends Node {
  constructor(label: string, next: Node | null) {
    super(NodeType.INPUT, label, next);
  }
}

export class OutputNode extends Node {
  constructor(label: string, next: Node | null) {
    super(NodeType.OUTPUT, label, next);
  }
}

export class BeginNode extends Node {
  constructor(next: Node) {
    super(NodeType.BEGIN, "Begin", next);
  }
}

export class EndNode extends Node {
  constructor() {
    super(NodeType.END, "End", null);
  }
}

export class IfConditionNode extends Node {
  public trueNode: Node | null = null;
  public falseNode: Node | null = null;

  constructor(
    label: string,
    trueNode: Node | null = null,
    falseNode: Node | null = null,
    next: Node | null = null
  ) {
    super(NodeType.IF_CONDITION, label, next);
    this.trueNode = trueNode;
    this.falseNode = falseNode;
  }
}

export class LoopNode extends Node {
  public trueNode: Node | null = null;

  constructor(
    label: string,
    trueNode: Node | null = null,
    next: Node | null = null
  ) {
    super(NodeType.LOOP, label, next);
    this.trueNode = trueNode;
  }
}

export const EXAMPLE_FLOW_CHART = new BeginNode(
  new OperationNode(
    "n",
    new OperationNode("r = 1", new OutputNode("r", new EndNode()))
  )
);
