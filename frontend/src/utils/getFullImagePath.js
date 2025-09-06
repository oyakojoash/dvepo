export default function getFullImagePath(relativePath, fallback = '/images/fallback-logo.png') {
  if (!relativePath || typeof relativePath !== 'string') return `http://localhost:5000${fallback}`;
  return relativePath.startsWith('/')
    ? `http://localhost:5000${relativePath}`
    : `http://localhost:5000/${relativePath}`;
}
