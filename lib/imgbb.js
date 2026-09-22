/**
 * Service to handle image uploads to imgBB
 */

const IMGBB_API_KEY =
  process.env.NEXT_PUBLIC_IMGBB_API_KEY || '62259e572db8edcc3c3aab4674399172';

/**
 * Upload an image file or base64 data to imgBB
 * @param {File|Blob} file - The image file to upload
 * @returns {Promise<string>} The direct display URL of the uploaded image
 */
export async function uploadImageToImgBB(file) {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data?.error?.message || 'Failed to upload image to imgBB'
    );
  }

  // data.data.display_url or data.data.url
  return data.data.display_url || data.data.url;
}
