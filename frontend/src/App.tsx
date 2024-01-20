import { useRef, useState } from "react";
import { type Message, TextLine } from "./TextLine";
import { useStateRef } from "./useStateRef";

function App() {
  const sourceRef = useRef<EventSource | null>(null);
  const [url, setUrl] = useState("https://sse.fahle.dev/sse");
  const [messages, setMessages] = useStateRef<Message[]>([]);

  function addMessage(message: Message) {
    setMessages((prev) => [...prev, message]);
  }

  function open() {
    if (sourceRef.current) {
      close(false);
    }

    const newSource = new EventSource(url);
    newSource.onopen = () => {
      // todo: add open info message
      addMessage({
        text: `Connected to: ${url}`,
        type: "CONNECTED",
      });
    };

    newSource.onerror = () => {
      addMessage({
        text: `Error with connection to server: ${url}`,
        type: "ERROR",
      });
    };

    newSource.onmessage = (e) => {
      addMessage({
        text: e.data,
        type: "MESSAGE",
      });
    };

    sourceRef.current = newSource;
  }

  function close(flag = true) {
    console.log("close", flag);
    if (!sourceRef.current) return;
    if (sourceRef.current.readyState === EventSource.CLOSED) return;

    sourceRef.current.close();
    if (flag) {
      sourceRef.current = null;
    }

    addMessage({
      text: `Disconnected from: ${url}`,
      type: "DISCONNECTED",
    });
  }

  return (
    <div className="w-screen h-screen overflow-hidden p-8">
      <nav>
        <h1 className="text-4xl font-semibold">SSEasy</h1>
        <p>
          <span className="font-bold">THE</span> server-sent events test client
        </p>
      </nav>
      <fieldset className="border-base-content border-2 p-4 pt-1 flex gap-4">
        <legend>Connection</legend>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Connection URL"
          className="input input-bordered"
        />
        <button className="btn btn-primary" onClick={open}>
          Open
        </button>
        <button className="btn btn-primary" onClick={() => close()}>
          Close
        </button>
      </fieldset>
      <div className="mockup-code rounded-none h-4/5 mt-4">
        {messages.map((message, index) => (
          <TextLine key={`message-${url}-${index}`} message={message} />
        ))}
      </div>
    </div>
  );
}

export default App;
