import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/logo.webp';
import PasswordStrength from '../../components/ui/PasswordStrength';
import EmailValidator from '../../components/ui/EmailValidator';
import { CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

// Fungsi encode/decode org ID ke kode
const encodeOrgId = (id) => {
  return 'ORB-' + String(id).padStart(5, '0');
};

const decodeOrgCode = (code) => {
  const match = code.match(/^ORB-(\d+)$/);
  if (!match) return null;
  return parseInt(match[1]);
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [orgCode, setOrgCode] = useState('');
  const [orgCodeStatus, setOrgCodeStatus] = useState(null);

  const handleOrgCode = async (val) => {
    setOrgCode(val.toUpperCase());
    if (!val) {
      setOrgCodeStatus(null);
      return;
    }
    
    const orgId = decodeOrgCode(val.toUpperCase());
    if (!orgId) {
      setOrgCodeStatus('invalid');
      return;
    }
    
    try {
      const res = await api.get(`/api/organizations/${orgId}`);
      if (res.data?.nama || res.data?.name) {
        setOrgCodeStatus({ id: orgId, nama: res.data.nama || res.data.name });
      }
    } catch {
      setOrgCodeStatus('invalid');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', {
        username: email.split('@')[0],
        email: email,
        password: password,
        name: name,
        role: 'user',
        organization_id: orgCodeStatus?.id || null
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      navigate('/login');
    }
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
              <label className="block text-sm font-semibold mb-2">
                Kode Organisasi <span className="text-gray-400 text-xs ml-1">(Opsional)</span>
              </label>
              <input
                type="text"
                value={orgCode}
                onChange={e => handleOrgCode(e.target.value)}
                placeholder="Contoh: ORB-00001"
                autoComplete="off"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 font-mono tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {orgCodeStatus === 'invalid' && (
                <p className="text-xs text-red-500 mt-1">
                  Kode organisasi tidak valid
                </p>
              )}
              {orgCodeStatus && orgCodeStatus !== 'invalid' && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1 font-medium">
                  <CheckCircle2 size={12} />
                  Organisasi: {orgCodeStatus.nama}
                </p>
              )}
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
