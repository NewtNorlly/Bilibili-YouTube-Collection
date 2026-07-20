import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

import { remarkObsidian } from './src/plugins/remark-obsidian.mjs';

const repositoryBase = '/Bilibili-YouTube-Collection';

export default defineConfig({
  site: 'https://newtnorlly.github.io',
  base: repositoryBase,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [[remarkObsidian, { base: repositoryBase }]],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'append' }],
      ],
    }),
  },
});
