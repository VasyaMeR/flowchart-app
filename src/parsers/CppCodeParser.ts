import {
  BeginNode,
  EndNode,
  IfConditionNode,
  InputNode,
  LoopNode,
  Node,
  OperationNode,
  OutputNode,
} from "./FlowDataTypes";
import StringView from "./StringView";

function getBlock(code: StringView, open: string, close: string): StringView {
  code.removePrefixWhitespaces();
  code.removePrefix(open.length);

  let block: string[] = [];
  let cnt = 1;
  
  while (code.length() > 0) {
    let c: string = code.front();
    code.removePrefix(1);
  
    block.push(c);
    if (c === open) cnt++;
    else if (c === close) cnt--;
    if (cnt === 0) break;
  
    if (cnt < 0) {
      throw Error();
    }
  }
  block.pop();
  return new StringView(block.join(""));
}

function getShortBlock(code: StringView): StringView {
  let block: string[] = [];

  while (code.length() > 0 && code.front() !== ";") {
    block.push(code.front());
    code.removePrefix(1);
  }
  if (code.length() > 0)
    code.removePrefix(1);
  return new StringView(block.join(""));
}

function getSplitedBlock(code: StringView, separator: string) {
  var block: string[] = [];
  while (code.length() > 0 && code.front() !== ";") {
    if (code.isPrefix(separator)) {
      block.push(",");
      code.removePrefix(separator.length);
    }
    else {
      block.push(code.front());
      code.removePrefix(1);
    }
  }
  if (code.length() > 0)
    code.removePrefix(1);

  let str = block.join("");
  while (str.length && str[0] === " ") {
    str = str.replace(" ", "");
  }
  while (str.length && str[0] === ",") {
    str = str.replace(",", "");
  }
  while (str.length && str[0] === " ") {
    str = str.replace(" ", "");
  }
  return str;
}

const IF = "if";
const ELSE = "else";
const WHILE = "while";
const FOR = "for";
const INPUT = "cin";
const OUTPUT = "cout";

const Parse = (code: StringView, endNode: Node | null): Node | null => {
  code.removePrefixWhitespaces();

  if (code.isPrefix(IF))
    return ParseIf(code, endNode);

  if (code.isPrefix(WHILE))
    return ParseWhile(code, endNode);
  
  if (code.isPrefix(FOR))
    return ParseFor(code, endNode);
  
  if (code.isPrefix(INPUT))
    return ParseInput(code, endNode);
  
  if (code.isPrefix(OUTPUT))
    return ParseOutput(code, endNode);

  if (code.length() > 0)
    return ParseOperation(code, endNode);

  return endNode;
};

const ParseIf = (code: StringView, endNode: Node | null): Node | null => {
  code.removePrefix(IF.length);
  code.removePrefixWhitespaces();
  code.removePrefix("(".length);

  let condition = getBlock(code, "(", ")");
  code.removePrefixWhitespaces();

  let trueBody: StringView;
  if (code.length() > 0 && code.front() !== "{") {
    trueBody = getShortBlock(code);
  } else {
    trueBody = getBlock(code, "{", "}");
  }
  let trueNode = Parse(trueBody, null);

  let falseNode = null;
  code.removePrefixWhitespaces();
  if (code.isPrefix(ELSE)) {
    code.removePrefix(ELSE.length);
    code.removePrefixWhitespaces();
    
    let falseBody: StringView;
    if (code.length() > 0 && code.front() !== "{") {
      falseBody = getShortBlock(code);
    } else {
      falseBody = getBlock(code, "{", "}");
    }
    falseNode = Parse(falseBody, null);
  }

  return new IfConditionNode(
    condition.getString(),
    trueNode,
    falseNode,
    Parse(code, endNode)
  );
}

const ParseWhile = (code: StringView, endNode: Node | null): Node | null => {
  code.removePrefix(WHILE.length);
  code.removePrefixWhitespaces();
  
  let condition = getBlock(code, "(", ")");
  code.removePrefixWhitespaces();

  let trueBody: StringView;
  if (code.length() > 0 && code.front() !== "{") {
    trueBody = getShortBlock(code);
  } else {
    trueBody = getBlock(code, "{", "}");
  }

  let trueNode = Parse(trueBody, null);
  code.removePrefixWhitespaces();
  return new LoopNode(condition.getString(), trueNode, Parse(code, endNode));
}

const ParseFor = (code: StringView, endNode: Node | null): Node | null => {
  code.removePrefix(FOR.length);
  code.removePrefixWhitespaces();
  
  let conditions = getBlock(code, "(", ")");
  code.removePrefixWhitespaces();

  let trueBody: StringView;
  if (code.length() > 0 && code.front() !== "{") {
    trueBody = getShortBlock(code);
  } else {
    trueBody = getBlock(code, "{", "}");
  }
  let cond = conditions.getString().split(";");
  let trueNode = Parse(trueBody, Parse(new StringView(cond[2]), null));
  code.removePrefixWhitespaces();
  
  return new OperationNode(
    cond[0],
    new LoopNode(cond[1], trueNode, Parse(code, endNode))
  );
}

const ParseInput = (code: StringView, endNode: Node | null): Node | null => {
  code.removePrefix(INPUT.length);
  let input = getSplitedBlock(code, ">>");

  return new InputNode(input, Parse(code, endNode));
}

const ParseOutput = (code: StringView, endNode: Node | null): Node | null => {
  code.removePrefix(OUTPUT.length);
  let output = getSplitedBlock(code, "<<");

  return new OutputNode(output, Parse(code, endNode));
}

const ParseOperation = (code: StringView, endNode: Node | null): Node | null => {
  let operation = getShortBlock(code);
  return new OperationNode(operation.getString(), Parse(code, endNode));
}

const ParseCppCode = (code: string) => {
  let code_ = new StringView(code);

  let body = Parse(code_, new EndNode());
  if (!body) {
    throw Error();
  }
  return new BeginNode(body);
};

export default ParseCppCode;
