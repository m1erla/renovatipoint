import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import expertService from "../../services/expertService";
import { convertToTranslationKeys } from "../../utils/translationHelper"; // Import the helper

const ExpertPage = () => {
  const { t } = useTranslation();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await expertService.getAllExperts();
        if (Array.isArray(data)) {
          // Process experts to add translationKey for jobTitle
          const processedExperts = data.map(expert => {
            if (expert.jobTitle) {
              // Assuming expert.jobTitle from backend IS the key like "jobTitle.mimarlarVeMuhendisler"
              // We need to convert this to the actual translation key the helper expects for "jobTitle" type
              // The helper getTranslationKeyFromTurkishName for "jobTitle" expects the Turkish name (e.g. "Mimarlar ve Mühendisler")
              // If expertService.getAllExperts() already returns jobTitle as "jobTitle.mimarlarVeMuhendisler"
              // then we can directly use it.
              // However, if jobTitle is something like "Mimarlar ve Mühendisler", then use the helper.

              // Let's assume expert.jobTitle is the direct key for now (e.g., "jobTitle.mimarlarVeMuhendisler")
              // as per job_title.csv's 'name' column.
              // If not, and it's a Turkish name, the helper setup would be:
              // const jobTitleProcessed = convertToTranslationKeys({ name: expert.jobTitle }, { type: 'jobTitle', nameField: 'name' });
              // return { ...expert, jobTitleTranslationKey: jobTitleProcessed.translationKey };

              // Given job_title.csv, expert.jobTitle IS the translation key.
              // So, no further processing needed by translationHelper for jobTitle on this page.
              // We just need to use t(expert.jobTitle).
              return expert; // No change needed if expert.jobTitle is already the key.
            }
            return expert;
          });
          setExperts(processedExperts);
        } else {
          console.warn("Fetched experts data is not an array:", data);
          setExperts([]);
        }
      } catch (err) {
        console.error("Error fetching experts:", err);
        setError(t("errors.fetchFailed", "Failed to fetch experts."));
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, [t]);

  const handleExpertClick = (id) => {
    navigate(`/expert-profile/${id}`);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/images/placeholder-ad.png";
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gray-900 dark:text-gray-100 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-foreground dark:text-white">
          {t("experts.title", "Uzmanlar")}
        </h1>
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
            <strong className="font-bold">{t("errors.errorTitle")}</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experts.map((expert, index) => (
            <motion.div
              key={expert.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              className="bg-card dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-border dark:border-gray-700 cursor-pointer"
              onClick={() => handleExpertClick(expert.id)}
            >
              <div className="relative h-56 overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900 pt-8"> {/* Added pt-8 for better image position */}
                <img
                  src={expert.profileImageUrl || "/images/placeholder-ad.png"}
                  alt={expert.fullName} // Alt text should ideally be translated if fullName can vary by language
                  className="w-32 h-32 object-cover rounded-full border-4 border-primary shadow-lg mx-auto" // Removed mt-8, using pt-8 on parent
                  onError={handleImageError}
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold mb-2 text-foreground dark:text-white">
                  {expert.fullName}
                </h3>
                {/* Use t() for jobTitle. Assuming expert.jobTitle is like "jobTitle.mimarlarVeMuhendisler" */}
                <p className="text-primary font-medium mb-2">
                  {expert.jobTitle ? t(expert.jobTitle, expert.jobTitle.split('.').pop()) : t('experts.noJobTitle', 'No Job Title')}
                </p>
                <p className="text-muted-foreground dark:text-gray-300 mb-4 text-sm min-h-[60px]"> {/* Added text-sm and min-height for bio */}
                  {/* Bio might also need translation if it's a key, or it's free text */}
                  {expert.bio || t('experts.noBio', 'No biography available.')}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4 min-h-[30px]"> {/* Added mb-4 and min-height for skills */}
                  {expert.skills && expert.skills.length > 0 ? expert.skills.map((skill, i) => (
                    <span key={i} className="inline-block bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {/* Skills might also need translation if they are keys */}
                      {skill}
                    </span>
                  )) : (
                    <span className="text-xs text-muted-foreground italic">{t('experts.noSkills', 'No skills listed.')}</span>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground dark:text-gray-400">
                  {/* Contact info generally doesn't need translation unless labels are added */}
                  {expert.email && <span>{expert.email}</span>}
                  {expert.phone && <span>{expert.phone}</span>}
                  {expert.location && <span>{expert.location}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {!loading && experts.length === 0 && (
          <div className="text-center text-lg text-muted-foreground mt-16">
            {t("experts.empty", "Hiç uzman bulunamadı.")}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertPage;