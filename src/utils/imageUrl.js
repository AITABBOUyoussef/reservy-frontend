const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const imageBaseUrl = apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

export function getImageUrl(imageName) {
  if (!imageName) return '';

  if (/^https?:\/\//i.test(imageName)) {
    return imageName;
  }

  const normalizedName = String(imageName)
    .replace(/^\/+/, '')
    .replace(/^photos\/+/i, '');
  const fileName = /\.[^/]+$/.test(normalizedName)
    ? normalizedName
    : `${normalizedName}.png`;

  return `${imageBaseUrl}/photos/${fileName}`;
}
