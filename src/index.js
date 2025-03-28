// Review Ozon — отображение деталей отзыва, подключение, ответы

import { useState } from "react"

export default function ReviewOzon() {
  const [clientId, setClientId] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [status, setStatus] = useState("Не подключено")
  const [feedbacks, setFeedbacks] = useState([])
  const [answers, setAnswers] = useState([])

  const handleConnect = async () => {
    if (!clientId || !apiKey) return alert("Введите Client ID и API Key")
    setStatus("Подключение к Ozon...")

    try {
      const response = await fetch("https://api-seller.ozon.ru/v1/feedback/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": clientId,
          "Api-Key": apiKey,
        },
        body: JSON.stringify({
          page: 1,
          page_size: 5,
        })
      })

      const data = await response.json()

      if (data.result && data.result.feedbacks) {
        const fbList = data.result.feedbacks
        setFeedbacks(fbList)
        setStatus("Отзывы загружены ✅")

        const generated = fbList.map((fb) => {
          const base = "Спасибо за ваш отзыв! Нам очень приятно, что вы делитесь впечатлением 😊 Если будут вопросы — всегда на связи!"
          return {
            id: fb.id,
            answer: base
          }
        })
        setAnswers(generated)
      } else {
        setStatus("Не удалось получить отзывы ❌")
      }
    } catch (error) {
      setStatus("Ошибка подключения ❌")
      console.error(error)
    }
  }

  const handleAnswerChange = (index, newText) => {
    const updated = [...answers]
    updated[index].answer = newText
    setAnswers(updated)
  }

  const sendAnswer = async (index) => {
    const answerText = answers[index]?.answer
    const feedbackId = answers[index]?.id

    if (!answerText || !feedbackId) return alert("Пустой ответ или ID")

    try {
      const response = await fetch("https://api-seller.ozon.ru/v1/feedback/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": clientId,
          "Api-Key": apiKey,
        },
        body: JSON.stringify({
          feedback_id: feedbackId,
          text: answerText
        })
      })

      if (response.ok) {
        alert("Ответ отправлен успешно ✅")
      } else {
        alert("Ошибка при отправке ответа ❌")
      }
    } catch (err) {
      console.error(err)
      alert("Ошибка подключения к Ozon ❌")
    }
  }

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
        Подключиться и получить отзывы
      </button>
      <p style={{ color: "green", marginTop: 10 }}>{status}</p>

      {feedbacks.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ fontSize: 20 }}>Отзывы и ответы:</h2>
          <ul>
            {feedbacks.map((fb, i) => (
              <li key={i} style={{ marginTop: 10, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
                <p><strong>ID отзыва:</strong> {fb.id}</p>
                <p><strong>Оценка:</strong> {fb.grade} ⭐</p>
                <p><strong>Дата:</strong> {fb.created_at}</p>
                <p><strong>Комментарий:</strong> {fb.text || "(пусто)"}</p>

                <textarea
                  value={answers[i]?.answer || ""}
                  onChange={(e) => handleAnswerChange(i, e.target.value)}
                  rows={3}
                  style={{ width: "100%", padding: 8 }}
                />
                <button onClick={() => sendAnswer(i)} style={{ marginTop: 5, padding: 8 }}>
                  Отправить ответ
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ReviewOzon />);
