import { Documentary, KnowledgeItem } from '../types';
import { extractYouTubeId, parseCSV } from '../utils/csvParser';

export const MAIN_VIDEOS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvdWEwItR097kC2ZbCiOTGW2zllrcQHJP2wCrIqM4BUHX7Ldbv_7tqwzs4GQcijQhUhLwMtxR7GHw4/pub?output=csv"; 
export const KNOWLEDGE_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPQLPk1F0Qx73zub432BIFb989bVRjjUZTl2gLcyqfWDJTuoseLA51ZE0PLJGHUUZdjxEhaE_HhDEV/pub?output=csv";

// Fallback high quality data in case network is offline or Google Sheets is unreachable
const FALLBACK_DOCUMENTARIES: Documentary[] = [
  {
    id: "yt_c8jE2mZMA1Q_0",
    category: "สัตว์ป่าสงวน",
    title: "สารคดี สัตว์ป่าห้วยขาแข้ง ดินแดนแห่งมรดกโลก",
    description: "การสำรวจชีวิตสัตว์ป่าในผืนป่าตะวันตกอันอุดมสมบูรณ์และงดงามของประเทศไทย",
    thumbnail: "https://i.ytimg.com/vi/c8jE2mZMA1Q/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=c8jE2mZMA1Q",
    videoId: "c8jE2mZMA1Q"
  },
  {
    id: "yt_W8Si420J9mU_1",
    category: "สัตว์ทะเล",
    title: "สารคดี โลกใต้ทะเลลึกและแนวปะการังไทย",
    description: "ท่องโลกใต้ท้องทะเลอันลึกลับ พบกับสิ่งมีชีวิตใต้ทะเลลึกที่หาชมได้ยาก",
    thumbnail: "https://i.ytimg.com/vi/W8Si420J9mU/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=W8Si420J9mU",
    videoId: "W8Si420J9mU"
  },
  {
    id: "yt_7L3d5Jm79M8_2",
    category: "สัตว์เลื้อยคลาน",
    title: "เจ้าแห่งการล่า: ความลับของงูพิษและจระเข้",
    description: "เจาะลึกสัญชาตญาณนักล่าและวิวัฒนาการอันน่าทึ่งของสัตว์เลื้อยคลาน",
    thumbnail: "https://i.ytimg.com/vi/7L3d5Jm79M8/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=7L3d5Jm79M8",
    videoId: "7L3d5Jm79M8"
  },
  {
    id: "yt_c8jE2mZMA1Q_3",
    category: "นกและสัตว์ปีก",
    title: "นกเงือก ผู้ปลูกป่าแห่งพงไพร",
    description: "เรื่องราวของนกเงือก สัญลักษณ์แห่งความรักเดียวใจเดียวและสมดุลระบบนิเวศ",
    thumbnail: "https://i.ytimg.com/vi/c8jE2mZMA1Q/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=c8jE2mZMA1Q",
    videoId: "c8jE2mZMA1Q"
  }
];

const FALLBACK_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "k_1",
    title: "เสือโคร่งอินโดจีน (Indochinese Tiger)",
    description: "นักล่าขนาดใหญ่แห่งผืนป่าตะวันตก มีบทบาทสำคัญในการควบคุมประชากรของสัตว์กินพืช",
    thumbnail: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=600",
    linkUrl: "https://sites.google.com/view/zootopiaworld/%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81",
    category: "สัตว์เลี้ยงลูกด้วยนม"
  },
  {
    id: "k_2",
    title: "ช้างป่าไทย (Asian Elephant)",
    description: "สัตว์คู่บ้านคู่เมืองที่มีบทบาทสำคัญในการกระจายเมล็ดพันธุ์พืชในป่าดิบชื้น",
    thumbnail: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=600",
    linkUrl: "https://sites.google.com/view/zootopiaworld/%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81",
    category: "สัตว์เลี้ยงลูกด้วยนม"
  },
  {
    id: "k_3",
    title: "นกเงือกหัวหงอก (White-crowned Hornbill)",
    description: "ดัชนีชี้วัดความอุดมสมบูรณ์ของป่าไม้ดิบชื้น และนักปลูกป่าทางธรรมชาติ",
    thumbnail: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=600",
    linkUrl: "https://sites.google.com/view/zootopiaworld/%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81",
    category: "สัตว์ปีก"
  }
];

// Helper to extract field value dynamically from parsed object using multiple possible key names
function getFieldValue(item: Record<string, string>, possibleKeys: string[]): string {
  // 1. Exact or lowercased key match
  for (const key of possibleKeys) {
    if (item[key] && item[key].trim()) {
      return item[key].trim();
    }
  }

  // 2. Loose match (e.g. key includes Thai or English keyword)
  const itemKeys = Object.keys(item);
  for (const k of itemKeys) {
    const kLower = k.toLowerCase();
    for (const pKey of possibleKeys) {
      if (kLower.includes(pKey) && item[k] && item[k].trim()) {
        return item[k].trim();
      }
    }
  }

  return '';
}

