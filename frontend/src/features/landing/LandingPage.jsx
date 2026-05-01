import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.webp";
import jenistanaman from "../../assets/jenistanaman.webp";
import bg2 from "../../assets/bg2.webp";

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
      <section className="relative min-h-screen flex items-center justify-center md:justify-end bg-cover bg-center px-10 animate-fadeIn" style={{ backgroundImage: `url(${bg2})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 max-w-2xl bg-white/80 backdrop-blur p-10 rounded-2xl shadow-xl text-left space-y-6 mr-0 md:mr-16 hover:scale-[1.01] transition duration-500">
          <div className="inline-block bg-white border border-green-200 text-green-700 font-bold px-4 py-1.5 rounded-full text-sm shadow-sm">
            AI · Data Satelit · Edukasi Digital
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Transformasi Pembelajaran Pertanian dengan Teknologi Geospasial
          </h1>
          
          <p className="text-base text-gray-700 leading-relaxed">
            Orbitani Edu adalah platform virtual laboratory berbasis kecerdasan buatan dan data satelit yang dirancang untuk membantu siswa, mahasiswa, dan institusi pendidikan memahami analisis lahan secara real-time dan interaktif. Mendukung pembelajaran agrikultur modern melalui pendekatan berbasis data dan teknologi.
          </p>
          
          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => navigate('/map')}
              className="bg-primary hover:bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 transition font-bold text-lg w-full sm:w-auto text-center"
            >
              Mulai Eksplorasi
            </button>
            <button 
              onClick={() => document.getElementById('solusi').scrollIntoView()}
              className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl shadow-sm hover:bg-gray-50 hover:scale-105 transition font-bold text-lg w-full sm:w-auto text-center"
            >
              Lihat Demo
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATISTIK */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 animate-slideUp">
            <div className="bg-green-50 p-6 rounded-xl text-center shadow-sm border border-green-100">
              <div className="text-4xl font-extrabold text-primary mb-2">22+</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Rekomendasi Tanaman</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center shadow-sm border border-green-100">
              <div className="text-4xl font-extrabold text-primary mb-2">10+</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Wilayah Studi</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center shadow-sm border border-green-100">
              <div className="text-4xl font-extrabold text-primary mb-2">Real-time</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Data Satelit</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center shadow-sm border border-green-100">
              <div className="text-4xl font-extrabold text-primary mb-2">AI</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Analisis Cerdas</div>
            </div>
            <div className="bg-green-50 p-6 rounded-xl text-center shadow-sm border border-green-100">
              <div className="text-4xl font-extrabold text-primary mb-2">99%</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Stabilitas Sistem</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TENTANG ORBITANI EDU / EDUKASI */}
      <section id="tentang" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 animate-slideUp">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* KIRI (TEXT) */}
            <div className="flex-1 text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Membangun Masa Depan Edukasi Pertanian Digital
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Orbitani Edu dikembangkan sebagai solusi pembelajaran berbasis teknologi untuk menjawab tantangan keterbatasan akses terhadap alat analisis pertanian modern. Dengan memanfaatkan data satelit dan kecerdasan buatan, platform ini menghadirkan pengalaman belajar yang lebih kontekstual, interaktif, dan relevan dengan kondisi nyata di lapangan.
              </p>
            </div>

            {/* KANAN (IMAGE) */}
            <div className="flex-1 flex justify-center md:justify-end">
              <img 
                src={jenistanaman} 
                alt="Jenis Tanaman"
                className="rounded-2xl shadow-lg w-full max-w-md hover:scale-105 transition duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. NILAI UTAMA */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-left mb-10 animate-slideUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Nilai Utama Pembelajaran</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left animate-slideUp">
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
      <section id="solusi" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-left mb-10 animate-slideUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Fitur Unggulan Platform</h2>
            <p className="text-gray-600">Dirancang untuk pembelajaran agrikultur modern berbasis teknologi</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 animate-slideUp">
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition text-left">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Analisis Lahan Interaktif</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Melakukan eksplorasi dan pemetaan lahan menggunakan WebGIS berbasis data satelit secara real-time.
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition text-left" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Asisten Pembelajaran Berbasis AI</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Menyediakan penjelasan kontekstual mengenai kondisi lahan dan rekomendasi tanaman secara edukatif.
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition text-left" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Infrastruktur Aman & Terintegrasi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Seluruh data diproses dalam sistem cloud yang stabil dan terstruktur untuk kebutuhan pembelajaran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CARA KERJA PLATFORM */}
      <section id="carakerja" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-left animate-slideUp mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Alur Penggunaan Sistem</h2>
            <p className="text-gray-600">Langkah mudah mengeksplorasi platform</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between mt-10 gap-6 animate-slideUp text-center">
            <div className="max-w-xs">
              <div className="text-3xl font-bold text-primary mb-3">01</div>
              <h3 className="font-semibold text-gray-900 mb-2">Eksplorasi Lahan</h3>
              <p className="text-sm text-gray-600">Pengguna memilih lokasi melalui peta interaktif.</p>
            </div>
            
            <div className="hidden md:block w-16 h-[2px] bg-green-200"></div>
            
            <div className="max-w-xs">
              <div className="text-3xl font-bold text-primary mb-3">02</div>
              <h3 className="font-semibold text-gray-900 mb-2">Integrasi Data</h3>
              <p className="text-sm text-gray-600">Sistem mengambil data satelit seperti vegetasi, curah hujan, dan kondisi tanah.</p>
            </div>
            
            <div className="hidden md:block w-16 h-[2px] bg-green-200"></div>
            
            <div className="max-w-xs">
              <div className="text-3xl font-bold text-primary mb-3">03</div>
              <h3 className="font-semibold text-gray-900 mb-2">Analisis AI</h3>
              <p className="text-sm text-gray-600">Model AI memproses data untuk menghasilkan rekomendasi tanaman.</p>
            </div>
            
            <div className="hidden md:block w-16 h-[2px] bg-green-200"></div>
            
            <div className="max-w-xs">
              <div className="text-3xl font-bold text-primary mb-3">04</div>
              <h3 className="font-semibold text-gray-900 mb-2">Insight Edukatif</h3>
              <p className="text-sm text-gray-600">Pengguna mendapatkan penjelasan dan hasil analisis sebagai bahan pembelajaran.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TEKNOLOGI */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-left animate-slideUp">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Teknologi di Balik Platform</h2>
          <p className="text-gray-600 max-w-2xl mb-10">
            Platform ini memanfaatkan teknologi modern untuk mengolah data geospasial menjadi informasi edukatif yang mudah dipahami.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md transition">
              <div className="font-bold text-gray-700">Google Earth Engine</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md transition">
              <div className="font-bold text-gray-700">Microsoft Azure Cloud</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md transition">
              <div className="font-bold text-gray-700">Model Machine Learning</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md transition">
              <div className="font-bold text-gray-700">Integrasi AI Generatif</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TARGET PENGGUNA */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-left animate-slideUp">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Dirancang untuk Dunia Pendidikan
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="bg-green-50 px-6 py-8 rounded-2xl shadow-sm border border-green-100 font-bold text-gray-800 text-lg hover:-translate-y-2 transition">
              Siswa SMK Pertanian
            </div>
            <div className="bg-green-50 px-6 py-8 rounded-2xl shadow-sm border border-green-100 font-bold text-gray-800 text-lg hover:-translate-y-2 transition">
              Mahasiswa Agrikultur
            </div>
            <div className="bg-green-50 px-6 py-8 rounded-2xl shadow-sm border border-green-100 font-bold text-gray-800 text-lg hover:-translate-y-2 transition">
              Dosen dan Peneliti
            </div>
            <div className="bg-green-50 px-6 py-8 rounded-2xl shadow-sm border border-green-100 font-bold text-gray-800 text-lg hover:-translate-y-2 transition">
              Institusi Pendidikan dan Dinas
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER BARU (MINIMALIS) */}
      <div className="border-t border-gray-200 mt-20"></div>
      <footer className="bg-gray-900 text-center py-6">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Telkom University - ORBITANI EDU - Hackathon Project. Hak Cipta Dilindungi.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
