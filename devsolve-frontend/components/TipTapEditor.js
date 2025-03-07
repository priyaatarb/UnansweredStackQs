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
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "active" : ""}>
          <b>B</b>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "active" : ""}>
          <i>I</i>
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? "active" : ""}>
          H1
        </button>
        <button onClick={() => {
          const url = prompt("Enter URL:");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}>
           Link
        </button>
        <button onClick={() => {
          const url = prompt("Enter Image URL:");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}>
           Image
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
          gap: 8px;
          margin-bottom: 10px;
          padding: 8px;
          background: #f4f4f4;
          border-radius: 6px;
          box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.1);
        }

        
        .toolbar button {
          padding: 8px 12px;
          background: none;
          border: 1px solid #ccc;
          color: black;
          cursor: pointer;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          font-family: Times New Roman;
          transition: 0.2s;
        }

        .toolbar button:hover {
          background: #ddd;
        }

        .toolbar button.active {
          background: #34207e;
          color: #fff;
          border-color: #34207e;
        }

        
        .editor {
          min-height: 300px;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
