'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const controller = useRef<AbortController>();

  async function sendMessage() {
    if (!input) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    controller.current = new AbortController();

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
      signal: controller.current.signal,
    });

    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false, botMessage = '';
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        botMessage += decoder.decode(value);
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last.role === 'assistant') {
            return [...prev.slice(0, -1), { role: 'assistant', content: botMessage }];
          }
          return [...prev, { role: 'assistant', content: botMessage }];
        });
      }
    }
  }

  return (
    <div>
      <h1 style={{ color: '#179942', marginBottom: '1rem' }}>FHA Quote Chatbot</h1>
      <div style={{ marginBottom: '1rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '0.5rem 0' }}>
            <strong>{m.role === 'assistant' ? 'Bot:' : 'You:'}</strong> {m.content}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button
          onClick={sendMessage}
          style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#179942', color: '#fff' }}
        >
          Send
        </button>
      </div>
    </div>
);
}
