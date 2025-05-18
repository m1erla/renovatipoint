import React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline"; // Example icon

function PortfolioCard({ project, formatDate, t, onImageError }) {
  const defaultImage = "/placeholder-portfolio.png"; // Define a default placeholder image

  return (
    <div className="bg-card dark:bg-gray-800 rounded-lg shadow-md overflow-hidden group">
      <img
        src={project.imageUrl || defaultImage}
        alt={project.title || "Portfolio Project Image"}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        onError={
          onImageError ||
          ((e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          })
        }
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground dark:text-white mb-1">
          {project.title || "Project Title"}
        </h3>
        <p className="text-sm text-muted-foreground dark:text-gray-400 mb-2 line-clamp-3">
          {project.description || "Project description placeholder..."}
        </p>
        {project.completionDate && (
          <div className="flex items-center text-xs text-muted-foreground dark:text-gray-500 mt-3">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>
              {t
                ? t(
                    "expertProfile.portfolio.portfolioCard.completionDateLabel",
                    "Completion Date:"
                  )
                : "Completion Date:"}{" "}
              {formatDate
                ? formatDate(project.completionDate)
                : new Date(project.completionDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioCard;
