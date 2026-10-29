// Canvas-based image resizing and compression utilities

export interface ProcessedImages {
  originalOrCompressedBase64: string; // Max 1024px
  thumbnailBase64: string;             // Max 200px
  dimensions: { width: number; height: number };
}

/**
 * Reads a File, resizes to max dimension (e.g. 1024px for analysis and 200px for thumbnail),
 * and returns JPEG base64 strings.
 */
export async function processImageFile(file: File): Promise<ProcessedImages> {
  return new Promise((resolve, reject) => {
    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return reject(new Error('Invalid image type. Please upload a JPG, PNG, or WEBP image.'));
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return reject(new Error('Image size exceeds 10MB limit. Please upload a smaller image.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image in browser.'));
      img.onload = () => {
        try {
          // 1. Generate max 1024px for analysis
          const maxDim = 1024;
          let w = img.width;
          let h = img.height;

          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas 2D context unavailable');

          ctx.drawImage(img, 0, 0, w, h);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

          // 2. Generate 200px thumbnail
          const thumbDim = 200;
          let tw = img.width;
          let th = img.height;
          if (tw > th) {
            th = Math.round((th * thumbDim) / tw);
            tw = thumbDim;
          } else {
            tw = Math.round((tw * thumbDim) / th);
            th = thumbDim;
          }

          const thumbCanvas = document.createElement('canvas');
          thumbCanvas.width = tw;
          thumbCanvas.height = th;
          const thumbCtx = thumbCanvas.getContext('2d');
          if (!thumbCtx) throw new Error('Canvas 2D context unavailable');

          thumbCtx.drawImage(img, 0, 0, tw, th);
          const thumbDataUrl = thumbCanvas.toDataURL('image/jpeg', 0.82);

          resolve({
            originalOrCompressedBase64: compressedDataUrl,
            thumbnailBase64: thumbDataUrl,
            dimensions: { width: w, height: h }
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
