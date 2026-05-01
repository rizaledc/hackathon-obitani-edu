import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo.webp';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans text-text-primary px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-10 animate-slideUp">
        <div className="flex justify-center mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="Orbitani Logo" className="w-16 h-16 object-contain hover:scale-105 transition-transform" />
        </div>
        
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-900">Buat Akun</h2>
        <p className="text-text-secondary mb-8 text-center">Mulai revolusi edukasi agrikultur Anda.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Budi Santoso"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="email@sekolah.edu"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/30 mt-4"
          >
            Daftar
          </button>
        </form>
        
        <p className="text-center mt-8 text-text-secondary">
          Sudah punya akun? <Link to="/login" className="text-primary font-bold hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
