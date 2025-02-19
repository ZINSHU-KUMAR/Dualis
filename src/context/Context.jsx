import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setshowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delaypara = (index, nextword) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextword);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setshowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setshowResult(true);

    let response;
    if (prompt !== undefined) {
      response = await run(prompt);
      console.log("Response:", response);  // Log the response for debugging
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await run(input);
      console.log("Response:", response);  // Log the response for debugging
    }

    // Check if response is empty
    if (!response) {
      console.error("No response received!");
      setLoading(false);
      return;
    }

    // Split and manipulate the response text
    let responseArray = response.split("**");
    let newRespose = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newRespose += responseArray[i];
      } else {
        newRespose += "<b>" + responseArray[i] + "</b>";
      }
    }

    let newRespose2 = newRespose.split("*").join("</br>");
    let newResponseArray = newRespose2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delaypara(i, nextWord + " ");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
