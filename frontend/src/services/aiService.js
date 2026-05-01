export const getAIExplanation = async ({ plant, confidence, lat, lng, context }) => {
  return new Promise((resolve, reject) => {
    // Simulate API delay
    setTimeout(() => {
      // Simulate occasional error for UX demo (Optional)
      // if (Math.random() > 0.8) return reject(new Error("AI error"));

      resolve({
        explanation: `Tanaman ${plant === 'rice' ? 'Padi' : plant} sangat direkomendasikan di koordinat (Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}) karena didukung oleh nilai kelembapan tanah yang konsisten dan indeks NDVI yang stabil.` + 
        (context ? ` Mempertimbangkan catatan Anda ("${context}"), pemilihan bibit toleran terhadap kondisi tersebut akan memaksimalkan hasil panen.` : ''),
        risks: "Risiko utama adalah potensi genangan jika terjadi curah hujan ekstrem. Pastikan sistem drainase lahan berfungsi optimal.",
        alternatives: ["Jagung", "Kacang Hijau"]
      });
    }, 1500);
  });
};
