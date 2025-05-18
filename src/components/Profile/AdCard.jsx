import React from "react";
import { PencilIcon, EyeIcon } from "@heroicons/react/24/outline"; // Example icons

function AdCard({ ad, onEdit, t, onImageError }) {
  const defaultImage = "/placeholder-ad.png"; // Define a default placeholder image

  return (
    <div className="bg-card dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row">
      <img
        src={ad.imageUrl || defaultImage}
        alt={ad.title || "Advertisement Image"}
        className="w-full sm:w-48 h-48 sm:h-auto object-cover"
        onError={
          onImageError ||
          ((e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          })
        } // Use passed handler or default
      />
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground dark:text-white mb-1">
            {ad.title || "Ad Title"}
          </h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2 line-clamp-2">
            {ad.description || "Ad description placeholder..."}
          </p>
          {/* Add more ad details if needed, e.g., price, category */}
          <span className="text-sm font-medium text-primary">
            {ad.price ? `${ad.price} €` : ""}
          </span>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {/* View Ad Button (Optional) - Navigate to public ad view */}
          <button
            onClick={() => {
              /* Navigate to ad view page: e.g., navigate(`/ad/${ad.slug || ad.id}`) */
            }}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-gray-600 hover:bg-gray-700"
            aria-label={t ? t("common.view", "View") : "View"}
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            {t ? t("common.view", "View") : "View"}
          </button>
          <button
            onClick={() => onEdit(ad.id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary hover:bg-primary/90"
            aria-label={
              t ? t("profile.ads.adCard.editButtonLabel", "Edit Ad") : "Edit Ad"
            }
          >
            <PencilIcon className="w-4 h-4 mr-1" />
            {t ? t("common.edit", "Edit") : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdCard;
