// Background images for daily rotating or nature aesthetic
export const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&q=80&w=1920", // Snow nature
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1920", // Meadow & sky
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1920", // Forest
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1920", // Mountain & lake
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1920", // Landscape
  "https://images.unsplash.com/photo-1506744626753-1fa44f14c22f?auto=format&fit=crop&q=80&w=1920", // River mist
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=1920", // Pine forest
  "https://images.unsplash.com/photo-1470071131384-001b85755b36?auto=format&fit=crop&q=80&w=1920", // Sunbeams in woods
  "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1920", // Deep green canopy
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&q=80&w=1920"  // Waterfall
];

export function getDailyBackgroundImage(): string {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BACKGROUND_IMAGES.length;
  return BACKGROUND_IMAGES[index];
}

/**
 * Extracts YouTube Video ID from various URL formats
 */
export function extractYouTubeId(url: string | undefined): string | null {
  if (!url) return null;
  if (url.includes('videoseries') || url.includes('/playlist?')) return null;
  
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Parses raw CSV string safely into Array of Objects
 */
export function parseCSV(str: string): Record<string, string>[] {
  const result: Record<string, string>[] = [];
  if (!str) return result;

  const lines = str.split(/\r?\n/);
  if (lines.length < 2) return result;

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ''));

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values: string[] = [];
    let inQuotes = false;
    let currentValue = '';

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        if (inQuotes && line[j + 1] === '"') {
          currentValue += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim());

    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      // Clean up surrounding quotes
      let val = values[index] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      obj[header] = val;
    });
    result.push(obj);
  }

  return result;
}
