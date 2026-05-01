import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
              onClick={() => navigate('/register')}
              className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl shadow-md hover:scale-105 font-medium text-sm transition"
            >
              Daftar
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 pt-20">
        <div className="absolute w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30 top-10 left-10" />
        <div className="absolute w-96 h-96 bg-green-300 rounded-full blur-3xl opacity-20 bottom-10 right-10" />
        
        <div className="relative z-10 max-w-3xl text-center space-y-6 px-6 animate-fadeIn">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Orbitani Logo" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            Platform Edukasi Pertanian Berbasis Kecerdasan Buatan dan Data Satelit
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600">
            Orbitani Edu membantu siswa dan mahasiswa memahami analisis lahan secara real-time melalui pendekatan interaktif dan berbasis teknologi.
          </p>
          
          <p className="text-sm text-green-700 uppercase tracking-wide font-bold">
            Digunakan untuk pembelajaran agrikultur modern di sekolah dan perguruan tinggi
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <button 
              onClick={() => navigate('/map')}
              className="bg-primary text-white px-8 py-4 rounded-xl shadow-md hover:scale-105 transition font-bold text-lg w-full sm:w-auto"
            >
              Mulai Sekarang
            </button>
            <button 
              onClick={() => document.getElementById('produk').scrollIntoView()}
              className="bg-white text-primary border border-primary px-8 py-4 rounded-xl shadow-md hover:scale-105 transition font-bold text-lg w-full sm:w-auto"
            >
              Gunakan Demo
            </button>
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
              <div className="w-full aspect-video bg-white rounded-2xl shadow-xl flex items-center justify-center p-8 hover:scale-105 transition duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <img src={logo} alt="Orbitani Edu" className="w-8 h-8 object-contain" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Platform Interaktif</h3>
                  <p className="text-gray-500">Visualisasi data satelit dan analisis AI secara real-time.</p>
                </div>
              </div>
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">Asisten AI untuk Pembelajaran</h3>
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
              Mulai Sekarang
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-xl hover:bg-gray-50 transition shadow-lg font-bold text-lg w-full sm:w-auto"
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
