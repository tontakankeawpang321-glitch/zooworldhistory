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

export async function fetchDocumentaries(): Promise<Documentary[]> {
  try {
    const res = await fetch(`${MAIN_VIDEOS_CSV_URL}&t=${Date.now()}`);
    if (!res.ok) throw new Error("Network response was not ok");
    const csvText = await res.text();
    const parsed = parseCSV(csvText);

    if (parsed.length > 0) {
      const mapped = parsed.map((item, index) => {
        const rawUrl = item.url || item.videourl || item.link || '';
        const videoId = extractYouTubeId(rawUrl) || 'c8jE2mZMA1Q';
        const title = item.title || item.name || 'ไม่มีชื่อสารคดี';
        const description = item.description || item.desc || 'ไม่มีรายละเอียด';
        const category = item.category || item.group || 'วิดีโอแนะนำ';
        
        return {
          id: `yt_${videoId}_${index}`,
          category: category.trim(),
          title: title.trim(),
          description: description.trim(),
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          videoUrl: rawUrl || `https://www.youtube.com/watch?v=${videoId}`,
          videoId: videoId
        };
      });

      // Filter out invalid empty items
      const valid = mapped.filter(d => d.title.length > 0);
      if (valid.length > 0) return valid;
    }
  } catch (error) {
    console.warn("Failed to fetch Google Sheet CSV, using fallback data:", error);
  }
  return FALLBACK_DOCUMENTARIES;
}

export async function fetchKnowledgeData(): Promise<KnowledgeItem[]> {
  try {
    const res = await fetch(`${KNOWLEDGE_CSV_URL}&t=${Date.now()}`);
    if (!res.ok) throw new Error("Network response was not ok");
    const csvText = await res.text();
    const parsed = parseCSV(csvText);

    if (parsed.length > 0) {
      const mapped = parsed.map((item, index) => {
        const title = item.title || item.name || 'ข้อมูลสัตว์โลก';
        const description = item.description || item.detail || item.desc || '';
        const thumbnail = item.thumbnail || item.image || item.img || "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&q=80&w=600";
        const linkUrl = item.linkurl || item.link || item.url || "https://sites.google.com/view/zootopiaworld/%E0%B8%AB%E0%B8%99%E0%B8%B2%E0%B9%81%E0%B8%A3%E0%B8%81";
        const category = item.category || 'ความรู้ทั่วไป';

        return {
          id: `k_${index}`,
          title: title.trim(),
          description: description.trim(),
          thumbnail: thumbnail.trim(),
          linkUrl: linkUrl.trim(),
          category: category.trim()
        };
      });

      const valid = mapped.filter(k => k.title.length > 0);
      if (valid.length > 0) return valid;
    }
  } catch (error) {
    console.warn("Failed to fetch knowledge CSV, using fallback data:", error);
  }
  return FALLBACK_KNOWLEDGE;
}
