/**
 * Backend'den gelen Türkçe metinleri çeviri anahtarlarına dönüştürmek için yardımcı fonksiyonlar.
 * Bu çözüm, veritabanını değiştirmeden çok dilli destek sağlar.
 */

/**
 * Türkçe metinden bir çeviri anahtarı oluşturur.
 *
 * @param {string} turkishName - Çevrilecek Türkçe metin
 * @param {string} type - Veri tipi ('category', 'service', 'jobTitle')
 * @returns {string} Oluşturulan çeviri anahtarı
 */
export function getTranslationKeyFromTurkishName(turkishName, type) {
  if (!turkishName) return "";

  // Remove invisible characters and trim
  const cleanedName = turkishName
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\u2060\uFEFF]/g, "")
    .trim();

  // Slugify helper (replace Turkish chars, spaces, etc.) - used for other types
  const slugify = (str) =>
    str
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ") // Ensure multiple spaces become single
      .trim()
      .replace(/\s+/g, " ") // Trim again and ensure single space after potential multi-space from [^a-z0-9]+
      .split(" ")
      .filter(word => word.length > 0) // Remove empty strings resulting from multiple spaces
      .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
      .join("");

  if (type === "categories") {
    // The 'cleanedName' from categories.csv (e.g., "elektrikIsleri", "bahceVePeyzaj")
    // is already the desired key component. We just need to prefix it.
    // The previous logic was unnecessarily lowercasing and trying to re-camelcase,
    // which failed for already camelCased inputs without spaces.
    return `categories.${cleanedName}`;
  }
  if (type === "jobTitle") {
    // Example: jobTitle.mimarlarVeMuhendisler
    return `jobTitle.${slugify(cleanedName)}`;
  }
if (type === "service") {
  const match = cleanedName.match(/key\d+$/i);
  if (match) {
    return `services.service.name.${match[0].toLowerCase()}`;
  }
  return `services.${slugify(cleanedName)}`;
}
  return cleanedName;
}

/**
 * Bir nesne veya nesne dizisindeki Türkçe metinleri çeviri anahtarlarına dönüştürür
 *
 * @param {Object|Array} data - İşlenecek veri (nesne veya dizi)
 * @param {Object} options - Yapılandırma seçenekleri
 * @param {string} options.nameField - Çevrilecek alan adı (varsayılan: "name")
 * @param {string} options.type - Veri tipi (varsayılan: "category")
 * @returns {Object|Array} İşlenmiş veri
 */
export function convertToTranslationKeys(data, options = {}) {
  const { nameField = "name", type = "categories" } = options;
  if (Array.isArray(data)) {
    return data.map((item) => {
      if (item && item[nameField]) {
        return {
          ...item,
          translationKey: getTranslationKeyFromTurkishName(item[nameField], type),
        };
      }
      return item;
    });
  } else if (typeof data === "object" && data !== null) {
    if (data[nameField]) {
      return {
        ...data,
        translationKey: getTranslationKeyFromTurkishName(data[nameField], type),
      };
    }
    return data;
  }
  return data;
}