import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faItalic, faHeading, faQuoteRight, faListUl, faListOl, faCode, faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify, faHighlighter, faLink, faImage, faTable } from "@fortawesome/free-solid-svg-icons";

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
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FontAwesomeIcon icon={faListOl} />
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <FontAwesomeIcon icon={faCode} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <FontAwesomeIcon icon={faAlignLeft} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <FontAwesomeIcon icon={faAlignCenter} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <FontAwesomeIcon icon={faAlignRight} />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
          <FontAwesomeIcon icon={faAlignJustify} />
        </button>
        <button onClick={() => editor.chain().focus().toggleHighlight().run()}>
          <FontAwesomeIcon icon={faHighlighter} />
        </button>
        <button
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <FontAwesomeIcon icon={faLink} />
        </button>
        <button
          onClick={() => {
            const url = prompt("Enter Image URL:");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <FontAwesomeIcon icon={faImage} />
        </button>
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>
          <FontAwesomeIcon icon={faTable} />
        </button>
      </div>

      <EditorContent editor={editor} className="editor" />

      <style jsx>{`
        .editor-container {
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 8px;
          margin: auto;
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
          background: #f0f0f0;
        }
        .toolbar button {
            border: none;
            background: none;
            cursor: pointer;
            font-size: 18px;
            color: rgba(0, 0, 0, 0.5);
          }
      `}</style>
    </div>
  );
}