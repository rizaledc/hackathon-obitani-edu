import React, { useState, useEffect } from 'react';
import { Send, Plus, Clock, MessageSquare, Settings, ChevronDown, X, Brain, MapPin, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedLahan, setSelectedLahan] = useState(null);
  const [lahanList, setLahanList] = useState([]);
  const [lahanAnalysis, setLahanAnalysis] = useState({});
  const [showLahanDropdown, setShowLahanDropdown] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(`session_${Date.now()}`);
  const [sessionName, setSessionName] = useState('');
  const [chatSessions, setChatSessions] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [editName, setEditName] = useState('');

  // Fetch lahan list
  useEffect(() => {
    const fetchLahan = async () => {
      try {
        const res = await api.get('/api/lahan/');
        setLahanList(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLahan();
    loadHistory();
  }, []);

  // Load history dan group by session
  const loadHistory = async () => {
    try {
      const res = await api.get('/api/chat/history');
      const data = res.data?.data || res.data || [];
      
      // Group by session_id
      const sessions = {};
      data.forEach(msg => {
        if (!sessions[msg.session_id]) {
          sessions[msg.session_id] = {
            session_id: msg.session_id,
            session_name: msg.session_name || 'Percakapan',
            created_at: msg.created_at,
            messages: []
          };
        }
        sessions[msg.session_id].messages.push(msg);
      });
      
      setChatSessions(Object.values(sessions).sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (err) {
      console.error(err);
      setChatSessions([]);
    }
  };

  // Load session tertentu
  const handleLoadSession = (session) => {
    setCurrentSessionId(session.session_id);
    setSessionName(session.session_name);
    setMessages(session.messages.map(m => ({
      role: m.role,
      content: stripMarkdown(m.content)
    })));
    setSelectedLahan(null);
  };

  // Percakapan baru
  const handleNewChat = () => {
    setCurrentSessionId(`session_${Date.now()}`);
    setSessionName('');
    setMessages([]);
    setSelectedLahan(null);
  };

  const handleSaveSessionName = (session) => {
    setChatSessions(prev => prev.map(s => 
      s.session_id === session.session_id 
        ? { ...s, session_name: editName } 
        : s
    ));
    setEditingSession(null);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Hapus percakapan ini?')) return;
    try {
      await api.delete('/api/chat/history', {
        params: { session_id: sessionId }
      });
      setChatSessions(prev => prev.filter(s => s.session_id !== sessionId));
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
    } catch {
      setChatSessions(prev => prev.filter(s => s.session_id !== sessionId));
      if (currentSessionId === sessionId) handleNewChat();
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hari ini, ' + date.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
    if (diffDays === 1) return 'Kemarin';
    return date.toLocaleDateString('id-ID', {day:'numeric', month:'short'});
  };

  // Load analysis data saat pilih lahan
  const handleSelectLahan = async (lahan) => {
    setSelectedLahan(lahan);
    setShowLahanDropdown(false);
    
    if (lahan && !lahanAnalysis[lahan.id]) {
      try {
        const res = await api.get(`/api/history/${lahan.id}`);
        setLahanAnalysis(prev => ({ ...prev, [lahan.id]: res.data?.results || res.data || [] }));
      } catch {
        setLahanAnalysis(prev => ({ ...prev, [lahan.id]: [] }));
      }
    }
  };

  // stripMarkdown function
  const stripMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1')
      .replace(/^\s*[-*+]\s/gm, '• ')
      .replace(/\[Konteks Lahan[^\]]*\]/g, '')
      .trim();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input;
    setInput('');
    
    // Tambah ke UI dulu
    const newUserMsg = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);
    
    // Buat konteks jika ada lahan dipilih
    let messageWithContext = userMessage;
    if (selectedLahan) {
      const lahanData = lahanAnalysis[selectedLahan.id];
      if (lahanData && lahanData.length > 0) {
        const avg = (key) => (lahanData.reduce((s,r) => s+(r[key]||0), 0) / lahanData.length).toFixed(1);
        const cropCount = {};
        lahanData.forEach(r => {
          if (r.hasil_rekomendasi) cropCount[r.hasil_rekomendasi] = (cropCount[r.hasil_rekomendasi]||0)+1;
        });
        const topCrop = Object.entries(cropCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';
        
        messageWithContext = `[Konteks Lahan "${selectedLahan.nama}": N=${avg('n')} P=${avg('p')} K=${avg('k')} pH=${avg('ph')} Suhu=${avg('temperature')}°C Lembab=${avg('humidity')}% Hujan=${avg('rainfall')}mm Rekomendasi=${topCrop}] ${userMessage}`;
      }
    }
    
    try {
      const currentSessionName = sessionName || userMessage.slice(0, 30);
      const res = await api.post('/api/chat/', {
        message: messageWithContext,
        lahan_id: selectedLahan?.id || null,
        session_id: currentSessionId,
        session_name: currentSessionName,
        user_api_key: null
      });
      
      const aiText = res.data?.response || res.data?.message || res.data?.data?.reply || res.data?.reply || '';
      const aiMsg = { role: 'assistant', content: stripMarkdown(aiText) };
      setMessages(prev => [...prev, aiMsg]);
      
      // Update session name dari pesan pertama
      if (messages.length === 0) {
        setSessionName(userMessage.slice(0, 40));
      }
      
      // Refresh riwayat
      loadHistory();
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Maaf, gagal menghubungi Pakar AI. Silakan coba lagi.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-white font-sans" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      {/* SIDEBAR KIRI */}
      <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={16} />
            Percakapan Baru
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Section: RIWAYAT PERCAKAPAN */}
          <div className="p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Riwayat Percakapan</h3>
            <div className="space-y-1">
              {chatSessions.map(session => (
                <div key={session.session_id}
                  className={`group flex items-center gap-2 px-3 py-2.5 
                    rounded-lg cursor-pointer transition-colors
                    ${currentSessionId === session.session_id 
                      ? 'bg-green-50 border-l-2 border-green-600' 
                      : 'hover:bg-gray-50'}`}
                >
                  {editingSession === session.session_id ? (
                    // Mode edit nama
                    <input
                      className="flex-1 text-sm border border-green-400 
                        rounded px-2 py-0.5 focus:outline-none"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleSaveSessionName(session)
                        if (e.key === 'Escape') setEditingSession(null)
                      }}
                      autoFocus
                    />
                  ) : (
                    <div className="flex-1 min-w-0"
                      onClick={() => handleLoadSession(session)}>
                      <p className="text-sm text-gray-700 truncate font-medium">
                        {session.session_name || 'Percakapan'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(session.created_at)}
                      </p>
                    </div>
                  )}

                  {/* Tombol edit & hapus - muncul saat hover */}
                  {editingSession !== session.session_id && (
                    <div className="hidden group-hover:flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingSession(session.session_id)
                          setEditName(session.session_name || '')
                        }}
                        className="p-1 text-gray-400 hover:text-green-600 
                          rounded transition-colors"
                        title="Edit nama"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSession(session.session_id)
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 
                          rounded transition-colors"
                        title="Hapus percakapan"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {/* Header */}
        <div className="h-16 flex-shrink-0 border-b border-gray-100 flex items-center justify-between px-6 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <Brain size={20} />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Asisten Praktikum AI</h1>
              <p className="text-xs text-gray-500">Asisten Analisis & Rekomendasi Pintar</p>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <Settings size={18} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30">
          {messages.length === 0 && (
            <div className="flex gap-4 max-w-3xl mx-auto">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                <Brain size={16} />
              </div>
              <div className="flex-1">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-700 leading-relaxed max-w-fit">
                  Halo! Saya adalah Pakar AI Agronomi Orbitani.<br/>
                  Ada masalah spesifik pada lahan atau tanaman Anda yang bisa saya analisis hari ini?
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  <Brain size={16} />
                </div>
              )}
              <div className={`flex-1 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-[#16a34a] text-white rounded-tr-none shadow-sm' 
                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm whitespace-pre-wrap'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 max-w-3xl mx-auto">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                <Brain size={16} />
              </div>
              <div className="flex-1">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 bg-white p-4">
          <div className="max-w-3xl mx-auto">
            {selectedLahan && (
              <div className="flex items-center gap-2 mb-2 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
                <span>Konteks: {selectedLahan.nama}</span>
                <button onClick={() => setSelectedLahan(null)} className="hover:text-green-900"><X size={12} /></button>
              </div>
            )}
            
            <div className="flex items-end gap-2 bg-white border border-gray-200 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all relative">
              <div className="relative">
                <button 
                  onClick={() => setShowLahanDropdown(!showLahanDropdown)}
                  className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors flex-shrink-0"
                  title="Pilih Lahan"
                >
                  <Plus size={20} />
                </button>
                
                {showLahanDropdown && (
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-2">
                    <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase">Pilih Lahan</div>
                    <button
                      onClick={() => handleSelectLahan(null)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <MessageSquare size={14} className="text-gray-400" /> Obrolan Umum
                    </button>
                    {lahanList.map(lahan => (
                      <button
                        key={lahan.id}
                        onClick={() => handleSelectLahan(lahan)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <MapPin size={14} className="text-gray-400" /> {lahan.nama || 'Lahan'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Tanyakan analisis mendalam tentang lahan atau tanaman Anda..."
                className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none py-3 text-sm text-gray-700 placeholder-gray-400 custom-scrollbar"
                rows={1}
              />
              
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="p-2.5 bg-[#16a34a] text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0 mb-0.5"
              >
                <Send size={18} className={input.trim() && !loading ? 'translate-x-0.5 -translate-y-0.5' : ''} />
              </button>
            </div>
            <div className="text-center mt-2 text-[10px] text-gray-400 font-medium">
              Daya analitik dari Gemini AI. Jawaban mungkin tidak selalu akurat.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
