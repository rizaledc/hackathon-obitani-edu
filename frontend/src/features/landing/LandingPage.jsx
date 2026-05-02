import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo.webp";
import jenistanaman from "../../assets/jenistanaman.webp";
import bg2 from "../../assets/bg2.webp";
import {
  Leaf,
  Brain,
  GlobeHemisphereWest,
  Users,
  ChartLineUp,
  Cloud,
  Cpu,
  Database,
  MapTrifold,
  Globe,
  ShieldCheck,
  GraduationCap,
  Microscope,
  Buildings,
  Plant,
  EnvelopeSimple,
  Phone,
  MapPin,
  InstagramLogo,
  LinkedinLogo,
  FacebookLogo,
  TwitterLogo,
  List,
  X
} from "@phosphor-icons/react";
const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('scroll-smooth');
    return () => document.documentElement.classList.remove('scroll-smooth');
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 font-sans text-gray-900 dark:text-white overflow-x-hidden transition-all duration-300">
      {/* NAVBAR */}
      <nav className="fixed w-full top-6 z-50 px-4 md:px-0 transition-all duration-300 flex justify-center">
        <div className="w-full max-w-5xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/40 dark:border-gray-700 shadow-lg rounded-full px-6 py-3 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={logo} alt="Orbitani Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Orbitani Edu</span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-gray-800">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">Beranda</button>
            <button onClick={() => document.getElementById('tentang').scrollIntoView()} className="hover:text-primary transition-colors">Tentang Platform</button>
            <button onClick={() => document.getElementById('solusi').scrollIntoView()} className="hover:text-primary transition-colors">Solusi</button>
            <button onClick={() => document.getElementById('carakerja').scrollIntoView()} className="hover:text-primary transition-colors">Cara Kerja</button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 font-bold text-sm transition-all duration-300"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-primary hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 font-bold text-sm transition-all duration-300"
            >
              Daftar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-800 p-2 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} weight="bold" /> : <List size={28} weight="bold" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full mt-2 w-[calc(100%-2rem)] left-4 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-6 flex flex-col gap-4 md:hidden animate-slideUp">
            <button onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left font-bold text-gray-800 py-3 border-b border-gray-50 text-lg">Beranda</button>
            <button onClick={() => { setIsMobileMenuOpen(false); document.getElementById('tentang').scrollIntoView(); }} className="text-left font-bold text-gray-800 py-3 border-b border-gray-50 text-lg">Tentang Platform</button>
            <button onClick={() => { setIsMobileMenuOpen(false); document.getElementById('solusi').scrollIntoView(); }} className="text-left font-bold text-gray-800 py-3 border-b border-gray-50 text-lg">Solusi</button>
            <button onClick={() => { setIsMobileMenuOpen(false); document.getElementById('carakerja').scrollIntoView(); }} className="text-left font-bold text-gray-800 py-3 border-b border-gray-50 text-lg">Cara Kerja</button>
            
            <div className="flex flex-col gap-3 mt-4">
              <button onClick={() => navigate('/login')} className="bg-green-50 hover:bg-green-100 text-primary border border-green-100 px-5 py-4 rounded-xl font-bold w-full text-center transition-colors">Masuk</button>
              <button onClick={() => navigate('/register')} className="bg-primary hover:bg-green-700 text-white px-5 py-4 rounded-xl shadow-md font-bold w-full text-center transition-colors">Daftar</button>
            </div>
          </div>
        )}
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-gray-50 px-4 sm:px-6 pt-32 pb-16 lg:pt-0 lg:pb-0 overflow-hidden">
        {/* Dekorasi Latar Belakang Halus */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[80px]"></div>

        <div className="relative z-10 max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-10 lg:gap-8 items-center mt-4 lg:mt-0">

          {/* SISI KIRI (Teks & CTA) */}
          <div className="text-center lg:text-left space-y-6 animate-slideUp">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-gray-900 tracking-tight">
              Infrastruktur Agrikultur Digital untuk <span className="text-primary block sm:inline">Generasi Emas</span> Indonesia
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Dengan teknologi satelit real-time dari Google Earth Engine, kami menghadirkan pengalaman praktikum tanpa sensor, tanpa batas, dan tanpa hambatan.
            </p>

            {/* Jarak ekstra (White Space) yang proporsional */}
            <div className="pt-4 sm:pt-8 flex justify-center lg:justify-start">
              <button
                onClick={() => navigate('/register')}
                className="bg-primary hover:bg-green-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-bold text-lg w-full sm:w-auto text-center"
              >
                Mulai Uji Coba
              </button>
            </div>
          </div>

          {/* SISI KANAN (Visual Jelas) */}
          <div className="relative animate-fadeIn flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-xl">
              {/* Bingkai dekoratif */}
              <div className="absolute inset-0 bg-primary/20 rounded-3xl transform translate-x-4 translate-y-4 -z-10"></div>
              {/* Gambar asimetris terang dan jelas */}
              <img
                src={bg2}
                alt="Orbitani Edu Dashboard"
                className="w-full h-auto rounded-3xl shadow-2xl object-cover border-[6px] border-white"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATISTIK */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 animate-slideUp">
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
              <Leaf size={32} weight="duotone" className="text-green-600 mb-3 mx-auto" />
              <h2 className="text-3xl font-bold text-gray-900">22+</h2>
              <p className="text-sm font-medium text-gray-600">Rekomendasi Tanaman</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
              <GlobeHemisphereWest size={32} weight="duotone" className="text-green-600 mb-3 mx-auto" />
              <h2 className="text-3xl font-bold text-gray-900">38</h2>
              <p className="text-sm font-medium text-gray-600">Provinsi</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
              <ChartLineUp size={32} weight="duotone" className="text-green-600 mb-3 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">Real-time</h2>
              <p className="text-sm font-medium text-gray-600">Data Satelit</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
              <Brain size={32} weight="duotone" className="text-green-600 mb-3 mx-auto" />
              <h2 className="text-3xl font-bold text-gray-900">AI</h2>
              <p className="text-sm font-medium text-gray-600">Analisis Cerdas</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
              <MapTrifold size={32} weight="duotone" className="text-green-600 mb-3 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">10 meter</h2>
              <p className="text-sm font-medium text-gray-600">Data Resolusi</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TENTANG ORBITANI EDU / EDUKASI */}
      <section id="tentang" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 animate-slideUp">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* KIRI (TEXT) */}
            <div className="flex-1 text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Membangun Masa Depan Edukasi Pertanian Digital
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Orbitani Edu hadir untuk menjembatani kesenjangan antara teori dan praktik dalam pembelajaran pertanian. Dengan bantuan data satelit dan kecerdasan buatan, pengguna dapat memahami kondisi lahan secara lebih nyata tanpa harus selalu turun langsung ke lapangan.
              </p>
            </div>

            {/* KANAN (IMAGE) */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl transform translate-x-3 translate-y-3"></div>
                <img
                  src={jenistanaman}
                  alt="Antarmuka Orbitani Edu"
                  className="relative rounded-2xl shadow-xl w-full max-w-md hover:-translate-y-2 transition-all duration-300 border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NILAI UTAMA */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-left mb-12 animate-slideUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Nilai Utama Pembelajaran</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left animate-slideUp">
            <div className="flex items-start gap-4">
              <Leaf size={28} weight="duotone" className="text-green-600 mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 text-xl mb-2">Berkelanjutan</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  Pembelajaran yang mendorong penggunaan sumber daya secara efisien.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Brain size={28} weight="duotone" className="text-green-600 mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 text-xl mb-2">Inovatif</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  Menggunakan pendekatan kecerdasan buatan untuk meningkatkan kualitas pemahaman mahasiswa.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Database size={28} weight="duotone" className="text-green-600 mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 text-xl mb-2">Berbasis Data</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  Menggunakan data satelit untuk memberikan gambaran kondisi lahan secara nyata.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Users size={28} weight="duotone" className="text-green-600 mt-1 shrink-0" />
              <div>
                <h4 className="font-bold text-gray-900 text-xl mb-2">Kolaboratif</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  Mendukung penggunaan oleh institusi pendidikan, dosen, dan mahasiswa secara bersama.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SOLUSI PLATFORM */}
      <section id="solusi" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-left mb-12 animate-slideUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Fitur Unggulan Platform</h2>
            <p className="text-gray-600">Dirancang untuk pembelajaran agrikultur modern berbasis teknologi</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 animate-slideUp">
            <div className="bg-white p-8 rounded-2xl border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left">
              <MapTrifold size={36} weight="duotone" className="text-primary mb-4" />
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Analisis Lahan Interaktif</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Melihat dan memahami kondisi lahan secara langsung melalui peta interaktif berbasis data satelit.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left" style={{ animationDelay: '0.1s' }}>
              <Brain size={36} weight="duotone" className="text-primary mb-4" />
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Asisten Pembelajaran Berbasis AI</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Mendapatkan penjelasan sederhana dan rekomendasi tanaman dari sistem kecerdasan buatan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-green-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left" style={{ animationDelay: '0.2s' }}>
              <ShieldCheck size={36} weight="duotone" className="text-primary mb-4" />
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Infrastruktur Aman & Terintegrasi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sistem stabil dan aman untuk mendukung proses pembelajaran tanpa hambatan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CARA KERJA PLATFORM */}
      <section id="carakerja" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-left animate-slideUp mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Alur Penggunaan Sistem</h2>
            <p className="text-gray-600">Langkah mudah mengeksplorasi platform</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mt-12 gap-6 animate-slideUp text-center">
            <div className="max-w-xs flex flex-col items-center">
              <MapTrifold size={32} weight="duotone" className="text-green-500 mb-2" />
              <div className="text-2xl font-bold text-primary mb-2">01</div>
              <h3 className="font-semibold text-gray-900 mb-2">Eksplorasi Lahan</h3>
              <p className="text-sm text-gray-600">Pengguna memilih lokasi melalui peta interaktif.</p>
            </div>

            <div className="hidden md:block w-16 h-[2px] bg-green-200"></div>

            <div className="max-w-xs flex flex-col items-center">
              <Database size={32} weight="duotone" className="text-green-500 mb-2" />
              <div className="text-2xl font-bold text-primary mb-2">02</div>
              <h3 className="font-semibold text-gray-900 mb-2">Integrasi Data</h3>
              <p className="text-sm text-gray-600">Sistem mengambil data satelit seperti vegetasi, curah hujan, dan kondisi tanah.</p>
            </div>

            <div className="hidden md:block w-16 h-[2px] bg-green-200"></div>

            <div className="max-w-xs flex flex-col items-center">
              <Cpu size={32} weight="duotone" className="text-green-500 mb-2" />
              <div className="text-2xl font-bold text-primary mb-2">03</div>
              <h3 className="font-semibold text-gray-900 mb-2">Analisis AI</h3>
              <p className="text-sm text-gray-600">Model AI memproses data untuk menghasilkan rekomendasi tanaman.</p>
            </div>

            <div className="hidden md:block w-16 h-[2px] bg-green-200"></div>

            <div className="max-w-xs flex flex-col items-center">
              <ChartLineUp size={32} weight="duotone" className="text-green-500 mb-2" />
              <div className="text-2xl font-bold text-primary mb-2">04</div>
              <h3 className="font-semibold text-gray-900 mb-2">Insight Edukatif</h3>
              <p className="text-sm text-gray-600">Pengguna mendapatkan penjelasan dan hasil analisis sebagai bahan pembelajaran.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TEKNOLOGI */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-left animate-slideUp">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Teknologi di Balik Platform</h2>
          <p className="text-gray-600 max-w-2xl mb-10">
            Platform ini memanfaatkan teknologi modern untuk mengolah data geospasial menjadi informasi edukatif yang mudah dipahami.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center h-full min-h-[140px]">
              <Globe size={36} weight="duotone" className="text-green-600 mb-3" />
              <p className="font-bold text-gray-900 text-center">Google Earth Engine</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center h-full min-h-[140px]">
              <Cloud size={36} weight="duotone" className="text-green-600 mb-3" />
              <p className="font-bold text-gray-900 text-center">Microsoft Azure Cloud</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center h-full min-h-[140px]">
              <Cpu size={36} weight="duotone" className="text-green-600 mb-3" />
              <p className="font-bold text-gray-900 text-center">Machine Learning</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center h-full min-h-[140px]">
              <Brain size={36} weight="duotone" className="text-green-600 mb-3" />
              <p className="font-bold text-gray-900 text-center">Integrasi AI Generatif</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TARGET PENGGUNA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 animate-slideUp">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dirancang untuk Dunia Pendidikan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Platform ini dirancang secara khusus untuk memenuhi kebutuhan berbagai lapisan akademisi dalam mendukung riset dan praktik agrikultur modern.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Plant size={32} weight="duotone" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Siswa SMK Pertanian</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Mengenalkan teknologi geospasial sejak dini sebagai bekal praktik cerdas di lapangan.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <GraduationCap size={32} weight="duotone" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Mahasiswa Agrikultur</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Laboratorium virtual untuk memvalidasi teori dengan data satelit secara real-time.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Microscope size={32} weight="duotone" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Dosen & Peneliti</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Akses cepat terhadap insight analitik AI untuk mendukung kualitas penelitian.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Buildings size={32} weight="duotone" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3">Instansi Pendidikan</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Standarisasi kurikulum agrikultur presisi dengan infrastruktur digital modern.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FOOTER LENGKAP */}
      <footer className="bg-gray-900 pt-20 pb-10 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">

            {/* Kolom 1: Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Orbitani Logo" className="w-10 h-10 object-contain brightness-0 invert" />
                <span className="font-bold text-2xl tracking-tight text-white">Orbitani Edu</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Platform infrastruktur agrikultur digital yang memberdayakan institusi pendidikan melalui integrasi data satelit dan kecerdasan buatan.
              </p>
            </div>

            {/* Kolom 2: Navigasi */}
            <div className="md:ml-auto">
              <h4 className="font-bold text-white text-lg mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">Beranda</button></li>
                <li><button onClick={() => document.getElementById('tentang').scrollIntoView()} className="hover:text-primary transition-colors">Tentang Platform</button></li>
                <li><button onClick={() => document.getElementById('solusi').scrollIntoView()} className="hover:text-primary transition-colors">Fitur Unggulan</button></li>
                <li><button onClick={() => document.getElementById('carakerja').scrollIntoView()} className="hover:text-primary transition-colors">Cara Kerja</button></li>
              </ul>
            </div>

          </div>

          {/* Garis Bawah & Copyright */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Telkom University - ORBITANI EDU - Hackathon Project. Hak Cipta Dilindungi.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <span>Desain & Sistem oleh Tim Orbitani Edu</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
