'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_FMT, FormatState } from './types';

export function useFormatState(editorRef: React.RefObject<HTMLDivElement>) {
  const [fmt, setFmt] = useState<FormatState>(DEFAULT_FMT);

  useEffect(() => {
    const update = () => {
      const sel = window.getSelection();
      if (!sel || !editorRef.current?.contains(sel.anchorNode)) return;

      // Font size — walk up the DOM from anchor node
      let fontSize = '';
      let node: Node | null = sel.anchorNode;
      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const fs = (node as HTMLElement).style.fontSize;
          if (fs) {
            fontSize = fs;
            break;
          }
        }
        node = node.parentNode;
      }

      // Highlight — walk up and read background-color
      let highlight = '';
      node = sel.anchorNode;
      while (node && node !== editorRef.current) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const bg = (node as HTMLElement).style.backgroundColor;
          if (bg) {
            highlight = bg;
            break;
          }
        }
        node = node.parentNode;
      }

      setFmt({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikethrough: document.queryCommandState('strikeThrough'),
        fontSize,
        highlight,
        align: document.queryCommandState('justifyCenter')
          ? 'center'
          : document.queryCommandState('justifyRight')
          ? 'right'
          : document.queryCommandState('justifyLeft')
          ? 'left'
          : '',
      });
    };

    document.addEventListener('selectionchange', update);
    return () => document.removeEventListener('selectionchange', update);
  }, [editorRef]);

  return fmt;
}
