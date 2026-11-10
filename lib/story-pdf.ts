import type { LoveLetter, Memory, TimelineEvent } from '@/lib/types';

export interface StoryPdfData {
  couple: { name: string; anniversaryDate: string };
  memories: Memory[];
  letters: LoveLetter[];
  timelineEvents: TimelineEvent[];
}

async function loadImage(url: string): Promise<{ data: string; format: 'JPEG' | 'PNG' | 'WEBP' }> {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Image link must use HTTP or HTTPS.');
  }
  const response = await fetch(parsedUrl);
  if (!response.ok) throw new Error(`Image request failed (${response.status}).`);
  const image = await response.blob();
  const formats: Record<string, 'JPEG' | 'PNG' | 'WEBP'> = {
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/webp': 'WEBP',
  };
  const format = formats[image.type];
  if (!format) throw new Error('PDF image must be JPEG, PNG, or WebP.');
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string'
      ? resolve(reader.result)
      : reject(new Error('Could not read the image.'));
    reader.onerror = () => reject(new Error('Could not read the image.'));
    reader.readAsDataURL(image);
  });
  return { data, format };
}

export async function downloadStoryPdf(story: StoryPdfData): Promise<void> {
  const [{ jsPDF }, { default: QRCode }] = await Promise.all([import('jspdf'), import('qrcode')]);
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 16;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const addPage = () => {
    pdf.addPage();
    cursorY = margin;
  };
  const ensureSpace = (height: number) => {
    if (cursorY + height > pageHeight - margin) addPage();
  };
  const addText = (text: string, size: number, options: { bold?: boolean; color?: [number, number, number] } = {}) => {
    pdf.setFont('helvetica', options.bold ? 'bold' : 'normal');
    pdf.setFontSize(size);
    if (options.color) pdf.setTextColor(...options.color);
    const lines = pdf.splitTextToSize(text, contentWidth) as string[];
    const lineHeight = size * 0.48;
    for (const line of lines) {
      ensureSpace(lineHeight + 1);
      pdf.text(line, margin, cursorY);
      cursorY += lineHeight;
    }
    cursorY += 2;
    pdf.setTextColor(45, 35, 40);
  };

  pdf.setTextColor(122, 42, 70);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.text('Our Story', margin, 42);
  cursorY = 58;
  addText(story.couple.name || 'Our Story', 18, { bold: true });
  if (story.couple.anniversaryDate) addText(`Anniversary: ${story.couple.anniversaryDate}`, 11);
  addText(`Exported: ${new Date().toLocaleDateString()}`, 10);

  const qrData = await QRCode.toDataURL(window.location.origin, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 256,
  });
  pdf.addImage(qrData, 'PNG', pageWidth - margin - 36, 20, 36, 36);
  addText('Scan to open this app', 9);
  cursorY += 6;

  if (!story.memories.length && !story.letters.length && !story.timelineEvents.length) {
    addText('No saved memories, letters, or timeline moments were found in this browser.', 11);
  }

  for (const memory of story.memories) {
    addPage();
    addText(memory.title || 'Untitled memory', 18, { bold: true, color: [122, 42, 70] });
    const details = [memory.memoryDate, memory.location].filter(Boolean).join(' · ');
    if (details) addText(details, 10);
    if (memory.imagePath) {
      try {
        const image = await loadImage(memory.imagePath);
        const dimensions = pdf.getImageProperties(image.data);
        const maxWidth = contentWidth;
        const maxHeight = 105;
        const scale = Math.min(maxWidth / dimensions.width, maxHeight / dimensions.height);
        const width = dimensions.width * scale;
        const height = dimensions.height * scale;
        ensureSpace(height + 4);
        pdf.addImage(image.data, image.format, margin, cursorY, width, height);
        cursorY += height + 5;
      } catch (error) {
        console.warn(`Could not embed memory image for "${memory.title}":`, error);
        addText(`Photo could not be embedded. Image link: ${memory.imagePath}`, 9);
      }
    }
    addText(memory.story || '', 11);
  }

  for (const event of story.timelineEvents) {
    addPage();
    addText(event.title || 'Untitled moment', 18, { bold: true, color: [122, 42, 70] });
    if (event.eventDate) addText(event.eventDate, 10);
    if (event.imageUrl) {
      try {
        const image = await loadImage(event.imageUrl);
        const dimensions = pdf.getImageProperties(image.data);
        const scale = Math.min(contentWidth / dimensions.width, 105 / dimensions.height);
        const width = dimensions.width * scale;
        const height = dimensions.height * scale;
        ensureSpace(height + 4);
        pdf.addImage(image.data, image.format, margin, cursorY, width, height);
        cursorY += height + 5;
      } catch (error) {
        console.warn(`Could not embed timeline image for "${event.title}":`, error);
        addText(`Photo could not be embedded. Image link: ${event.imageUrl}`, 9);
      }
    }
    addText(event.story || '', 11);
  }

  if (story.letters.length) addPage();
  for (let index = 0; index < story.letters.length; index += 1) {
    const letter = story.letters[index];
    if (index > 0) ensureSpace(28);
    addText(letter.title || 'Untitled letter', 18, { bold: true, color: [122, 42, 70] });
    if (letter.revealAt) addText(`Opens: ${letter.revealAt}`, 10);
    addText(letter.body || '', 11);
  }

  pdf.save('our-story.pdf');
}
