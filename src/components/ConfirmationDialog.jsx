export function showConfirmDialog({
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
}) {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.innerHTML = `
            <div class="confirm-dialog">
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="buttons">
                    <button class="confirm">${confirmText}</button>
                    <button class="cancel">${cancelText}</button>
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
