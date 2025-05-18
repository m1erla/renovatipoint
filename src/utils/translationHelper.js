/**
 * Backend'den gelen Türkçe metinleri çeviri anahtarlarına dönüştürmek için yardımcı fonksiyonlar.
 * Bu çözüm, veritabanını değiştirmeden çok dilli destek sağlar.
 */

import { slugify, slugToTranslationKey } from "./slugify";

/**
 * Türkçe metinden bir çeviri anahtarı oluşturur.
 *
 * @param {string} turkishName - Çevrilecek Türkçe metin
 * @param {string} type - Veri tipi ('category', 'service', 'jobTitle')
 * @returns {string} Oluşturulan çeviri anahtarı
 */
export function getTranslationKeyFromTurkishName(turkishName, type) {
  if (!turkishName) return null;

  // Invisible character remover (handles zero-width space etc.) - Updated Regex
  const cleanedName = turkishName
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\u2060\uFEFF]/g, "")
    .trim();

  // Eşleştirme tabloları - CSV verilerine göre güncellendi
  const mappings = {
    category: {
      // Mevcut + CSV'den Gelenler + Loglardan Gelenler
      "Elektrik İşleri": "elektrikIsleri",
      "Tesisat İşleri": "tesisatIsleri",
      "Tadilat İşleri": "tadilatIsleri",
      "İnşaat İşleri": "insaatIsleri",
      Nakliyat: "nakliyat",
      Temizlik: "temizlik",
      "Bahçe ve Peyzaj": "bahceVePeyzaj",
      "Boya ve Badana": "boyaVeBadana",
      "Mobilya Montaj": "mobilyaMontaj",
      Dekorasyon: "dekorasyon",
      "Kamera Sistemleri": "kameraSistemleri",
      "Güvenlik Sistemleri": "guvenlikSistemleri",
      "Beyaz Eşya Tamiri": "beyazEsyaTamiri",
      "Küçük Ev Aletleri Tamiri": "kucukEvAletleriTamiri",
      "Proje ve Planlama": "projeVePlanlama",
      "İç ve Dış Kaplama": "icVeDisKaplama",
      "Dış Çevre Düzenlemesi": "disCevreDuzenlemesi",
      "Son Kontroller ve Teslim": "sonKontrollerVeTeslim",
      "Bakım ve Onarım": "bakimVeOnarim",
      "Yıkım ve Temizlik": "yikimVeTemizlik",
      "Yapısal Onarımlar": "yapisalOnarimlar",
      "İzolasyon ve Yalıtım": "izolasyonVeYalitim",
      "Sıva İşlemleri": "sivaIslemleri",
      "Boyama İşlemleri": "boyamaIslemleri",
      "Boyama İşlemleri:": "boyamaIslemleri",
      "Duvar Kağıdı Uygulaması": "duvarKagidiUygulamasi",
      "Güvenlik Önlemleri": "guvenlikOnlemleri",
      "Enerji Verimliliği": "enerjiVerimliligi",
      "Duvar İşleri": "duvarIsleri",
      "Bahçe işleri ve açık hava": "bahceIsleriVeAcikHava",
      "Boya İşleri": "boyaIsleri",
      "İç Dekorasyon": "icDekorasyon",
    },
    service: {
      // Mevcut + CSV'den Gelenler + Loglardan Gelenler
      "Elektrik Arıza Tespiti": "elektrikArizaTespiti",
      "Sigorta Değişimi": "sigortaDegisimi",
      "Anahtar Priz Değişimi": "anahtarPrizDegisimi",
      "Avize Montajı": "avizeMontaji",
      "Kombi Arıza Tespiti": "kombiArizaTespiti",
      "Musluk Tamiri": "muslukTamiri",
      "Klozet Değişimi": "klozetDegisimi",
      "Duvar Yıkımı": "duvarYikimi",
      "Fayans Döşeme": "fayansDoseme",
      "Mutfak Dolabı Montajı": "mutfakDolabiMontaji",
      "Ev Temizliği": "evTemizligi",
      "Ofis Temizliği": "ofisTemizligi",
      "Cam Temizliği": "camTemizligi",
      "Yapı Denetimleri Tesisat Denetimleri Dekorasyon Denetimleri":
        "yapiTesisatDekorasyonDenetimleri",
      "Mat Boya": "matBoya",
      "Parlak Boya": "parlakBoya",
      "Yapının mevcut durumunun değerlendirilmesi: Yapısal hasarların tespiti, tesisat yenileme, iç ve dış dekorasyon değişiklikleri":
        "yapiDurumDegerlendirme",
      "Müşterinin ihtiyaç ve beklentilerinin analizi: Bütçe, zaman çizelgesi ve tasarım tercihleri":
        "musteriIhtiyacAnalizi",
      "Detaylı proje planlarının oluşturulması: İş akışı, malzeme seçimi ve ekip koordinasyonu":
        "detayliProjePlani",
      "Gerekli izinlerin alınması: Belediyeden inşaat ruhsatı ve diğer yasal onaylar":
        "gerekliIzinler",
      "Elektrik Tesisatı Döşeme": "elektrikTesisatiDoseme",
      "Aydınlatma Elemanlarının Montajı": "aydinlatmaElemanMontaji",
      "Su ve Kanalizasyon Tesisatı Döşeme": "suKanalizasyonTesisatiDoseme",
      "Gaz Tesisatı Döşeme": "gazTesisatiDoseme",
      "Isıtma ve Soğutma Sistemlerinin Kurulumu": "isitmaSogutmaSistemKurulumu",
      "Duvarların Sıva ve Boyama İşlemleri": "duvarSivaBoyaIslemleri",
      "Dış Cephe Kaplama ve Boyama İşlemleri": "disCepheKaplamaBoyaIslemleri",
      "Zemin Kaplama İşlemleri": "zeminKaplamaIslemleri",
      "Duvar Kağıdı, Boya, Taş Kaplama gibi İç Dekorasyon Uygulamaları":
        "icDekorasyonUygulamalari",
      "Perde ve Diğer Aksesuarların Yerleştirilmesi":
        "perdeAksesuarYerlestirme",
      "Bahçe Düzenlemesi": "bahceDuzenlemesi",
      "Sulama Sistemi Kurulumu": "sulamaSistemiKurulumu",
      "Bahçe Mobilyalarının Yerleştirilmesi": "bahceMobilyaYerlestirme",
      "İnşaat Sonrası Temizlik": "insaatSonrasiTemizlik",
      "Eksikliklerin Giderilmesi": "eksiklikGiderme",
      "Son Kontrollerin Yapılması": "sonKontroller",
      "İnşaatın Teslim Edilmesi": "insaatTeslim",
      "İnşaat Sonrası Oluşabilecek Sorunların Giderilmesi":
        "insaatSonrasiSorunGiderme",
      "Periyodik Bakım ve Onarım İşlemleri": "periyodikBakimOnarim",
      "Zemin Etüt Çalışmaları": "zeminEtutCalismalari",
      "Kazı İşlemleri": "kaziIslemleri",
      "Temel Betonu Dökme": "temelBetonDokme",
      "Demir Bağlama": "demirBaglama",
      "Duvar Örme": "duvarOrme",
      "Çatı Yapımı": "catiYapimi",
      "Zemin Döşeme": "zeminDoseme",
      "Yapısal Elemanların Montajı": "yapisalElemanMontaji",
      "Çatı Kaplama İşlemleri": "catiKaplamaIslemleri",
      "Duvar İnşaatı": "duvarInsaati",
      "Temel İyileştirme": "temelIyilestirme",
      "Yeni Duvar Örme": "yeniDuvarOrme",
      "Mevcut Duvarların Güçlendirilmesi": "mevcutDuvarGuclendirme",
      "Taşıyıcı Kolon ve Kirişlerin Onarımı": "kolonKirisOnarimi",
      "Yeni Kolon ve Kirişlerin Eklenmesi": "yeniKolonKirisEkleme",
      "Çatlakların Onarımı": "catlakOnarimi",
      "Hasarlı Betonun Yenilenmesi": "hasarliBetonYenileme",
      "Su Yalıtımı": "suYalitimi",
      "Isı Yalıtımı": "isiYalitimi",
      "Ses Yalıtımı": "sesYalitimi",
      "Yangın Yalıtımı": "yanginYalitimi",
      "Dış Cephe Mantolama": "disCepheMantolama",
      "Çatı İzolasyonu": "catiIzolasyonu",
      "Zemin İzolasyonu": "zeminIzolasyonu",
      "İç Cephe Sıva": "icCepheSiva",
      "Dış Cephe Sıva": "disCepheSiva",
      "Alçı Sıva": "alciSiva",
      "Kara Sıva": "karaSiva",
      "Saten Sıva": "satenSiva",
      "Dekoratif Sıva": "dekoratifSiva",
      "İç Cephe Boyama": "icCepheBoyama",
      "Dış Cephe Boyama": "disCepheBoyama",
      "Tavan Boyama": "tavanBoyama",
      "Yağlı Boya": "yagliBoya",
      "Plastik Boya": "plastikBoya",
      "Saten Boya": "satenBoya",
      "Dekoratif Boya Teknikleri": "dekoratifBoyaTeknikleri",
      "Duvar Kağıdı Seçimi": "duvarKagidiSecimi",
      "Duvar Hazırlığı": "duvarHazirligi",
      "Duvar Kağıdı Yapıştırma": "duvarKagidiYapistirma",
      "Desen Takibi ve Kesim": "desenTakibiKesim",
      "Kenar Düzeltme ve Temizlik": "kenarDuzeltmeTemizlik",
      "Malzeme Seçimi": "malzemeSecimi",
      "Uygulama Yöntemleri (Serme, Püskürtme vb.)": "yalitimUygulamaYontemleri",
      "Detay Çözümleri (Köşe, Pencere Kenarı vb.)": "yalitimDetayCozumleri",
      "Kalın Sıva Uygulaması": "kalinSivaUygulamasi",
      "İnce Sıva (Perdah) Uygulaması": "inceSivaPerdahUygulamasi",
      "Sıva Tamiratları": "sivaTamiratlari",
      "Yüzey Hazırlığı (Zımpara, Macun vb.)": "boyaYuzeyHazirligi",
      "Astar Uygulaması": "astarUygulamasi",
      "Kat Boyama": "katBoyama",
      "Son Kat ve Rötuşlar": "sonKatRotuslar",
      "Duvar Kağıdı Uygulaması": "duvarKagidiUygulamasiServis",
      "Doğru malzeme ve desenin seçilmesi.": "duvarKagidiMalzemeSecimi",
      "Duvarın temizlenmesi, düzeltilmesi ve astarlanması.":
        "duvarKagidiDuvarHazirligi",
      "Tutkalın sürülmesi ve kağıdın yapıştırılması.":
        "duvarKagidiYapistirmaTeknik",
      "Desenlerin eşleştirilmesi ve fazla kağıdın kesilmesi.":
        "duvarKagidiDesenTakibi",
      "Hava kabarcıklarının giderilmesi ve kenarların düzeltilmesi.":
        "duvarKagidiKenarDuzeltme",
      "Elektrik Güvenliği Denetimleri": "elektrikGuvenlikDenetimleri",
      "Yangın Güvenliği Sistemleri Kurulumu": "yanginGuvenlikSistemKurulumu",
      "Acil Durum Aydınlatmaları": "acilDurumAydinlatmalari",
      "Gaz Kaçağı Dedektörleri Kurulumu": "gazKacagiDedektorKurulumu",
      "Güvenlik Kameraları ve Alarm Sistemleri Entegrasyonu":
        "kameraAlarmEntegrasyonu",
      "Enerji Verimli Aydınlatma Sistemleri": "enerjiVerimliAydinlatma",
      "Akıllı Ev Sistemleri Entegrasyonu (Isıtma, Soğutma, Aydınlatma)":
        "akilliEvSistemEntegrasyonu",
      "Güneş Panelleri Kurulumu": "gunesPaneliKurulumu",
      "Yüksek Verimli Isıtma ve Soğutma Sistemleri":
        "yuksekVerimliIsitmaSogutma",
      "Enerji Tüketimi Analizi ve Optimizasyon Danışmanlığı":
        "enerjiTuketimAnaliziOptimizasyon",
      "Sıva İşlemleri": "sivaIslemleriServis",
      "İzolasyon ve Yalıtım": "izolasyonVeYalitimServis",
      "Güvenlik Önlemleri": "guvenlikOnlemleriServis",
      "Enerji Verimliliği": "enerjiVerimliligiServis",
      "İç ve Dış Kaplama": "icVeDisKaplamaServis",
      "Projeye uygun kaliteli malzeme temini": "kaliteliMalzemeTemini",
      "Uzman ekiplerle titiz uygulama": "uzmanEkipUygulama",
      "İş takvimi ve bütçe yönetimi": "isTakvimiButceYonetimi",
      "Garanti ve servis hizmetleri": "garantiServisHizmetleri",
      "İç Mekan Boyama": "icMekanBoyama",
      "Dış Cephe Boyama": "disCepheBoyamaServis",
      "Ahşap Boyama": "ahsapBoyama",
      "Metal Boyama": "metalBoyama",
      "Dekoratif Boyama": "dekoratifBoyama",
      "Duvar kağıdı sökme": "duvarKagidiSokme",
      "Duvar kağıdı yapıştırma": "duvarKagidiYapistirmaServis",
      "Desenli duvar kağıdı uygulaması": "desenliDuvarKagidiUygulamasi",
      "Banyo ve mutfak için özel duvar kağıdı": "banyoMutfakDuvarKagidi",
      "Temizlik malzemeleri temini": "temizlikMalzemeTemini",
      "İnşaat artıklarının toplanması": "insaatArtikToplama",
      "Genel temizlik": "genelTemizlik",
      "İnşaat sonrası detaylı temizlik": "insaatSonrasiDetayliTemizlik",
      "İnşaat alanının teslimi": "insaatAlanTeslimi",
      "Mevcut Durum Tespiti ve Analizi": "mevcutDurumTespitAnaliz",
      "Onarım Planı ve Malzeme Seçimi": "onarimPlaniMalzemeSecimi",
      "Uygulama ve Kalite Kontrol": "uygulamaKaliteKontrol",
      "Beton Güçlendirme": "betonGuclendirme",
      "Çelik Güçlendirme": "celikGuclendirme",
      "Karbon Fiber Güçlendirme": "karbonFiberGuclendirme",
      "Yeni Taşıyıcı Eleman Ekleme": "yeniTasiyiciElemanEkleme",
      "Genel yalıtım kontrolleri": "genelYalitimKontrolleri",
      "Çatı, cephe, zemin izolasyonları": "catiCepheZeminIzolasyon",
      "Pencere ve kapı izolasyonları": "pencereKapiIzolasyonlari",
      "Tesisat izolasyonları": "tesisatIzolasyonlari",
      "Yangın alarm sistemleri": "yanginAlarmSistemleri",
      "Duman dedektörleri": "dumanDedektorleri",
      "Yangın söndürme sistemleri": "yanginSondurmeSistemleri",
      "Acil çıkış yönlendirmeleri": "acilCikisYonlendirmeleri",
      "Yangına dayanıklı malzeme kullanımı": "yanginaDayanikliMalzemeKullanimi",
      "LED aydınlatma kullanımı": "ledAydinlatmaKullanimi",
      "Hareket sensörlü aydınlatmalar": "hareketSensorluAydinlatmalar",
      "Doğal ışıktan maksimum faydalanma": "dogalIsikMaksimumFaydalanma",
      "Enerji sınıfı yüksek cihazlar": "enerjiSinifiYuksekCihazlar",
      "Güneş panelleri, rüzgar türbinleri": "gunesPaneliRuzgarTurbini",
      "Eski tesisatın sökülmesi": "eskiTesisatSokmeServis",
      "Eski kaplamaların sökülmesi": "eskiKaplamaSokmeServis",
      "Eski yapı elemanlarının sökülmesi": "eskiYapiElemanSokme",
      "İnşaat alanının temizlenmesi": "insaatAlanTemizlemeServis",
      "İnşaat atıklarının toplanması": "insaatAtikToplamaServis",
      "Genel temizlik": "genelTemizlikYikim",
      "İnşaat sonrası detaylı temizlik": "insaatSonrasiDetayliTemizlikYikim",
      "Projenin teslim edilmesi": "projeTeslim",
      "Kullanım izni alınması": "kullanimIzniAlinmasi",
      "Garanti belgelerinin teslimi": "garantiBelgeTeslimi",
      "Bakım talimatları ve öneriler": "bakimTalimatOneri",
      "Periyodik kontroller": "periyodikKontrollerBakim",
      "Küçük onarımlar": "kucukOnarimlar",
      "Boya badana işleri": "boyaBadanaIsleri",
      "Tesisat arızalarının giderilmesi": "tesisatArizaGiderme",
      "Elektrik arızalarının giderilmesi": "elektrikArizaGiderme",
      "Bahçe bakımı, peyzaj bakımı": "bahcePeyzajBakimi",
      "Çatı bakımı": "catiBakimi",
      "Yapı denetimleri, tesisat denetimleri, dekorasyon denetimleri":
        "yapiTesisatDekorasyonDenetimleriServis",
      "Bahce Uzmani 1": "bahceUzmani1",
    },
    jobTitle: {
      // Mevcut + CSV'den Gelenler
      Elektrikçi: "elektrikci",
      Tesisatçı: "tesisatci",
      "İnşaat Ustası": "insaatUstasi",
      Marangoz: "marangoz",
      Boyacı: "boyaci",
      Nakliyeci: "nakliyeci",
      Temizlikçi: "temizlikci",
      Bahçıvan: "bahcivan",
      "Mobilya Montaj Ustası": "mobilyaMontajUstasi",
      Dekoratör: "dekorator",
      "Mimarlar ve Mühendisler": "mimarlarVeMuhendisler",
      Elektrikçiler: "elektrikciler",
      Tesisatçılar: "tesisatcilar",
      "Boyacılar ve Sıvacılar": "boyacilarVeSivacilar",
      "Zemin Döşeme Ustaları": "zeminDosemeUstalari",
      "Dekorasyon Ustaları": "dekorasyonUstalari",
      "Peyzaj Mimarı ve Bahçıvanlar": "peyzajMimariVeBahcivanlar",
      "İnşaat Yöneticileri ve Denetçiler": "insaatYoneticileriVeDenetciler",
      "Bakım ve Onarım Ekipleri": "bakimVeOnarimEkipleri",
      "İnşaat İşçileri ve Ustalar": "insaatIscileriVeUstalar",
      "Çatı Ustaları": "catiUstalari",
    },
  };

  // Fix typeKey logic for 'category'
  const typeKey =
    type === "jobTitle"
      ? "jobTitles"
      : type === "category"
      ? "categories"
      : `${type}s`;
  const map = mappings[type] || {};
  // Cleaned name kullanılıyor
  const key = map[cleanedName];

  if (key) {
    return `${typeKey}.${key}`;
  }

  // Eşleşme bulunamazsa UYARI VER ve null döndür.
  console.warn(
    `[translationHelper] No mapping found for type '${type}' with name '${cleanedName}'. ` +
      `Returning null. Consider adding mapping or checking data source.`
  );
  return null;
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
  const { nameField = "name", type = "category" } = options;

  if (!data) return data;

  // Dizi ise her öğeyi tek tek işle
  if (Array.isArray(data)) {
    return data.map((item) => convertToTranslationKeys(item, options));
  }

  // Nesne ise ve nameField varsa, çeviri anahtarı oluştur
  if (data && typeof data === "object" && data[nameField]) {
    const translationKey = getTranslationKeyFromTurkishName(
      data[nameField],
      type
    );
    // Eğer getTranslationKeyFromTurkishName orijinal ismi döndürdüyse,
    // bunu translationKey olarak atamak yerine belki name'i doğrudan kullanmak daha iyi olabilir.
    // Şimdilik orijinal ismi (veya anahtarı) translationKey'e atıyoruz.
    return {
      ...data,
      translationKey: translationKey,
    };
  }

  return data;
}
