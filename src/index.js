
import React, { useState } from "react";
import ReactDOM from "react-dom/client";

function ReviewOzon() {
  const [clientId, setClientId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("Не подключено");

  const handleConnect = () => {
    if (!clientId || !apiKey) return alert("Введите Client ID и API Key");
    setStatus("Подключение...");
    setTimeout(() => {
      setStatus("Успешно подключено к Ozon API ✅");
    }, 1000);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Review Ozon</h1>
      <p style={{ marginTop: 10 }}>Введите Client ID и API Key:</p>
      <input
        placeholder="Client ID"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        style={{ display: "block", marginBottom: 10, padding: 8, width: 300 }}
      />
      <input
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ display: "block", marginBottom: 10, padding: 8, width: 300 }}
      />
      <button onClick={handleConnect} style={{ padding: 10 }}>
        Подключиться
      </button>
      <p style={{ color: "green", marginTop: 10 }}>{status}</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ReviewOzon />);
