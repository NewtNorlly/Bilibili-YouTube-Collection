import { getCatalog } from './catalog';
import type { Note } from './catalog';

/**
 * 我的书架 · 数据层
 *
 * 「我的书架」只包含微信读书归档的书籍文本（书摘），
 * 「网络博主」只包含微信读书之外的创作者 / 专题合集，二者严格分离。
 *
 * 展示层规则（不修改任何原始 md）：
 * 1. 源 frontmatter 缺 category 的书，按标题关键词兜底归类，做到书架无「未分类」；
 * 2. 所有书目按「最新阅读笔记时间」（lastReadDate → finishedDate → readingDate）
 *    从新到旧排列，网格中即从左到右、从上到下。
 */

/** 未标注分类且兜底规则也未命中的书统一归入「未分类」 */
export const UNCATEGORIZED = '未分类';

/**
 * 分类展示顺序 —— 参考 weread-export-tool/output 导出目录的分类方案，
 * 并按常用度微调，「未分类」固定在最后（正常情况下不会出现）。
 */
export const BOOKSHELF_CATEGORY_ORDER = [
  '文学',
  '社会文化',
  '历史',
  '精品小说',
  '个人成长',
  '计算机',
  '政治军事',
  '哲学宗教',
  '心理',
  '科学技术',
  '教育学习',
  '人物传记',
  '童书',
  '经济理财',
  '医学健康',
  '生活百科',
  UNCATEGORIZED,
];

/**
 * 缺分类书的兜底归类规则（按标题包含关键词匹配，自上而下先命中先生效）。
 * 仅作用于展示层，绝不回写源文件。
 */
const FALLBACK_RULES: Array<[RegExp, string]> = [
  // —— 教育学习 ——
  [/Learn to Read Greek/i, '教育学习'],
  [/研究生论文写作/, '教育学习'],
  [/维克多英语/, '教育学习'],
  [/公文格式/, '教育学习'],
  // —— 精品小说 ——
  [/白鹿原/, '精品小说'],
  // —— 心理 ——
  [/巨婴国/, '心理'],
  // —— 计算机 ——
  [/人月神话/, '计算机'],
  // —— 人物传记 ——
  [/只是为了好玩/, '人物传记'],
  // —— 历史 ——
  [/人类大历史|突厥历法|国史大纲/, '历史'],
  // —— 哲学宗教 ——
  [/培根随笔|中国社会中的宗教|信仰与德行/, '哲学宗教'],
  // —— 经济理财 ——
  [/国家为什么会失败|曼昆经济学/, '经济理财'],
  // —— 政治军事 ——
  [/新华社|政事儿|长安街知事|卢克文|波兰球/, '政治军事'],
  // —— 文学（书评 / 文学刊物优先于通用报刊规则） ——
  [/人民文学|新京报书评/, '文学'],
  // —— 科学技术 ——
  [/毕导/, '科学技术'],
  // —— 社会文化（社会学、语言学、公共空间、综合报刊等） ——
  [
    /社会学|江村经济|茶馆|强社会与弱国家|理论好用吗|摩登语言学|胭脂与焉支|语言学的邀请|法学教书匠|吉尼斯|账号已迁移|中国新闻周刊|北京日报|北京青年报|南方都市报|南风窗|潇湘晨报|中县干部|冯军旗/,
    '社会文化',
  ],
];

export interface BookshelfCategory {
  name: string;
  noteCount: number;
  notes: Note[];
}

export interface BookshelfData {
  categories: BookshelfCategory[];
  allBooks: Note[];
  totalBooks: number;
  readingStatsNote?: Note;
}

/** 书的最新阅读时间排序键（YYYY-MM-DD 可直接字符串比较；缺失排末尾） */
export function bookSortKey(note: Note): string {
  const w = note.weread;
  return w?.lastReadDate?.trim() || w?.finishedDate?.trim() || w?.readingDate?.trim() || '';
}

/** 从新到旧：最新阅读笔记时间降序，同日期以标题稳定兜底 */
export function compareByRecent(left: Note, right: Note): number {
  const lk = bookSortKey(left);
  const rk = bookSortKey(right);
  if (lk !== rk) return rk.localeCompare(lk);
  return left.title.localeCompare(right.title, 'zh-CN');
}

/** 取书摘的父分类（「文学-外国文学」→「文学」），缺分类时走兜底规则 */
export function bookParentCategory(note: Note): string {
  const full = note.weread?.category?.trim();
  if (full) {
    const parent = full.split('-')[0].trim();
    if (parent) return parent;
  }

  const title = note.title ?? '';
  for (const [pattern, category] of FALLBACK_RULES) {
    if (pattern.test(title)) return category;
  }
  return UNCATEGORIZED;
}

export async function getBookshelf(): Promise<BookshelfData> {
  const catalog = await getCatalog();

  const books = catalog.notes.filter(
    (note) => note.collectionName === '微信读书' && note.kind === 'book' && !note.draft,
  );
  const readingStatsNote = catalog.notes.find(
    (note) => note.collectionName === '微信读书' && note.kind === 'stats' && !note.draft,
  );

  const grouped = new Map<string, Note[]>();
  for (const note of books) {
    const category = bookParentCategory(note);
    const list = grouped.get(category) ?? [];
    list.push(note);
    grouped.set(category, list);
  }

  // 每个分类内部：最新阅读的书在前
  for (const list of grouped.values()) list.sort(compareByRecent);

  const categories: BookshelfCategory[] = [];
  const added = new Set<string>();

  for (const name of BOOKSHELF_CATEGORY_ORDER) {
    const list = grouped.get(name);
    if (list && list.length > 0) {
      categories.push({ name, noteCount: list.length, notes: list });
      added.add(name);
    }
  }
  for (const [name, list] of grouped) {
    if (!added.has(name)) {
      categories.push({ name, noteCount: list.length, notes: list });
      added.add(name);
    }
  }

  // 「全部」视图：跨分类按最新阅读时间全局从新到旧
  const allBooks = [...books].sort(compareByRecent);

  return { categories, allBooks, totalBooks: books.length, readingStatsNote };
}
