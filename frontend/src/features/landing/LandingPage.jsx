import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/hero.png';
import { ArrowRight, PlayCircle } from '@phosphor-icons/react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-text-primary selection:bg-primary-pale selection:text-primary overflow-x-hidden">
      {/* Navbar Minimalis */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🛰️</span>
          <span className="font-bold text-xl tracking-tight text-gray-900">Orbitani Edu</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          Masuk Dashboard
        </button>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slideUp flex flex-col items-start text-left">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary-pale border border-primary/20 text-primary text-sm font-bold tracking-wide shadow-sm">
              Virtual Laboratory for Precision Agriculture Education
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
              Orbitani <span className="text-primary">Edu</span>
            </h1>
            <p className="text-lg text-text-secondary mb-10 leading-relaxed max-w-lg">
              Platform edukasi berbasis teknologi satelit dan AI untuk membantu analisis lahan pertanian secara cerdas dan real-time.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => navigate('/map')}
                className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-1"
              >
                Mulai Eksplorasi <ArrowRight size={20} weight="bold" />
              </button>
              <button 
                onClick={() => navigate('/map')}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:bg-gray-50 shadow-sm"
              >
                <PlayCircle size={24} weight="fill" className="text-gray-400" />
                Gunakan Demo
              </button>
            </div>
          </div>
          
          <div className="relative animate-fadeIn flex justify-center">
            {/* Soft background blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-pale rounded-full blur-3xl opacity-50 -z-10"></div>
            <img 
              src={heroImg} 
              alt="Orbitani Edu Hero" 
              className="w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-700 relative z-10 drop-shadow-2xl"
              onError={(e) => {
                // Fallback icon if heroImg is missing
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full max-w-md mx-auto h-80 bg-gray-50 rounded-3xl border border-gray-200 items-center justify-center flex-col gap-4 text-gray-400 relative z-10 shadow-xl">
              <span className="text-6xl">🌍</span>
              <p className="font-semibold">Satelit Visual</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: VALUE */}
      <section className="bg-gray-50 border-y border-gray-100 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kenapa Orbitani Edu?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">Dirancang khusus untuk memfasilitasi kebutuhan eksperimen dan laboratorium virtual agrikultur di sekolah maupun kampus.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-green-50 text-2xl flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 transition-transform">🌱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analisis Lahan Real-Time</h3>
              <p className="text-text-secondary leading-relaxed">Dapatkan insight langsung mengenai kelembapan tanah, cuaca, dan kondisi lahan secara seketika berdasarkan koordinat presisi.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 text-2xl flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 transition-transform">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Decision Assistant</h3>
              <p className="text-text-secondary leading-relaxed">Pakar AI siap membantu menjelaskan data mentah menjadi rekomendasi penanaman yang akurat dengan metrik confidence score.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-50 text-2xl flex items-center justify-center rounded-xl mb-6 group-hover:scale-110 transition-transform">🛰️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Berbasis Data Satelit</h3>
              <p className="text-text-secondary leading-relaxed">Memanfaatkan pencitraan satelit terkini untuk mengalkulasi indeks NDVI dan tingkat kesuburan area agrikultur Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CTA */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="bg-gray-900 rounded-3xl p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-30"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Mulai sekarang dan eksplorasi lahan Anda</h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto text-lg">Platform edukasi agrikultur presisi siap pakai. Tanpa setup rumit, cukup pilih lokasi di peta.</p>
            <button 
              onClick={() => navigate('/map')}
              className="bg-primary hover:bg-primary-light text-white px-10 py-5 rounded-xl font-bold text-xl shadow-xl shadow-primary/20 transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              Coba Orbitani Edu Gratis <ArrowRight size={24} weight="bold" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm font-semibold text-text-secondary bg-gray-50">
        &copy; {new Date().getFullYear()} Orbitani Edu. Telkom University - Hackathon Project.
      </footer>
    </div>
  );
};

export default LandingPage;
