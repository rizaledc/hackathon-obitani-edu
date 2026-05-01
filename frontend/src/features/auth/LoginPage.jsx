import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import logo from '../../assets/logo.webp';
import heroImg from '../../assets/hero.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login('dummy-token', {
      id: 1,
      username: 'Demo User',
      role: 'user'
    });
    navigate('/map');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-text-primary">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24">
        <div className="max-w-md w-full mx-auto animate-fadeIn">
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Orbitani Logo" className="w-12 h-12 object-contain hover:scale-105 transition-transform" />
            <h1 className="text-2xl font-bold tracking-tight">Orbitani Edu</h1>
          </div>
          
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Selamat Datang Kembali</h2>
          <p className="text-text-secondary mb-8">Masuk untuk melanjutkan eksplorasi lahan virtual Anda.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/30"
            >
              Masuk
            </button>
          </form>
          
          <p className="text-center mt-8 text-text-secondary">
            Belum punya akun? <Link to="/register" className="text-primary font-bold hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
      
      <div className="hidden lg:flex w-1/2 bg-primary-pale items-center justify-center relative overflow-hidden">
        <div className="absolute w-[150%] h-[150%] bg-gradient-to-tr from-green-100 to-white rounded-full -top-1/4 -right-1/4 blur-3xl opacity-60"></div>
        <img src={heroImg} alt="Visual" className="relative z-10 w-3/4 max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
      </div>
    </div>
  );
};

export default LoginPage;
