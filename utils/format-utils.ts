export function formatFileNameAsTitle(fileName: string) {
  const withoutExtensions = fileName.replace(/\.[^/.]+$/, ""); // Remove file extension
  const withSpaces = withoutExtensions.replace(/[-_]+/g, " ").replace(/([a-z])([A-Z])/g, '$1 $2'); // Replace - and _ with spaces

  return withSpaces
    .split(" ") // Split words properly
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" ")
    .trim();
}
