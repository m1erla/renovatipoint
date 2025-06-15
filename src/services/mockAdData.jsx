
const DEFAULT_AD_IMAGE_URL = "/images/placeholder-ad.png"; // From your adService

// Helper to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Sample category names (should match what your API might return or what's in your categories data)
const categoryNames = [
  "elektrikIsleri", "tesisatIsleri", "tadilatIsleri", "insaatIsleri", "nakliyat",
  "temizlik", "bahceVePeyzaj", "boyaVeBadana", "mobilyaMontaj", "dekorasyon",
  "kameraSistemleri", "guvenlikSistemleri", "beyazEsyaTamiri", "kucukEvAletleriTamiri",
  "projeVePlanlama", "icVeDisKaplama", "guvenlikOnlemleri", "enerjiVerimliligi",
  "sonKontrollerVeTeslim", "duvarIsleri", "bakimVeOnarim", "yikimVeTemizlik",
  "yapisalOnarimlar", "izolasyonVeYalitim", "sivaIslemleri", "boyamaIslemleri",
  "duvarKagidiUygulamasi", "bahceIsleriVeAcikHava", "boyaIsleri", "icDekorasyon",
  "disCevreDuzenlemesi"
];

// Sample service names (these would be translation keys or human-readable names)
const serviceNames = [
  "service.name.key1", "service.name.key3", "service.name.key19", "service.name.key58",
  "service.name.key7", "service.name.key91", "service.name.key103"
];

const userNames = ["Ahmet Yılmaz", "Ayşe Demir", "Mehmet Can", "Zeynep Kaya", "Ali Veli"];

const generateRandomId = () => `ad-${Math.random().toString(36).substr(2, 9)}`;
const generateRandomUserId = () => `user-${Math.random().toString(36).substr(2, 9)}`;

const getRandomDate = (start = new Date(2022, 0, 1), end = new Date()) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

export const mockAdsData = Array.from({ length: 25 }, (_, i) => {
  const categoryName = getRandomElement(categoryNames);
  const userName = getRandomElement(userNames);
  const isActive = Math.random() > 0.3; // 70% active

  return {
    id: generateRandomId(),
    title: `${categoryName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} İlanı #${i + 1} - ${userName.split(' ')[0]}`,
    descriptions: `Bu ${categoryName} ilanı için detaylı açıklama. ${userName} tarafından sunulan bu hizmet, ${isActive ? 'aktif' : 'pasif'} durumdadır ve çeşitli ${serviceNames[i % serviceNames.length]} işlerini kapsamaktadır. Kaliteli ve güvenilir bir hizmet için bize ulaşın.`,
    isActive: isActive,
    userId: generateRandomUserId(), // This would be the expert's ID who created the ad
    userName: userName, // Name of the expert
    categoryId: `cat-uuid-${categoryNames.indexOf(categoryName) + 1}`, // Example UUID
    categoryName: categoryName, // Used for filtering and display
    serviceId: `serv-uuid-${i % serviceNames.length + 1}`, // Example UUID
    serviceName: serviceNames[i % serviceNames.length], // Used for display
    createdAt: getRandomDate(),
    updatedAt: getRandomDate(),
    // images field will be populated by fetchAds in AdList.jsx by calling adService.getAdImages
    // For direct use in mock, you could add:
    // images: [{ url: DEFAULT_AD_IMAGE_URL, name: "default.png", id: "default-img-id" }],
  };
});