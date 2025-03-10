export function showConfirmDialog({
  title,
  message,
  confirmText = "Evet",
  cancelText = "İptal",
  imageUrl = "https://images.unsplash.com/photo-1586282391129-76a6df230234?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
}) {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.innerHTML = `
            <div class="confirm-dialog" style="font-family: system-ui, -apple-system, sans-serif; max-width: 480px; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">
                <img 
                  src="${imageUrl}" 
                  alt="Onay görseli"
                  style="width: 100%; height: 180px; object-fit: cover; border-radius: 0.25rem; margin-bottom: 1rem;"
                />
                <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; color: #374151;">${title}</h2>
                <p style="margin-bottom: 1.5rem; color: #6B7280;">${message}</p>
                <div class="buttons" style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                    <button class="cancel" style="padding: 0.5rem 1rem; background-color: #F3F4F6; color: #374151; border-radius: 0.25rem; border: none; font-weight: 500; cursor: pointer;">${cancelText}</button>
                    <button class="confirm" style="padding: 0.5rem 1rem; background-color: #3B82F6; color: white; border-radius: 0.25rem; border: none; font-weight: 500; cursor: pointer;">${confirmText}</button>
                </div>
            </div>
        `;

    dialog.querySelector(".confirm").onclick = () => {
      dialog.remove();
      resolve(true);
    };

    dialog.querySelector(".cancel").onclick = () => {
      dialog.remove();
      resolve(false);
    };

    document.body.appendChild(dialog);
    dialog.showModal();
  });
}
