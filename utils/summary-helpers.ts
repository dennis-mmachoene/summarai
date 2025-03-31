export const parseSection = (section: string): { title: string; points: string[] } => {
  const [title, ...content] = section.split('\n');

  const cleanTitle = title.startsWith('#') ? title.substring(1).trim() : title.trim();

  const points: string[] = [];
  let currentPoint = "";

  content.forEach((line) => {
    const trimmedLine = line.trim();

    // New point starts on each line that begins with a bullet or special character
    if (/^[•\-*]/.test(trimmedLine) || trimmedLine.startsWith("=")) {
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = trimmedLine;
    } else if (!trimmedLine) {
      // Skip empty lines
      if (currentPoint) points.push(currentPoint.trim());
      currentPoint = "";
    } else {
      // Continue the current point
      currentPoint += " " + trimmedLine;
    }
  });

  // Push the last collected point
  if (currentPoint) points.push(currentPoint.trim());

  return {
    title: cleanTitle,
    points: points.filter(
      (point) => point && !point.startsWith("#") && !point.startsWith("|Choose")
    ),
  };
};

  
export function parsePoint(point: string) {
    const isNumbered = /^\d+\./.test(point);
    const isMainPoint = /^[•\-\*]/.test(point); // Supports different bullet characters

    const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]/u; // Improved emoji detection
    const hasEmoji = emojiRegex.test(point);
    const isEmpty = /^\s*$/.test(point); // Explicitly checks for only whitespace

    return { isNumbered, isMainPoint, isEmpty, hasEmoji };
}

export function parseEmojiPoint(content: string) {
    const cleanContent = content.replace(/^[•\-\*]\s*/, ''); // Remove bullets and leading spaces

    // Match full emoji sequences
    const matches = cleanContent.match(/^([\p{Extended_Pictographic}\u200D]+)\s*(.+)$/u);
    if (!matches) return null;

    const [_, emoji, text] = matches;
    return {
        emoji: emoji.trim(),
        text: text.trim()
    };
}
