"use client"; // Next.js 13+ me SSR issues fix karta hai

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor({ content, setContent }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "border border-gray-300 p-4 rounded-lg min-h-[200px] focus:outline-none",
      },
    },
  });

  return <EditorContent editor={editor} />;
}
