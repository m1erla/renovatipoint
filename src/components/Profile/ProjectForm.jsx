import React from "react";

function ProjectForm({ isOpen, onClose, onSubmit, loading, t }) {
  if (!isOpen) {
    return null;
  }

  // Basic form structure as a placeholder
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-background dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full p-8 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-foreground dark:text-white mb-6">
          {t
            ? t("expertProfile.addProjectDialog.title", "Add New Project")
            : "Add New Project"}
        </h2>
        {/* Placeholder Content */}
        <p className="text-muted-foreground dark:text-gray-400">
          Project form content will go here.
        </p>
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-muted-foreground hover:text-foreground bg-background/80 hover:bg-background dark:bg-gray-700/80 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white transition-all border border-border dark:border-gray-600"
          >
            {t ? t("common.cancelButton", "Cancel") : "Cancel"}
          </button>
          <button
            // onClick={onSubmit} // Placeholder, implement actual submit logic later
            disabled={loading}
            className={`px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
            }`}
          >
            {loading
              ? t
                ? t(
                    "expertProfile.addProjectDialog.submittingButton",
                    "Creating..."
                  )
                : "Creating..."
              : t
              ? t(
                  "expertProfile.addProjectDialog.submitButton",
                  "Create Project"
                )
              : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectForm;
