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

function isPrefix(st: string, prefix: string) {
  if (st.length < prefix.length) return false;
  for (let i = 0; i < prefix.length; i++) {
    if (st[i] !== prefix[i]) return false;
  }
  return true;
}

function getBlock(code: string, open: string, close: string) {
  code = code.replace(open, "");
  let block: string = "";
  let cnt = 1;
  while (code.length > 0) {
    let c: string = code[0];
    code = code.replace(c, "");
    block += c;
    if (c === open) cnt++;
    else if (c === close) cnt--;
    if (cnt === 0) break;
    if (cnt < 0) {
      throw Error();
    }
  }
  block = block.slice(0, -1);
  return [code, block];
}

function getShortBlock(code: string) {
  let block = "";
  while (code.length > 0 && code[0] !== ";") {
    let c: string = code[0];
    code = code.replace(c, "");
    block += c;
  }
  code = code.replace(code[0], "");
  return [code, block];
}

function getSplitedBlock(code: string, symbol: string) {
  var block: string = "";
  while (code.length > 0 && code[0] !== ";") {
    if (isPrefix(code, symbol)) code = code.replace(symbol, ",");
    else {
      var c = code[0];
      block += c;
      code = code.replace(c, "");
    }
  }
  while (block.length && block[0] === " ") {
    block = block.replace(" ", "");
  }
  while (block.length && block[0] === ",") {
    block = block.replace(",", "");
  }
  while (block.length && block[0] === " ") {
    block = block.replace(" ", "");
  }
  return [code, block];
}

function removePrefix(st: string, c: string): string {
  while (st.length > 0 && st[0] !== c) {
    let c = st[0];
    st = st.replace(c, "");
  }
  return st;
}

function removePrefixWhitespaces(st: string): string {
  while ((st.length > 0 && st.search(/\s/) === 0) || st[0] === ";") {
    let c = st[0];
    st = st.replace(c, "");
  }
  return st;
}

const Parse = (code: string, endNode: Node | null): Node | null => {
  // console.log(`parse ${code}`);
  code = removePrefixWhitespaces(code);

  if (isPrefix(code, "if")) {
    code = code.replace("if", "");
    code = removePrefix(code, "(");
    let condition = "";
    [code, condition] = getBlock(code, "(", ")");
    code = removePrefixWhitespaces(code);
    let trueBody: string = "";
    if (code.length > 0 && code[0] !== "{") {
      [code, trueBody] = getShortBlock(code);
    } else {
      [code, trueBody] = getBlock(code, "{", "}");
    }
    let trueNode = Parse(trueBody, null);
    let falseNode = null;
    code = removePrefixWhitespaces(code);
    if (isPrefix(code, "else")) {
      code = code.replace("else", "");
      code = removePrefixWhitespaces(code);
      var falseBody: string = "";
      if (code.length > 0 && code[0] !== "{") {
        [code, falseBody] = getShortBlock(code);
      } else {
        [code, falseBody] = getBlock(code, "{", "}");
      }
      falseNode = Parse(falseBody, null);
    }
    return new IfConditionNode(
      condition,
      trueNode,
      falseNode,
      Parse(code, endNode)
    );
  } else if (isPrefix(code, "while")) {
    code = code.replace("while", "");
    code = removePrefix(code, "(");
    let condition = "";
    [code, condition] = getBlock(code, "(", ")");
    code = removePrefixWhitespaces(code);
    let trueBody: string = "";
    if (code.length > 0 && code[0] !== "{") {
      [code, trueBody] = getShortBlock(code);
    } else {
      [code, trueBody] = getBlock(code, "{", "}");
    }
    let trueNode = Parse(trueBody, null);
    code = removePrefixWhitespaces(code);
    return new LoopNode(condition, trueNode, Parse(code, endNode));
  } else if (isPrefix(code, "for")) {
    code = code.replace("for", "");
    code = removePrefix(code, "(");
    let conditions = "";
    [code, conditions] = getBlock(code, "(", ")");
    // console.log(conditions);
    code = removePrefixWhitespaces(code);
    let trueBody: string = "";
    if (code.length > 0 && code[0] !== "{") {
      [code, trueBody] = getShortBlock(code);
    } else {
      [code, trueBody] = getBlock(code, "{", "}");
    }
    let cond = conditions.split(";");
    let trueNode = Parse(trueBody, Parse(cond[2], null));
    code = removePrefixWhitespaces(code);
    return new OperationNode(
      cond[0],
      new LoopNode(cond[1], trueNode, Parse(code, endNode))
    );
  } else if (isPrefix(code, "cin")) {
    code = code.replace("cin", "");
    let input = "";
    [code, input] = getSplitedBlock(code, ">>");
    return new InputNode(input, Parse(code, endNode));
  } else if (isPrefix(code, "cout")) {
    code = code.replace("cout", "");
    let output = "";
    [code, output] = getSplitedBlock(code, "<<");
    return new OutputNode(output, Parse(code, endNode));
  } else if (code.length > 0) {
    let operation = "";
    [code, operation] = getShortBlock(code);
    return new OperationNode(operation, Parse(code, endNode));
  }

  return endNode;
};

const ParseCppCode = (code: string) => {
  var body = Parse(code, new EndNode());
  if (!body) {
    throw Error();
  }
  return new BeginNode(body);
};

export default ParseCppCode;
