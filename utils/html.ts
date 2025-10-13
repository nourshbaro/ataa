export const decodeHtmlEntities = (str: string): string => {
  const namedEntities: Record<string, string> = {
    quot: '"',
    amp: '&',
    lt: '<',
    gt: '>',
    apos: "'",
    nbsp: '\u00A0',
    // Add more if needed
  };

  return str
    // Decode numeric entities (decimal and hex)
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Decode named entities
    .replace(/&([a-zA-Z]+);/g, (_, name) => namedEntities[name] || `&${name};`);
};
