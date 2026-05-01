import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/hero.png';
import logo from '../../assets/logo.webp';
import { ArrowRight, PlayCircle, ShieldCheck, WarningCircle, CheckCircle, Crosshair, MapTrifold, ChartBar } from '@phosphor-icons/react';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
    return () => document.documentElement.classList.remove('scroll-smooth');
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-text-primary overflow-x-hidden selection:bg-primary-pale selection:text-primary">
      {/* NAVBAR MINIMAL */}
      <nav className="fixed w-full top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={logo} alt="Orbitani Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Orbitani Edu</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-text-secondary hover:text-primary transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/map')}
              className="bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md hover:scale-105 transition-all"
            >
              Mulai Eksplorasi
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fadeIn flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-primary-pale border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase">
              <ShieldCheck size={16} weight="bold" />
              Powered by AI + Satellite Data
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Revolusi Edukasi Pertanian dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">AI & Data Satelit</span>
            </h1>
            
            <p className="text-lg text-text-secondary mb-4 leading-relaxed max-w-xl">
              Orbitani Edu adalah platform virtual laboratory yang membantu siswa dan institusi memahami analisis lahan secara real-time.
            </p>
            
            <p className="text-sm font-semibold text-gray-500 mb-10 border-l-2 border-primary pl-3">
              Untuk Sekolah, Kampus, dan Dinas Pertanian
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/map')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
              >
                Mulai Eksplorasi <ArrowRight size={20} weight="bold" />
              </button>
              <button 
                onClick={() => document.getElementById('demo').scrollIntoView()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all"
              >
                <PlayCircle size={24} weight="fill" className="text-primary" />
                Lihat Demo
              </button>
            </div>
          </div>
          
          <div className="relative animate-slideUp flex justify-center lg:justify-end mt-10 lg:mt-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-green-100 to-white rounded-full blur-3xl opacity-70 -z-10"></div>
            <img 
              src={heroImg} 
              alt="Hero Illustration" 
              className="w-full max-w-lg lg:max-w-xl relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: PROBLEM -> SOLUTION */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mengapa Beralih ke Orbitani Edu?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Tinggalkan metode konvensional, mulai gunakan teknologi presisi.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* PROBLEM */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-red-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <WarningCircle size={24} weight="bold" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Masalah Konvensional</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="text-xl">❌</span>
                  <div>
                    <strong className="block text-gray-900 font-bold text-lg">Akses teknologi mahal</strong>
                    <span className="text-text-secondary text-sm block mt-1">Alat lab fisik membutuhkan investasi miliaran rupiah.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">❌</span>
                  <div>
                    <strong className="block text-gray-900 font-bold text-lg">Data sulit dipahami</strong>
                    <span className="text-text-secondary text-sm block mt-1">Data mentah dari lapangan butuh ekspertise khusus.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">❌</span>
                  <div>
                    <strong className="block text-gray-900 font-bold text-lg">Edukasi tidak kontekstual</strong>
                    <span className="text-text-secondary text-sm block mt-1">Teori tanpa praktik nyata dengan kondisi geografis lokal.</span>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* SOLUTION */}
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-primary/5 border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 rounded-bl-[100px]"></div>
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-primary">
                  <CheckCircle size={24} weight="fill" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Solusi Orbitani Edu</h3>
              </div>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-start gap-4">
                  <span className="text-xl">✅</span>
                  <div>
                    <strong className="block text-gray-900 font-bold text-lg">Analisis berbasis AI</strong>
                    <span className="text-text-secondary text-sm block mt-1">Rekomendasi tanaman disajikan dengan insight dari Pakar AI.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">✅</span>
                  <div>
                    <strong className="block text-gray-900 font-bold text-lg">Data satelit real-time</strong>
                    <span className="text-text-secondary text-sm block mt-1">Ambil data lokasi mana saja di Indonesia dalam hitungan detik.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-xl">✅</span>
                  <div>
                    <strong className="block text-gray-900 font-bold text-lg">Interaktif & edukatif</strong>
                    <span className="text-text-secondary text-sm block mt-1">Cocok untuk kurikulum lab presisi di sekolah dan kampus.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURE HIGHLIGHT */}
      <section className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Utama</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">Eksplorasi modul canggih yang siap mendukung pembelajaran.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-primary-pale text-primary flex items-center justify-center rounded-2xl mb-6">
              <MapTrifold size={32} weight="duotone" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Analisis Lahan Interaktif</h3>
            <p className="text-text-secondary leading-relaxed">Pilih titik manapun di peta dan dapatkan diagnosis langsung tentang probabilitas keberhasilan tanam.</p>
          </div>
          
          <div className="bg-white p-10 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 flex items-center justify-center rounded-2xl mb-6">
              <ChartBar size={32} weight="duotone" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">AI Decision Assistant</h3>
            <p className="text-text-secondary leading-relaxed">Berinteraksi dengan AI yang bertindak sebagai pakar untuk menjelaskan metrik cuaca dan risiko tanaman.</p>
          </div>
          
          <div className="bg-white p-10 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-purple-50 text-purple-500 flex items-center justify-center rounded-2xl mb-6">
              <Crosshair size={32} weight="duotone" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Integrasi Data Satelit</h3>
            <p className="text-text-secondary leading-relaxed">Memanfaatkan teknologi satelit untuk parameter curah hujan, NDVI, dan klasifikasi jenis tanah.</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: DEMO PREVIEW */}
      <section id="demo" className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lihat bagaimana sistem bekerja secara real-time</h2>
          <p className="text-text-secondary mb-12">UI map canggih yang dirancang khusus untuk kenyamanan laboratorium.</p>
          
          <div className="max-w-5xl mx-auto bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mb-12 flex flex-col group relative">
            <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            
            <div className="flex flex-col md:flex-row h-auto md:h-[450px]">
              <div className="hidden md:block w-56 bg-white border-r border-gray-200 p-6 flex-shrink-0">
                <div className="flex items-center gap-2 mb-8">
                  <img src={logo} className="w-6 h-6" />
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-full h-10 bg-primary-pale rounded mb-4"></div>
                <div className="w-3/4 h-8 bg-gray-100 rounded mb-2"></div>
                <div className="w-1/2 h-8 bg-gray-100 rounded mb-2"></div>
              </div>
              
              <div className="flex-1 bg-green-50 relative p-8 flex items-center justify-center overflow-hidden min-h-[300px]">
                <div className="absolute w-full h-full opacity-20" style={{ backgroundImage: 'radial-gradient(#16a34a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="relative z-10 w-12 h-12 text-primary group-hover:-translate-y-4 transition-transform duration-500">
                  <MapTrifold size={48} weight="fill" />
                </div>
                
                {/* Fake floating recommendation panel */}
                <div className="absolute right-6 top-6 w-72 bg-white rounded-2xl shadow-xl p-6 text-left border border-gray-100 transform translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-4 w-2/3 bg-green-100 rounded"></div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded mb-2"></div>
                  <div className="h-2 w-5/6 bg-gray-100 rounded mb-6"></div>
                  <div className="h-20 w-full bg-primary-pale rounded-xl border border-primary/20 relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-3/4 bg-primary/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/map')}
            className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-xl hover:scale-105"
          >
            Coba Sekarang
          </button>
        </div>
      </section>

      {/* SECTION 5: CTA FINAL */}
      <section className="bg-gray-900 py-32 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Mulai eksplorasi lahan Anda sekarang</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg md:text-xl">
            Bergabunglah dengan institusi yang telah merasakan kemudahan laboratorium virtual dalam 1 klik.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="bg-primary hover:bg-primary-light text-white px-12 py-5 rounded-full font-bold text-xl shadow-[0_0_40px_rgba(22,163,74,0.4)] hover:shadow-[0_0_60px_rgba(22,163,74,0.6)] transition-all hover:scale-105"
          >
            Mulai Gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 py-10 border-t border-gray-800 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={logo} alt="Orbitani Logo" className="w-6 h-6 grayscale opacity-50" />
          <span className="font-bold tracking-widest uppercase">Orbitani Edu</span>
        </div>
        &copy; {new Date().getFullYear()} Telkom University - Hackathon Project. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
