import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Globe } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import logo from '../../assets/logo.webp';
import OrbitaniLoader from '../../components/OrbitaniLoader';
import EmailValidator from '../../components/ui/EmailValidator';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canLogin = username.trim() && password.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/map');
    } catch (err) {
      setError('Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-text-primary">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12 lg:py-0">
        <div className="max-w-md w-full mx-auto animate-fadeIn">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-8 w-fit bg-gray-50 px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={16} />
            <span className="font-medium text-sm">Kembali ke Beranda</span>
          </button>

          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="Orbitani Logo" className="w-12 h-12 object-contain hover:scale-105 transition-transform" />
            <h1 className="text-2xl font-bold tracking-tight">Orbitani Edu</h1>
          </div>
          
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">Masuk ke Platform</h2>
          <p className="text-text-secondary mb-8">Masuk untuk melanjutkan eksplorasi lahan virtual Anda.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold mb-2">Username / Email</label>
              <input 
                type="text" 
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Username atau Email"
              />
              {username && username.includes('@') && <EmailValidator email={username} />}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Kata Sandi</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  autoComplete="current-password"
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
            </div>
            <button 
              type="submit"
              disabled={loading || !canLogin || (username.includes('@') && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)))}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:scale-105 transition-transform shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center overflow-hidden relative"
              style={{ minHeight: '52px' }}
            >
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center scale-50 origin-center">
                  <OrbitaniLoader status="processing" size="sm" />
                </div>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
          
          <p className="text-center mt-8 text-text-secondary">
            Belum punya akun? <Link to="/register" className="text-primary font-bold hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
      
      <div className="hidden lg:flex w-1/2 bg-green-50 items-center justify-center relative overflow-hidden">
        {/* Dot Matrix Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{
            backgroundImage: `radial-gradient(circle, #22c55e 2px, transparent 2px)`,
            backgroundSize: '24px 24px'
          }}
        ></div>
        
        {/* Soft background glow */}
        <div className="absolute w-[150%] h-[150%] bg-gradient-to-tr from-green-100/50 to-transparent rounded-full -top-1/4 -right-1/4 blur-3xl opacity-60"></div>

        {/* Floating Glassmorphism Card */}
        <div className="relative z-10 p-10 bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl max-w-md animate-float mx-8">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green-600 mb-6 shadow-sm">
            <Globe size={28} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Praktikum Tanpa Batas</h3>
          <p className="text-gray-700 leading-relaxed font-medium">
            "Didukung oleh data satelit real-time dari Google Earth Engine, kami membawa laboratorium agrikultur langsung ke layar Anda."
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