export async function fetchDocumentaries(): Promise<Documentary[]> {
  try {
    // Add cache-busting timestamp and no-store header to fetch freshest Google Sheets data
    const res = await fetch(`${MAIN_VIDEOS_CSV_URL}&t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const csvText = await res.text();
    const parsed = parseCSV(csvText);

    if (parsed.length > 0) {
      const urlKeys = ['url', 'videourl', 'link', 'youtube', 'video', 'ลิงก์', 'ลิงค์', 'วิดีโอ', 'ลิ้ง', 'ลิ้งค์'];
      const titleKeys = ['title', 'name', 'header', 'heading', 'ชื่อ', 'ชื่อเรื่อง', 'ชื่อสารคดี', 'หัวข้อ', 'รายการ'];
      const categoryKeys = ['category', 'group', 'type', 'หมวดหมู่', 'ประเภท', 'กลุ่ม'];
      const descKeys = ['description', 'desc', 'detail', 'details', 'รายละเอียด', 'คำอธิบาย', 'เรื่องย่อ'];

      const validDocs: Documentary[] = [];

      parsed.forEach((item, index) => {
        // 1. Locate YouTube video URL
        let rawUrl = getFieldValue(item, urlKeys);

        // If direct field lookup failed, scan all cell values for YouTube link
        if (!rawUrl) {
          for (const val of Object.values(item)) {
            if (val && (val.toLowerCase().includes('youtube.com') || val.toLowerCase().includes('youtu.be'))) {
              rawUrl = val.trim();
              break;
            }
          }
        }

        // Extract YouTube ID
        const videoId = extractYouTubeId(rawUrl);

        // CRITICAL: If no valid YouTube ID exists (row was deleted in Google Sheets or has no video link), SKIP IT!
        if (!videoId) {
          return;
        }

        // 2. Locate Title
        let title = getFieldValue(item, titleKeys);

        // Clean leading/trailing punctuation or commas (e.g. ",https://youtube.com...")
        title = title.replace(/^[,\s"':;]+|[,\s"':;]+$/g, '').trim();

        // If title is a raw URL (e.g. pasted URL into title cell), strip it out
        if (title.toLowerCase().startsWith('http://') || title.toLowerCase().startsWith('https://') || title.toLowerCase().includes('youtube.com') || title.toLowerCase().includes('youtu.be')) {
          title = '';
        }

        // Locate Description & Category
        const description = getFieldValue(item, descKeys);
        let category = getFieldValue(item, categoryKeys);

        // Fallback title generation if title cell was left empty in Google Sheets
        if (!title) {
          if (description) {
            title = description.slice(0, 45) + (description.length > 45 ? '...' : '');
          } else if (category) {
            title = `สารคดีสัตว์โลก หมวด${category}`;
          } else {
            // If title, description, and category are ALL blank, the row was deleted in Google Sheets -> SKIP IT!
            return;
          }
        }

        if (!category) {
          category = 'วิดีโอแนะนำ';
        }

        validDocs.push({
          id: `yt_${videoId}_${index}`,
          category: category.trim(),
          title: title.trim(),
          description: description.trim(),
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          videoUrl: rawUrl || `https://www.youtube.com/watch?v=${videoId}`,
          videoId: videoId
        });
      });

      if (validDocs.length > 0) return validDocs;
    }
  } catch (error) {
    console.warn("Failed to fetch Google Sheet CSV, using fallback data:", error);
  }
  return FALLBACK_DOCUMENTARIES;
}

export async function fetchKnowledgeData(): Promise<KnowledgeItem[]> {
  try {
    const res = await fetch(`${KNOWLEDGE_CSV_URL}&t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const csvText = await res.text();
    const parsed = parseCSV(csvText);

    if (parsed.length > 0) {
      const titleKeys = ['title', 'name', 'header', 'ชื่อ', 'ชื่อสัตว์', 'หัวข้อ', 'เรื่อง'];
      const descKeys = ['description', 'detail', 'desc', 'รายละเอียด', 'ข้อมูล', 'คำอธิบาย'];
      const thumbKeys = ['thumbnail', 'image', 'img', 'รูป', 'รูปภาพ', 'ภาพประกอบ'];
      const linkKeys = ['linkurl', 'link', 'url', 'เว็บไซต์', 'ลิงก์', 'ลิงค์'];
      const categoryKeys = ['category', 'group', 'หมวดหมู่', 'ประเภท'];

      const validItems: KnowledgeItem[] = [];

      parsed.forEach((item, index) => {
        let title = getFieldValue(item, titleKeys);
        title = title.replace(/^[,\s"':;]+|[,\s"':;]+$/g, '').trim();

        let description = getFieldValue(item, descKeys);
        description = description.replace(/^[,\s"':;]+|[,\s"':;]+$/g, '').trim();

        // If both title and description are empty, row was deleted in Google Sheets -> SKIP IT!
        if (!title && !description) {
          return;
        }

        if (!title) {
          title = description.slice(0, 40) + '...';
        }

        let thumbnail = getFieldValue(item, thumbKeys);
        if (!thumbnail || thumbnail.toLowerCase().startsWith('http') === false) {
          thumbnail = "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=600";
        }

        let linkUrl = getFieldValue(item, linkKeys);
        if (!linkUrl || linkUrl.toLowerCase().startsWith('http') === false) {
          linkUrl = "https://sites.google.com/view/zootopiaworld/%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81";
        }

        let category = getFieldValue(item, categoryKeys);
        if (!category) {
          category = 'ความรู้ทั่วไป';
        }

        validItems.push({
          id: `k_${index}`,
          title: title.trim(),
          description: description.trim(),
          thumbnail: thumbnail.trim(),
          linkUrl: linkUrl.trim(),
          category: category.trim()
        });
      });

      if (validItems.length > 0) return validItems;
    }
  } catch (error) {
    console.warn("Failed to fetch knowledge CSV, using fallback data:", error);
  }
  return FALLBACK_KNOWLEDGE;
}
