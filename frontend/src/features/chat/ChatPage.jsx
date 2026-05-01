import React, { useState } from 'react';
import api from '../../services/api';
import OrbitaniLoader from '../../components/OrbitaniLoader';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/api/chat/', {
        message: userMessage,
        user_api_key: apiKey || undefined
      });
      
      const aiResponse = res.data.data?.response || res.data.response || res.data;
      setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (err) {
      setError('Gagal mengirim pesan ke AI.');
      setChatHistory(prev => [...prev, { role: 'ai', content: 'Maaf, terjadi kesalahan saat menghubungi AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-100px)] flex flex-col animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Pakar AI</h2>
      <p className="text-gray-600 mb-4 text-sm">Konsultasikan masalah pertanian Anda dengan Pakar AI kami.</p>
      
      <div className="mb-4 flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-600 block">OpenAI API Key (Opsional - BYOK)</label>
        <input 
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 overflow-y-auto flex flex-col gap-4">
        {chatHistory.length === 0 ? (
          <div className="m-auto text-gray-400 text-sm">Belum ada percakapan. Mulai dengan menyapa Pakar AI!</div>
        ) : (
          chatHistory.map((chat, index) => (
            <div key={index} className={`max-w-[80%] p-3 rounded-lg text-sm ${chat.role === 'user' ? 'bg-primary text-white self-end rounded-br-none' : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'}`}>
              {chat.content}
            </div>
          ))
        )}
        {loading && (
          <div className="self-start bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none">
            <OrbitaniLoader status="processing" />
          </div>
        )}
        {error && <div className="text-red-500 text-xs text-center">{error}</div>}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan Anda di sini..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={loading}
        />
        <button 
          type="submit"
          className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
          disabled={loading}
        >
          Kirim
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
