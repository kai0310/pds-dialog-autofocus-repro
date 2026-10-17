import { getFontLinks, getLoaderScript } from '@porsche-design-system/components-js/partials';
import { defineConfig } from 'vite';

// Same setup as the official Vanilla JS StackBlitz template (fonts and loader script), without Tailwind and AG Grid.
export default defineConfig({
  plugins: [
    {
      name: 'html-transform',
      transformIndexHtml: (html) =>
        html.replace('</head>', `${getFontLinks()}</head>`).replace('</body>', `${getLoaderScript()}</body>`),
    },
  ],
});
