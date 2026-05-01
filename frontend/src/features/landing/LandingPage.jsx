import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bg1 from "../../assets/bg1.png";
import bg2 from "../../assets/bg2.png";
import logo from "../../assets/logo.webp";
import jenistanaman from "../../assets/jenistanaman.png";

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
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Mulai
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section 
        className="relative min-h-screen flex items-center justify-end bg-cover bg-center"
        style={{ backgroundImage: `url(${bg1})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 flex justify-end items-center">
          <div className="relative z-10 max-w-2xl mr-16 text-right space-y-6">
            <div className="bg-black/30 backdrop-blur-md p-8 rounded-2xl flex flex-col items-end space-y-6 animate-fadeIn">
              <img src={logo} alt="Orbitani Logo" className="w-20 h-20 object-contain" />
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
                Platform Edukasi Pertanian Berbasis AI dan Data Satelit
              </h1>
              
              <p className="text-lg md:text-xl text-white/90">
                Orbitani Edu membantu siswa dan mahasiswa memahami analisis lahan secara real-time melalui pendekatan interaktif dan berbasis teknologi.
              </p>
              
              <p className="text-sm text-green-200 uppercase tracking-wide">
                Digunakan untuk pembelajaran agrikultur modern di sekolah dan perguruan tinggi
              </p>

              <div className="flex gap-4 justify-end w-full">
                <button 
                  onClick={() => navigate('/map')}
                  className="bg-primary text-white px-6 py-3 rounded-xl hover:scale-105 transition shadow-lg font-medium"
                >
                  Mulai Sekarang
                </button>
                <button 
                  onClick={() => document.getElementById('produk').scrollIntoView()}
                  className="border border-white/40 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition font-medium"
                >
                  Lihat Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PENJELASAN PRODUK */}
      <section id="produk" className="py-20 md:py-28 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center animate-slideUp">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Apa itu Orbitani Edu?
              </h2>
              <div className="mb-6">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                  Didukung AI
                </span>
                <div className="text-3xl font-bold text-primary leading-tight">
                  Lebih dari 22 jenis tanaman dapat dianalisis secara otomatis
                </div>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Orbitani Edu adalah platform virtual laboratory yang dirancang untuk membantu proses pembelajaran agrikultur melalui pemanfaatan data satelit dan kecerdasan buatan.
              </p>

              {/* GRID 22 TANAMAN */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {["Padi", "Jagung", "Kedelai", "Bawang", "Cabai", "Tomat", "Kopi", "Kakao"].map((item, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden hover:scale-105 transition duration-300 shadow-md h-24">
                    <img src={jenistanaman} alt={item} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-2">
                      <span className="text-white text-xs font-medium">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center md:justify-end animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <img 
                src={bg2} 
                alt="Penjelasan Produk Orbitani Edu" 
                className="rounded-2xl shadow-xl hover:scale-105 transition duration-300 w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: KEUNGGULAN (TANPA ICON) */}
      <section className="py-20 md:py-28 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-slideUp">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fitur Utama Platform</h2>
            <p className="text-lg text-gray-600">Dirancang untuk pembelajaran agrikultur modern berbasis teknologi</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-green-50 border border-green-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition duration-300 animate-slideUp">
              <div className="h-1 w-12 bg-primary rounded-full mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Analisis Lahan Real-Time</h3>
              <p className="text-gray-600 leading-relaxed">
                Dapatkan diagnosis langsung tentang probabilitas keberhasilan tanam dengan metrik cuaca dan parameter lainnya secara seketika.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-green-50 border border-green-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition duration-300 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="h-1 w-12 bg-primary rounded-full mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pendamping AI untuk Pembelajaran</h3>
              <p className="text-gray-600 leading-relaxed">
                Berinteraksi dengan asisten kecerdasan buatan yang bertindak sebagai pakar untuk menjelaskan risiko tanaman dan rekomendasi agrikultur.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-green-50 border border-green-100 shadow-md hover:-translate-y-2 hover:shadow-xl transition duration-300 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="h-1 w-12 bg-primary rounded-full mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Integrasi Data Satelit</h3>
              <p className="text-gray-600 leading-relaxed">
                Memanfaatkan teknologi satelit terkini untuk mengumpulkan parameter curah hujan, vegetasi, dan klasifikasi jenis tanah dengan akurat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: EDUKASI (BARU) */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideUp">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Manfaat untuk Pembelajaran
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span className="text-lg text-gray-700 leading-relaxed">Membantu memahami kondisi lahan secara nyata</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span className="text-lg text-gray-700 leading-relaxed">Menghubungkan teori dengan data lapangan</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span className="text-lg text-gray-700 leading-relaxed">Mendukung pembelajaran berbasis teknologi</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                  <span className="text-lg text-gray-700 leading-relaxed">Simulasi analisis tanpa biaya mahal</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-100 rounded-2xl p-12 h-full flex items-center justify-center animate-slideUp border border-green-200">
              <div className="text-center">
                <div className="text-6xl font-bold text-green-600 mb-4">100%</div>
                <div className="text-xl text-green-800 font-medium">Praktis & Aplikatif</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: IMPACT (BARU) */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-green-50 rounded-xl p-8 md:p-16 animate-slideUp border border-green-100">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Dampak dan Implementasi
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-4">
                <div className="h-2 w-12 bg-primary mx-auto rounded-full mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pendidikan Inklusif</h3>
                <p className="text-gray-600 leading-relaxed">Mendukung pendidikan di wilayah 3T secara merata</p>
              </div>
              <div className="p-4">
                <div className="h-2 w-12 bg-primary mx-auto rounded-full mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Efisiensi Biaya</h3>
                <p className="text-gray-600 leading-relaxed">Mengurangi ketergantungan pada alat laboratorium yang mahal</p>
              </div>
              <div className="p-4">
                <div className="h-2 w-12 bg-primary mx-auto rounded-full mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Kesiapan Industri</h3>
                <p className="text-gray-600 leading-relaxed">Meningkatkan literasi teknologi pertanian untuk masa depan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: TARGET PENGGUNA */}
      <section className="py-20 md:py-28 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center animate-slideUp">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
            Dirancang untuk Dunia Pendidikan
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
            <div className="text-xl font-medium text-gray-700 bg-white px-8 py-4 rounded-lg w-full md:w-auto shadow-sm border border-gray-100">
              Siswa SMK Pertanian
            </div>
            <div className="text-xl font-medium text-gray-700 bg-white px-8 py-4 rounded-lg w-full md:w-auto shadow-sm border border-gray-100">
              Mahasiswa Agrikultur
            </div>
            <div className="text-xl font-medium text-gray-700 bg-white px-8 py-4 rounded-lg w-full md:w-auto shadow-sm border border-gray-100">
              Dosen dan Institusi Pendidikan
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CTA AKHIR */}
      <section className="py-20 md:py-28 bg-gray-900 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10 animate-slideUp">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Mulai eksplorasi lahan Anda sekarang
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Gunakan teknologi modern untuk memahami pertanian secara lebih mendalam.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => navigate('/map')}
              className="bg-primary text-white px-8 py-4 rounded-xl hover:scale-105 transition shadow-lg font-bold text-lg w-full sm:w-auto"
            >
              Masuk ke Platform
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-transparent border border-white/40 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition font-bold text-lg w-full sm:w-auto"
            >
              Daftar Institusi
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-950 py-10 border-t border-gray-800 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img src={logo} alt="Orbitani Logo" className="w-6 h-6 grayscale opacity-50" />
          <span className="font-bold tracking-widest uppercase text-gray-400">Orbitani Edu</span>
        </div>
        &copy; {new Date().getFullYear()} Telkom University - Hackathon Project. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
};

export default LandingPage;
