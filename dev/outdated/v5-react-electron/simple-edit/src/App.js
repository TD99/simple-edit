import './App.css';
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ language, theme }) => {
  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="100vh"
        width={`100%`}
        language={language || "javascript"}
        theme={theme}
      />
    </div>
  );
};

export default CodeEditorWindow;

/*export default function App() {
  return (
    <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
  )
}*/