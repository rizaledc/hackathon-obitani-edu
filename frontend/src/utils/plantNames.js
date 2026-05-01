export const PLANT_NAMES_ID = {
  rice: 'Padi',
  maize: 'Jagung',
  chickpea: 'Kacang Arab',
  kidneybeans: 'Kacang Merah',
  pigeonpeas: 'Kacang Gude',
  mothbeans: 'Kacang Moth',
  mungbean: 'Kacang Hijau',
  blackgram: 'Kacang Hitam',
  lentil: 'Lentil',
  pomegranate: 'Delima',
  banana: 'Pisang',
  mango: 'Mangga',
  grapes: 'Anggur',
  watermelon: 'Semangka',
  muskmelon: 'Melon',
  apple: 'Apel',
  orange: 'Jeruk',
  papaya: 'Pepaya',
  coconut: 'Kelapa',
  cotton: 'Kapas',
  jute: 'Rami',
  coffee: 'Kopi'
};

export const toIndonesian = (name) => 
  PLANT_NAMES_ID[name?.toLowerCase()] ?? name;
