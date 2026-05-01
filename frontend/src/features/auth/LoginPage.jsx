import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import logo from '../../assets/logo.webp';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSubmit = (e) => {
    e.preventDefault();
    login('dummy-token', {
      id: 1,
      username: 'Demo User',
      role: role
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
          
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Masuk ke Platform</h2>
          <p className="text-text-secondary mb-8">Masuk untuk melanjutkan eksplorasi lahan virtual Anda.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Alamat Email</label>
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
              <label className="block text-sm font-semibold mb-2">Kata Sandi</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Pilih Role (Demo)</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-md"
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
      </div>
    </div>
  );
};

export default LoginPage;
