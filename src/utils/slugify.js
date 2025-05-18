/**
 * Verilen metni slug formatına dönüştürür (URL dostu formata çevirir)
 *
 * @param {string} text - Slug'a dönüştürülecek metin
 * @returns {string} Oluşturulan slug
 */
export const slugify = (text) => {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // Boşlukları ve alt çizgileri tirelere çevir
    .replace(/[^\w\-]+/g, "") // Alfanümerik olmayan karakterleri kaldır
    .replace(/\-\-+/g, "-") // Çoklu tireleri tek tireye dönüştür
    .replace(/^-+/, "") // Baştaki tireleri kaldır
    .replace(/-+$/, ""); // Sondaki tireleri kaldır
};

/**
 * Verilen bir nesne dizisini işleyerek, her nesneye slug özelliği ekler
 *
 * @param {Array} items - İşlenecek nesneler dizisi
 * @param {string} nameField - Slug oluşturulacak alan adı (varsayılan: "name")
 * @returns {Array} Slug eklenmiş nesneler dizisi
 */
export const addSlugsToItems = (items, nameField = "name") => {
  if (!items || !Array.isArray(items)) return [];

  return items.map((item) => {
    if (!item) return item;

    if (!item.slug && item[nameField]) {
      return {
        ...item,
        slug: slugify(item[nameField]),
      };
    }

    return item;
  });
};

/**
 * API'den gelen slug formatını çeviri anahtarına dönüştürür
 * Örneğin: "electrical-fault-detection" -> "electricalFaultDetection"
 *
 * @param {string} slug - Dönüştürülecek slug
 * @returns {string} Çeviri için uygun formata dönüştürülmüş anahtar
 */
export const slugToTranslationKey = (slug) => {
  if (!slug) return "";

  // Tüm Unicode karakterleri temizleyip sadece temel ASCII karakterleri bırakalım
  // Bu, görünmeyen karakterler ve aksan işaretleri gibi sorunları çözer
  const sanitizedSlug = slug
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  // Slug formatını camelCase'e dönüştür
  return sanitizedSlug
    .split("-")
    .map((word, index) => {
      // İlk kelime küçük harfle başlar, diğerleri büyük harfle
      return index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
};

export default slugify;
