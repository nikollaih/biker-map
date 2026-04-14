/**
 * Compresses and resizes an image File using the Canvas API.
 * @param {File} file - Original image file
 * @param {object} options
 * @param {number} options.maxWidth  - Max width in px (default 1200)
 * @param {number} options.maxHeight - Max height in px (default 1200)
 * @param {number} options.quality  - JPEG quality 0-1 (default 0.8)
 * @returns {Promise<File>} Compressed file
 */
export function compressImage(file, { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = {}) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(objectUrl);

            let { width, height } = img;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) return reject(new Error("No se pudo comprimir la imagen."));
                    resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }));
                },
                "image/jpeg",
                quality
            );
        };

        img.onerror = reject;
        img.src = objectUrl;
    });
}
