import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { lowlight } from "lowlight"; 
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

export default function TipTapEditor({ content, setContent, setEditor }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Image,
      
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && typeof setEditor === "function") {
      setEditor(editor);
    }
  }, [editor, setEditor]);

  if (!editor) return null;

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <b>B</b>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <i>I</i>
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Quote
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          UL
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          OL
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          {"</>"}
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          Left
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          Center
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          Right
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          Justify
        </button>
        <button onClick={() => editor.chain().focus().toggleHighlight().run()}>
          Highlight
        </button>
        <button
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          Link
        </button>
        <button
          onClick={() => {
            const url = prompt("Enter Image URL:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          Image
        </button>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
        >
          Table
        </button>
      </div>

      <EditorContent editor={editor} className="editor" />

      <style jsx>{`
        .editor-container {
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 8px;
          width: 100%;
          background: #fff;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
          padding: 8px;
          justify-content: space-around;
          border-radius: 6px;
        }

        .toolbar button {
          height: 40px;
          width: 60px;
          color: black;
          cursor: pointer;
          border-radius: 4px;
          font-size: 1rem;
          opacity: 0.6;
          transition: 0.2s ease-in-out;
          background: none;
        }

        .toolbar button:hover {
          opacity: 1;
          background: #f0f0f0;
        }

        .toolbar button.active {
          font-weight: bold;
          opacity: 1;
        }

        .editor {
          background: white;
          min-height: 400px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
