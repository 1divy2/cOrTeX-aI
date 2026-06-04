import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code2,
} from "lucide-react";

type Props = {
  content: string;

  onChange: (
    value: string
  ) => void;
};

export default function NoteEditor({
  content,
  onChange,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],

    content,

    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[700px] focus:outline-none text-foreground prose-headings:text-foreground prose-p:text-foreground/90 prose-a:text-accent prose-strong:text-foreground prose-code:text-accent prose-blockquote:border-accent",
      },
    },

    onUpdate: ({
      editor,
    }) => {
      onChange(
        editor.getHTML()
      );
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">

      <div className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-2xl">

        <ToolbarButton
          active={editor.isActive(
            "bold"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
        >

          <Bold className="h-4 w-4" />

        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive(
            "italic"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
        >

          <Italic className="h-4 w-4" />

        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive(
            "heading",
            {
              level: 1,
            }
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
        >

          <Heading1 className="h-4 w-4" />

        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive(
            "heading",
            {
              level: 2,
            }
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >

          <Heading2 className="h-4 w-4" />

        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive(
            "bulletList"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
        >

          <List className="h-4 w-4" />

        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive(
            "orderedList"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
        >

          <ListOrdered className="h-4 w-4" />

        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive(
            "blockquote"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
        >

          <Quote className="h-4 w-4" />

        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive(
            "codeBlock"
          )}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
        >

          <Code2 className="h-4 w-4" />

        </ToolbarButton>

      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">

        <EditorContent
          editor={editor}
        />

      </div>

    </div>
  );
}

function ToolbarButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;

  active?: boolean;

  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
        active
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-border bg-secondary text-muted-foreground hover:border-border hover:bg-background hover:text-foreground"
      }`}
    >

      {children}

    </button>
  );
}