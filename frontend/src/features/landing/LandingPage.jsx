import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bg1 from "../../assets/bg1.png";
import bg2 from "../../assets/bg2.png";
import logo from "../../assets/logo.webp";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
    return () => document.documentElement.classList.remove('scroll-smooth');
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* NAVBAR MINIMAL */}
      <nav className="fixed w-full top-0 bg-white/80 backdrop-blur border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={logo} alt="Orbitani Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Orbitani Edu</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Masuk
            </button>
            <button 
              onClick={() => navigate('/map')}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Mulai
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center pt-20"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white flex flex-col items-center space-y-6">
          <img src={logo} alt="Orbitani Logo" className="w-20 h-20 object-contain mb-4" />
          
          <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl">
            Platform Edukasi Pertanian Berbasis AI dan Data Satelit
          </h1>
          
          <p className="text-lg md:text-xl text-gray-100 max-w-3xl leading-relaxed">
            Orbitani Edu membantu siswa dan mahasiswa memahami analisis lahan secara real-time melalui pendekatan interaktif dan berbasis teknologi.
          </p>
          
          <p className="text-sm font-medium text-gray-300 tracking-wide uppercase">
            Digunakan untuk pembelajaran agrikultur modern di sekolah dan perguruan tinggi
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button 
              onClick={() => navigate('/map')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors w-full sm:w-auto"
            >
              Mulai Sekarang
            </button>
            <button 
              onClick={() => document.getElementById('produk').scrollIntoView()}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors w-full sm:w-auto"
            >
              Lihat Demo
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: PENJELASAN PRODUK */}
      <section id="produk" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Apa itu Orbitani Edu?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Orbitani Edu adalah platform virtual laboratory yang dirancang untuk membantu proses pembelajaran agrikultur melalui pemanfaatan data satelit dan kecerdasan buatan.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <img 
                src={bg2} 
                alt="Penjelasan Produk Orbitani Edu" 
                className="w-full h-auto rounded-xl shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: KEUNGGULAN (TANPA ICON) */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Analisis Lahan Real-Time</h3>
              <p className="text-gray-600 leading-relaxed">
                Dapatkan diagnosis langsung tentang probabilitas keberhasilan tanam dengan metrik cuaca dan parameter lainnya secara seketika.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pendamping AI untuk Pembelajaran</h3>
              <p className="text-gray-600 leading-relaxed">
                Berinteraksi dengan asisten kecerdasan buatan yang bertindak sebagai pakar untuk menjelaskan risiko tanaman dan rekomendasi agrikultur.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Integrasi Data Satelit</h3>
              <p className="text-gray-600 leading-relaxed">
                Memanfaatkan teknologi satelit terkini untuk mengumpulkan parameter curah hujan, vegetasi, dan klasifikasi jenis tanah dengan akurat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TARGET PENGGUNA */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Dirancang untuk Dunia Pendidikan
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
            <div className="text-xl font-medium text-gray-700 bg-gray-50 px-8 py-4 rounded-lg w-full md:w-auto">
              Siswa SMK Pertanian
            </div>
            <div className="text-xl font-medium text-gray-700 bg-gray-50 px-8 py-4 rounded-lg w-full md:w-auto">
              Mahasiswa Agrikultur
            </div>
            <div className="text-xl font-medium text-gray-700 bg-gray-50 px-8 py-4 rounded-lg w-full md:w-auto">
              Dosen dan Institusi Pendidikan
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA AKHIR */}
      <section className="py-20 bg-gray-900 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Mulai eksplorasi lahan Anda sekarang
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Gunakan teknologi modern untuk memahami pertanian secara lebih mendalam.
          </p>
          <button 
            onClick={() => navigate('/map')}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-lg font-bold text-lg transition-colors"
          >
            Masuk ke Platform
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-950 py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-bold tracking-widest uppercase">Orbitani Edu</span>
        </div>
        &copy; {new Date().getFullYear()} Telkom University - Hackathon Project. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
};

export default LandingPage;
