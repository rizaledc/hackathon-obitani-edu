import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/logo.webp';
import PasswordStrength from '../../components/ui/PasswordStrength';
import EmailValidator from '../../components/ui/EmailValidator';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-text-primary">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24">
        <div className="max-w-md w-full mx-auto animate-fadeIn">
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Orbitani Logo" className="w-12 h-12 object-contain hover:scale-105 transition-transform" />
            <h1 className="text-2xl font-bold tracking-tight">Orbitani Edu</h1>
          </div>
          
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Daftar Akun Baru</h2>
          <p className="text-text-secondary mb-8">Isi data untuk melanjutkan eksplorasi lahan virtual Anda.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Nama Lengkap</label>
              <input 
                type="text" 
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Budi Santoso"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Alamat Email</label>
              <input 
                type="email" 
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="email@sekolah.edu"
              />
              <EmailValidator email={email} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>
            <button 
              type="submit"
              disabled={!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || !(password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[a-z]/.test(password))}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center overflow-hidden relative"
              style={{ minHeight: '52px' }}
            >
              Daftar
            </button>
          </form>
          
          <p className="text-center mt-8 text-text-secondary">
            Sudah punya akun? <Link to="/login" className="text-primary font-bold hover:underline">Masuk sekarang</Link>
          </p>
        </div>
      </div>
      
      <div className="hidden lg:flex w-1/2 bg-primary-pale items-center justify-center relative overflow-hidden">
        <div className="absolute w-[150%] h-[150%] bg-gradient-to-tr from-green-100 to-white rounded-full -top-1/4 -right-1/4 blur-3xl opacity-60"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
