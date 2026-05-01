export const getRecommendation = async (data) => {
  // Hackathon mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        plant: "rice",
        confidence: 0.92,
        reason: "Kondisi tanah dan kelembapan mendukung pertumbuhan padi dengan tingkat curah hujan historis yang optimal di koordinat ini."
      });
    }, 500);
  });
};
