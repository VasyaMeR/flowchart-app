import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Button } from "react-bootstrap";
import compileFlowChart from "./CompileFlowChart"
import ParseCppCode from "./parsers/CppCodeParser"

const EXAMPLE_CODE = `
int n;
cin >> n;
for (int i = 0; i < n; i++) {
  int x;
  cin >> x;
  cout << x * 5;
}
if (n % 5 == 0) {
  cout << n / 5;
} else {
  cout << n / 5 + 1;
}
`;

const App = () => {
  const [codeInput, setCodeInput] = useState(EXAMPLE_CODE);
  const [pdf, setPdf] = useState(compileFlowChart(ParseCppCode(EXAMPLE_CODE)));

  return (
    <div className="App" style={{ display: "flex" }}>
      <Container style={{ width: "50%", height: "100vh", padding: "15px" }}>
        <InputGroup style={{ height: "100%", fontFamily: "monospace" }}>
          <FormControl
            as="textarea"
            spellCheck="false"
            onChange={(i) => {
              setCodeInput(i.target.value || "");
            }}
            defaultValue={EXAMPLE_CODE}
          />
          <Button
            onClick={(_) => {
              setPdf(
                compileFlowChart(
                  ParseCppCode(codeInput)
                )
              );
            }}
          >
            Generate
          </Button>
        </InputGroup>
      </Container>
      <Container style={{ width: "50%", height: "100vh", padding: "0px" }}>
        <iframe
          title="pdfPreview"
          src={pdf.output("datauristring")}
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      </Container>
    </div>
  );
};

export default App;