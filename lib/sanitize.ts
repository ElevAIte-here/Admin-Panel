import sanitizeHtml from 'sanitize-html';

// Sanitize editor HTML before persisting. Mirrors the website's allow-list so
// stored content renders identically and safely on the public site.
export function sanitizeBlogHtml(html: string): string {
  if (!html) return '';
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'figure', 'figcaption', 'span', 'u', 's',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      span: ['style'],
      p: ['style'],
      div: ['style'],
      h1: ['style'], h2: ['style'], h3: ['style'], h4: ['style'],
      td: ['style', 'colspan', 'rowspan'],
      th: ['style', 'colspan', 'rowspan'],
      table: ['style'],
      blockquote: ['style'],
      ol: ['style'], ul: ['style'], li: ['style'],
      '*': ['class'],
    },
    allowedStyles: {
      '*': {
        color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/, /^[a-z]+$/i],
        'background-color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/, /^[a-z]+$/i],
        'text-align': [/^left$|^right$|^center$|^justify$/],
        'font-size': [/^\d+(?:px|em|rem|%)$/],
        'font-weight': [/^bold$|^\d{3}$/],
        'list-style-type': [/^[a-z-]+$/i],
        border: [/.*/],
        'border-collapse': [/.*/],
        'border-radius': [/.*/],
        padding: [/.*/],
        margin: [/.*/],
        background: [/.*/],
        width: [/.*/],
        'font-style': [/^italic$|^normal$/],
      },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });
}
