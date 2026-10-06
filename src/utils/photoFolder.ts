export const formatPhotoFolder = (folder: string) => folder
  .replace(/-/g, ' ')
  .replace(/(^|[\s/])\p{L}/gu, (word) => word.toUpperCase());
