import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

import { remarkObsidian } from './src/plugins/remark-obsidian.mjs';

const siteUrl = process.env.SITE_URL ?? 'https://20260718.xyz';
const siteBase = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site: siteUrl,
  base: siteBase,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkObsidian, { base: siteBase }]],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'append' }],
      ],
    }),
  },
});
