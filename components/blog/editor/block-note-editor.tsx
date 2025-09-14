'use client';

import { useEdgeStore } from '@/lib/edgestore';
import { PartialBlock } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { useTheme } from 'next-themes';
import './editor.css';

interface BlockNoteEditorProps {
  onChange?: (content: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const BlockNodeEditor = ({ onChange, initialContent, editable }: BlockNoteEditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleImageUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({ file });
    return res.url;
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
    uploadFile: handleImageUpload,
  });

  return (
    <BlockNoteView
      editor={editor}
      onChange={
        onChange
          ? (ed) => {
              onChange(JSON.stringify(ed.document));
            }
          : () => {}
      }
      editable={editable}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  );
};

export default BlockNodeEditor;
