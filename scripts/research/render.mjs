import MarkdownIt from 'markdown-it';
import texmath from 'markdown-it-texmath';
import katex from 'katex';
import anchor from 'markdown-it-anchor';
import footnote from 'markdown-it-footnote';
import path from 'node:path';

export const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
export const plain = (s) => s.replace(/[*`]/g, '').replace(/\s+/g, ' ').trim();
export function renderer(documents) {
  const byFile = new Map(documents.map((d) => [d.file, d.route]));
  byFile.set('SUPERINTELLIGENCE_RESEARCH_ATLAS.csv', '/research/atlas');
  const md = new MarkdownIt({ html: false, linkify: true, typographer: false })
    .use(texmath, {
      engine: katex,
      delimiters: ['brackets', 'dollars'],
      katexOptions: { throwOnError: true, trust: false, strict: 'ignore', output: 'htmlAndMathml' },
    })
    .use(footnote)
    .use(anchor, {
      slugify: (text) =>
        text
          .trim()
          .toLowerCase()
          .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')
          .replace(/\s+/g, '-'),
      level: [2, 3, 4],
      permalink: anchor.permalink.headerLink(),
    });
  // Display math may immediately follow prose. Register paragraph terminators so
  // an equation's standalone '=' cannot be mistaken for a Markdown H1 underline.
  for (const [index, rule] of texmath.mergeDelimiters(['brackets', 'dollars']).block.entries()) {
    md.block.ruler.before('fence', `research_math_${index}`, texmath.block(rule), {
      alt: ['paragraph', 'reference', 'blockquote', 'list'],
    });
  }
  for (const type of ['math_inline', 'math_inline_double', 'math_block', 'math_block_eqno']) {
    md.renderer.rules[type] = (tokens, index, options, env) => {
      const display = type !== 'math_inline';
      env.mathCount = (env.mathCount ?? 0) + 1;
      let rendered;
      try {
        rendered = katex.renderToString(tokens[index].content, {
          displayMode: display,
          throwOnError: true,
          trust: false,
          strict: 'ignore',
          output: 'htmlAndMathml',
        });
      } catch (error) {
        throw new Error(
          `${env.file}: invalid equation: ${tokens[index].content}\n${error.message}`,
        );
      }
      return display
        ? `<div class="equation" tabindex="0" role="region" aria-label="Mathematical expression">${rendered}</div>`
        : rendered;
    };
  }
  const link =
    md.renderer.rules.link_open ??
    ((tokens, i, options, env, self) => self.renderToken(tokens, i, options));
  md.renderer.rules.link_open = (tokens, i, options, env, self) => {
    const token = tokens[i];
    const href = token.attrGet('href') ?? '';
    if (!/^(?:https?:|mailto:|#|\/)/.test(href)) {
      const [file, fragment] = href.split('#');
      const route = byFile.get(path.basename(file));
      if (route) token.attrSet('href', route + (fragment ? `#${fragment}` : ''));
      else {
        env.missing ??= [];
        env.missing.push(href);
        token.tag = 'span';
        token.attrSet('class', 'source-unavailable');
        token.attrs = token.attrs.filter(([key]) => key !== 'href');
        token.attrSet('title', 'Referenced in the source, but not supplied in this package');
        const closing = tokens.slice(i + 1).find((t) => t.type === 'link_close');
        if (closing) closing.tag = 'span';
      }
    }
    return link(tokens, i, options, env, self);
  };
  md.renderer.rules.table_open = () =>
    '<div class="table-scroll" tabindex="0" role="region" aria-label="Scrollable manuscript table"><table>\n';
  md.renderer.rules.table_close = () => '</table></div>\n';
  for (const name of ['fence', 'code_block']) {
    const rule = md.renderer.rules[name];
    md.renderer.rules[name] = (...args) =>
      rule(...args).replace(
        '<pre',
        '<pre tabindex="0" role="region" aria-label="Scrollable code example"',
      );
  }
  const imageRule = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, i, options, env, self) => {
    tokens[i].attrSet('loading', 'lazy');
    return imageRule(tokens, i, options, env, self);
  };
  return (source, env = {}) => {
    const tokens = md.parse(source, env);
    const toc = tokens.flatMap((t, i) =>
      t.type === 'heading_open' && ['h2', 'h3'].includes(t.tag)
        ? [{ id: t.attrGet('id'), level: t.tag, text: plain(tokens[i + 1].content) }]
        : [],
    );
    return { html: md.renderer.render(tokens, md.options, env), toc, env };
  };
}
