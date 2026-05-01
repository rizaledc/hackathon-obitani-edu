import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.webp";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
    return () => document.documentElement.classList.remove('scroll-smooth');
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed w-full top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={logo} alt="Orbitani Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Orbitani Edu</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">Beranda</button>
            <button onClick={() => document.getElementById('tentang').scrollIntoView()} className="hover:text-primary transition-colors">Tentang Platform</button>
            <button onClick={() => document.getElementById('solusi').scrollIntoView()} className="hover:text-primary transition-colors">Solusi</button>
            <button onClick={() => document.getElementById('carakerja').scrollIntoView()} className="hover:text-primary transition-colors">Cara Kerja</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-bold text-gray-700 hover:text-primary transition-colors"
            >
              Masuk
            </button>
            <button 
              onClick={() => navigate('/map')}
              className="bg-primary hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 font-bold text-sm transition"
            >
              Mulai Eksplorasi
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 pt-20">
        <div className="absolute w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30 top-20 left-10" />
        <div className="absolute w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-20 bottom-10 right-10" />
        
        <div className="relative z-10 max-w-4xl text-center space-y-8 px-6 animate-fadeIn">
          <div className="inline-block bg-white border border-green-200 text-green-700 font-bold px-4 py-1.5 rounded-full text-sm shadow-sm">
            AI · Data Satelit · Edukasi Digital
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            Transformasi Pembelajaran Pertanian dengan Teknologi Geospasial
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Orbitani Edu adalah platform virtual laboratory berbasis kecerdasan buatan dan data satelit yang dirancang untuk membantu siswa, mahasiswa, dan institusi pendidikan memahami analisis lahan secara real-time dan interaktif.
          </p>
          
          <p className="text-base text-gray-500 font-medium">
            Mendukung pembelajaran agrikultur modern melalui pendekatan berbasis data dan teknologi.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <button 
              onClick={() => navigate('/map')}
              className="bg-primary hover:bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition font-bold text-lg w-full sm:w-auto"
            >
              Mulai Eksplorasi
            </button>
            <button 
              onClick={() => document.getElementById('solusi').scrollIntoView()}
              className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl shadow-sm hover:bg-gray-50 hover:scale-105 transition font-bold text-lg w-full sm:w-auto"
            >
              Lihat Demo
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-slideUp">
            <div>
              <div className="text-4xl font-extrabold text-primary mb-2">10+</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Wilayah Studi Terintegrasi</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary mb-2">Real-time</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Data Satelit Diproses</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary mb-2">AI</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Rekomendasi Pembelajaran Cerdas</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-primary mb-2">99%</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Stabilitas Sistem</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TENTANG ORBITANI EDU */}
      <section id="tentang" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center animate-slideUp">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Membangun Masa Depan Edukasi Pertanian Digital
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Orbitani Edu dikembangkan sebagai solusi pembelajaran berbasis teknologi untuk menjawab tantangan keterbatasan akses terhadap alat analisis pertanian modern. Dengan memanfaatkan data satelit dan kecerdasan buatan, platform ini menghadirkan pengalaman belajar yang lebih kontekstual, interaktif, dan relevan dengan kondisi nyata di lapangan.
          </p>
        </div>
      </section>

      {/* 4. NILAI UTAMA */}
      <section className="py-20 md:py-28 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100 hover:-translate-y-2 transition duration-300">
              <div className="h-2 w-12 bg-primary rounded-full mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Berkelanjutan</h3>
              <p className="text-gray-600 leading-relaxed">
                Mendorong pemanfaatan sumber daya secara efisien untuk pembelajaran pertanian yang berkelanjutan.
              </p>
            </div>
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100 hover:-translate-y-2 transition duration-300">
              <div className="h-2 w-12 bg-primary rounded-full mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Inovatif</h3>
              <p className="text-gray-600 leading-relaxed">
                Menggunakan pendekatan kecerdasan buatan untuk meningkatkan kualitas pemahaman mahasiswa.
              </p>
            </div>
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100 hover:-translate-y-2 transition duration-300">
              <div className="h-2 w-12 bg-primary rounded-full mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Berbasis Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Menggunakan data satelit untuk memberikan gambaran kondisi lahan secara nyata.
              </p>
            </div>
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100 hover:-translate-y-2 transition duration-300">
              <div className="h-2 w-12 bg-primary rounded-full mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Kolaboratif</h3>
              <p className="text-gray-600 leading-relaxed">
                Mendukung penggunaan oleh institusi pendidikan, dosen, dan mahasiswa secara bersama.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SOLUSI PLATFORM */}
      <section id="solusi" className="py-20 md:py-28 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-slideUp">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Utama Platform</h2>
            <p className="text-lg text-gray-400">Solusi terintegrasi untuk analisis lahan virtual</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-primary transition duration-300 animate-slideUp">
              <div className="text-5xl font-black text-gray-700 mb-6">A</div>
              <h3 className="text-xl font-bold mb-4">Analisis Lahan Interaktif</h3>
              <p className="text-gray-400 leading-relaxed">
                Melakukan eksplorasi dan pemetaan lahan menggunakan WebGIS berbasis data satelit secara real-time.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-primary transition duration-300 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-black text-gray-700 mb-6">B</div>
              <h3 className="text-xl font-bold mb-4">Asisten Pembelajaran Berbasis AI</h3>
              <p className="text-gray-400 leading-relaxed">
                Menyediakan penjelasan kontekstual mengenai kondisi lahan dan rekomendasi tanaman secara edukatif.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-primary transition duration-300 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-black text-gray-700 mb-6">C</div>
              <h3 className="text-xl font-bold mb-4">Infrastruktur Aman dan Terintegrasi</h3>
              <p className="text-gray-400 leading-relaxed">
                Seluruh data diproses dalam sistem cloud yang stabil dan terstruktur untuk kebutuhan pembelajaran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CARA KERJA PLATFORM */}
      <section id="carakerja" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-slideUp">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Alur Penggunaan Sistem</h2>
            <p className="text-lg text-gray-600">Langkah mudah mengeksplorasi platform</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="relative animate-slideUp">
              <div className="text-6xl font-black text-gray-200 mb-4 absolute -top-8 -left-4 z-0">01</div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-3 pt-4">Eksplorasi Lahan</h3>
                <p className="text-gray-600">Pengguna memilih lokasi melalui peta interaktif.</p>
              </div>
            </div>
            <div className="relative animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="text-6xl font-black text-gray-200 mb-4 absolute -top-8 -left-4 z-0">02</div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-3 pt-4">Integrasi Data</h3>
                <p className="text-gray-600">Sistem mengambil data satelit seperti vegetasi, curah hujan, dan kondisi tanah.</p>
              </div>
            </div>
            <div className="relative animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl font-black text-gray-200 mb-4 absolute -top-8 -left-4 z-0">03</div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-3 pt-4">Analisis AI</h3>
                <p className="text-gray-600">Model AI memproses data untuk menghasilkan rekomendasi tanaman.</p>
              </div>
            </div>
            <div className="relative animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <div className="text-6xl font-black text-gray-200 mb-4 absolute -top-8 -left-4 z-0">04</div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 mb-3 pt-4">Insight Edukatif</h3>
                <p className="text-gray-600">Pengguna mendapatkan penjelasan dan hasil analisis sebagai bahan pembelajaran.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TEKNOLOGI */}
      <section className="py-20 md:py-28 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center animate-slideUp">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Teknologi di Balik Platform</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            Platform ini memanfaatkan teknologi modern untuk mengolah data geospasial menjadi informasi edukatif yang mudah dipahami.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-gray-50 border border-gray-200 px-8 py-4 rounded-xl font-bold text-gray-700 shadow-sm hover:-translate-y-1 transition">
              Google Earth Engine
            </div>
            <div className="bg-gray-50 border border-gray-200 px-8 py-4 rounded-xl font-bold text-gray-700 shadow-sm hover:-translate-y-1 transition">
              Microsoft Azure Cloud
            </div>
            <div className="bg-gray-50 border border-gray-200 px-8 py-4 rounded-xl font-bold text-gray-700 shadow-sm hover:-translate-y-1 transition">
              Model Machine Learning
            </div>
            <div className="bg-gray-50 border border-gray-200 px-8 py-4 rounded-xl font-bold text-gray-700 shadow-sm hover:-translate-y-1 transition">
              Integrasi AI Generatif
            </div>
          </div>
        </div>
      </section>

      {/* 8. TARGET PENGGUNA */}
      <section className="py-20 md:py-28 bg-green-50">
        <div className="max-w-6xl mx-auto px-6 text-center animate-slideUp">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Dirancang untuk Dunia Pendidikan
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white px-6 py-8 rounded-2xl shadow-sm border border-green-100 font-bold text-gray-800 text-lg hover:-translate-y-2 transition">
              Siswa SMK Pertanian
            </div>
            <div className="bg-white px-6 py-8 rounded-2xl shadow-sm border border-green-100 font-bold text-gray-800 text-lg hover:-translate-y-2 transition">
              Mahasiswa Agrikultur
            </div>
            <div className="bg-white px-6 py-8 rounded-2xl shadow-sm border border-green-100 font-bold text-gray-800 text-lg hover:-translate-y-2 transition">
              Dosen dan Peneliti
            </div>
            <div className="bg-white px-6 py-8 rounded-2xl shadow-sm border border-green-100 font-bold text-gray-800 text-lg hover:-translate-y-2 transition">
              Institusi Pendidikan dan Dinas
            </div>
          </div>
        </div>
      </section>

      {/* 9. CTA AKHIR */}
      <section className="py-20 md:py-28 bg-gray-900 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 animate-slideUp">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Mulai Eksplorasi Pembelajaran Pertanian Digital
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Gunakan teknologi untuk memahami kondisi lahan secara lebih mendalam dan aplikatif.
          </p>
          <button 
            onClick={() => navigate('/map')}
            className="bg-primary hover:bg-green-700 text-white px-10 py-5 rounded-xl shadow-lg hover:scale-105 transition font-bold text-xl"
          >
            Masuk ke Platform
          </button>
        </div>
      </section>
      
      {/* 10. FOOTER */}
      <footer className="bg-gray-950 pt-20 pb-10 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img src={logo} alt="Orbitani Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-2xl text-white tracking-tight">Orbitani Edu</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Platform edukasi berbasis data satelit dan kecerdasan buatan untuk mendukung pembelajaran agrikultur modern.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Platform</h4>
              <ul className="space-y-4">
                <li><button onClick={() => navigate('/map')} className="text-gray-400 hover:text-white transition">Eksplorasi Lahan</button></li>
                <li><button onClick={() => navigate('/chat')} className="text-gray-400 hover:text-white transition">Asisten AI</button></li>
                <li><button onClick={() => navigate('/analytics')} className="text-gray-400 hover:text-white transition">Laporan Analisis</button></li>
                <li><button onClick={() => navigate('/history')} className="text-gray-400 hover:text-white transition">Riwayat Data</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Navigasi</h4>
              <ul className="space-y-4">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-400 hover:text-white transition">Beranda</button></li>
                <li><button onClick={() => document.getElementById('solusi').scrollIntoView()} className="text-gray-400 hover:text-white transition">Solusi</button></li>
                <li><button onClick={() => document.getElementById('carakerja').scrollIntoView()} className="text-gray-400 hover:text-white transition">Cara Kerja</button></li>
                <li><button onClick={() => document.getElementById('tentang').scrollIntoView()} className="text-gray-400 hover:text-white transition">Tentang</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wide">Bantuan</h4>
              <ul className="space-y-4">
                <li><button className="text-gray-400 hover:text-white transition">Pusat Bantuan</button></li>
                <li><button onClick={() => navigate('/login')} className="text-gray-400 hover:text-white transition">Login Pengguna</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <div>&copy; {new Date().getFullYear()} Telkom University - Hackathon Project. Hak Cipta Dilindungi.</div>
            <div className="font-bold tracking-widest uppercase">Orbitani Edu</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
