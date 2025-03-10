import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function TipTapEditor({ content, setContent, setEditor }) {
  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
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
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
        >
          <b>B</b>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
        >
          <i>I</i>
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={editor.isActive("heading", { level: 1 }) ? "active" : ""}
        >
          H1
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
      </div>

      <EditorContent editor={editor} className="editor" 
      />

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
          gap: 8px;
          margin-bottom: 10px;
          padding: 8px;
          display: flex;
          align-item: center;
          justify-content: space-around;
          gap: 20px;
          border-radius: 6px;
        }

        .toolbar button {
          display: flex;
          align-item: center;
          justify-content: center;
          height: 40px;
          width: 100px;
          color: black;
          cursor: pointer;
          border-radius: 4px;
          font-size: 1rem;
          opacity: 0.5;
          font-family: arial;
          transition: 0.2s ease-in-out;
          background: none;
        }

        .toolbar button:hover {
          opacity: 1;
          background: none;
        }

        .toolbar button.active {
          color: black;
          background: none;
          font-weight: 600;
          opacity: 1;
        }

        .editor {
          background: black;
          min-height: 900px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
