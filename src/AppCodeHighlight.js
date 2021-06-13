import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const AppCodeHighlight = (props) => {
  return (
    <SyntaxHighlighter language="javascript" style={docco}>
      {props.children}
    </SyntaxHighlighter>
  );
};

export default AppCodeHighlight;
