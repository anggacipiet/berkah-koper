export type DescBlock =
  | { type: 'p'; text: string }
  | { type: 'li'; text: string; depth: number; marker: 'star' | 'dot' };

/**
 * Parse deskripsi Keystatic (* / • + Tab) jadi blok untuk hanging-indent.
 * Baris lanjutan rata dengan huruf pertama setelah bullet.
 */
export function parseProductDescription(raw: string): DescBlock[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const blocks: DescBlock[] = [];
  let para: string[] = [];

  const flushPara = () => {
    const text = para.join(' ').trim();
    if (text) blocks.push({ type: 'p', text });
    para = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushPara();
      continue;
    }

    const star = trimmed.match(/^\*\s+(.*)$/);
    const dot = trimmed.match(/^[•\-]\s+(.*)$/);
    const leading = line.match(/^[\t ]*/)?.[0] ?? '';
    const depth =
      (leading.match(/\t/g)?.length ?? 0) +
      Math.floor((leading.replace(/\t/g, '').length || 0) / 2);

    if (star) {
      flushPara();
      blocks.push({ type: 'li', text: star[1], depth: 0, marker: 'star' });
      continue;
    }
    if (dot) {
      flushPara();
      blocks.push({
        type: 'li',
        text: dot[1],
        depth: Math.max(1, depth || 1),
        marker: 'dot',
      });
      continue;
    }

    para.push(trimmed);
  }
  flushPara();
  return blocks;
}
