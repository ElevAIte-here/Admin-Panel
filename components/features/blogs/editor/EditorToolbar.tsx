'use client';

import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  LayoutPanelLeft, Quote,
} from 'lucide-react';
import { EditorPageProps, FormatState, ListStyle } from './types';
import { ToolbarBtn, ToolbarDivider } from './ToolbarBtn';
import { FontSizeFlyout } from './FontSizeFlyout';
import { ListFlyout } from './ListFlyout';
import { TableFlyout } from './TableFlyout';
import { HighlightFlyout } from './HighlightFlyout';
import { LinkFlyout } from './LinkFlyout';

interface Props {
  fmt: FormatState;
  exec: EditorPageProps['exec'];
  applyFontSize: EditorPageProps['applyFontSize'];
  applyHighlight: EditorPageProps['applyHighlight'];
  insertList: EditorPageProps['insertList'];
  insertTable: EditorPageProps['insertTable'];
  insertCard: EditorPageProps['insertCard'];
  insertBlockquote: EditorPageProps['insertBlockquote'];
  insertLink: EditorPageProps['insertLink'];
}

export function EditorToolbar({
  fmt,
  exec,
  applyFontSize,
  applyHighlight,
  insertList,
  insertTable,
  insertCard,
  insertBlockquote,
  insertLink,
}: Props) {
  return (
    <div
      className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-slate-100 bg-slate-50 px-2 py-4"
      style={{ overflow: 'visible', zIndex: 10 }}
    >
      <ToolbarBtn title="Bold" active={fmt.bold} onClick={() => exec('bold')}>
        <Bold className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn title="Italic" active={fmt.italic} onClick={() => exec('italic')}>
        <Italic className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn title="Underline" active={fmt.underline} onClick={() => exec('underline')}>
        <Underline className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn title="Strikethrough" active={fmt.strikethrough} onClick={() => exec('strikeThrough')}>
        <Strikethrough className="h-4 w-4" />
      </ToolbarBtn>

      <ToolbarDivider />

      <FontSizeFlyout onSelect={applyFontSize} currentSize={fmt.fontSize} />
      <HighlightFlyout onSelect={applyHighlight} currentHighlight={fmt.highlight} />

      <ToolbarDivider />

      <ToolbarBtn title="Align left" active={fmt.align === 'left'} onClick={() => exec('justifyLeft')}>
        <AlignLeft className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn title="Align center" active={fmt.align === 'center'} onClick={() => exec('justifyCenter')}>
        <AlignCenter className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn title="Align right" active={fmt.align === 'right'} onClick={() => exec('justifyRight')}>
        <AlignRight className="h-4 w-4" />
      </ToolbarBtn>

      <ToolbarDivider />

      <ListFlyout onSelect={insertList} />

      <ToolbarDivider />

      <TableFlyout onInsert={insertTable} />

      <ToolbarBtn title="Blockquote" onClick={insertBlockquote}>
        <Quote className="h-4 w-4" />
      </ToolbarBtn>

      <ToolbarBtn title="Insert card" onClick={insertCard}>
        <LayoutPanelLeft className="h-4 w-4" />
      </ToolbarBtn>

      <LinkFlyout onInsert={insertLink} />
    </div>
  );
}
