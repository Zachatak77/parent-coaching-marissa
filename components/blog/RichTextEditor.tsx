'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useRef } from 'react'

// Convert simple markdown to HTML for legacy content & .md imports
export function markdownToHtml(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inUl = false
  let inOl = false

  function inline(text: string) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
  }

  function closeList() {
    if (inUl) { out.push('</ul>'); inUl = false }
    if (inOl) { out.push('</ol>'); inOl = false }
  }

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/)
    const h3 = line.match(/^###\s+(.+)/)
    const bullet = line.match(/^-\s+(.+)/)
    const ordered = line.match(/^\d+\.\s+(.+)/)

    if (h3) {
      closeList()
      out.push(`<h3>${inline(h3[1])}</h3>`)
    } else if (h2) {
      closeList()
      out.push(`<h2>${inline(h2[1])}</h2>`)
    } else if (bullet) {
      if (inOl) { out.push('</ol>'); inOl = false }
      if (!inUl) { out.push('<ul>'); inUl = true }
      out.push(`<li><p>${inline(bullet[1])}</p></li>`)
    } else if (ordered) {
      if (inUl) { out.push('</ul>'); inUl = false }
      if (!inOl) { out.push('<ol>'); inOl = true }
      out.push(`<li><p>${inline(ordered[1])}</p></li>`)
    } else if (line.trim()) {
      closeList()
      out.push(`<p>${inline(line)}</p>`)
    } else {
      // blank line — no-op (Tiptap handles paragraph spacing)
    }
  }
  closeList()
  return out.join('')
}

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  onImportFile?: (html: string, extractedTitle?: string) => void
}

export function RichTextEditor({ content, onChange, onImportFile }: RichTextEditorProps) {
  const mdInputRef = useRef<HTMLInputElement>(null)

  // If the stored content is markdown (old posts), convert to HTML
  const initialContent = content.trim().startsWith('<') || content.trim() === ''
    ? content
    : markdownToHtml(content)

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: [
          'min-h-[440px] px-5 py-4 focus:outline-none',
          // headings
          '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-8',
          '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6',
          // paragraphs
          '[&_p]:mb-3',
          // lists
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:space-y-1',
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:space-y-1',
          // inline
          '[&_strong]:font-bold',
          '[&_em]:italic',
        ].join(' '),
      },
    },
  })

  function importMarkdown(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !onImportFile) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const raw = (ev.target?.result as string) ?? ''
      const h1Match = raw.match(/^#\s+(.+)/m)
      const extractedTitle = h1Match?.[1]?.trim()
      const body = extractedTitle ? raw.replace(/^#\s+.+\n?/, '').trimStart() : raw
      const html = markdownToHtml(body)
      editor?.commands.setContent(html)
      onChange(editor?.getHTML() ?? html)
      onImportFile(html, extractedTitle)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function btn(
    label: string,
    title: string,
    active: boolean,
    onClick: () => void,
    style?: React.CSSProperties,
  ) {
    return (
      <button
        key={title}
        type="button"
        title={title}
        onMouseDown={(e) => { e.preventDefault(); onClick() }}
        style={style}
        className={`w-8 h-6 rounded text-sm text-[#3A372F] transition-colors font-[Inter] ${
          active ? 'bg-[#C5BA9F]' : 'hover:bg-[#D9CFB9]'
        }`}
      >
        {label}
      </button>
    )
  }

  const sep = (key: string) => <div key={key} className="w-px h-4 bg-[#D9CFB9] mx-1" />

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1 rounded-t-md border border-b-0 border-input bg-[#F7F7F5]">
        {btn('B', 'Bold', editor?.isActive('bold') ?? false,
          () => editor?.chain().focus().toggleBold().run(),
          { fontWeight: 700 })}
        {btn('I', 'Italic', editor?.isActive('italic') ?? false,
          () => editor?.chain().focus().toggleItalic().run(),
          { fontStyle: 'italic' })}
        {sep('s1')}
        {btn('•', 'Bullet list', editor?.isActive('bulletList') ?? false,
          () => editor?.chain().focus().toggleBulletList().run())}
        {btn('1.', 'Numbered list', editor?.isActive('orderedList') ?? false,
          () => editor?.chain().focus().toggleOrderedList().run())}
        {sep('s2')}
        {btn('H2', 'Heading 2', editor?.isActive('heading', { level: 2 }) ?? false,
          () => editor?.chain().focus().toggleHeading({ level: 2 }).run())}
        {btn('H3', 'Heading 3', editor?.isActive('heading', { level: 3 }) ?? false,
          () => editor?.chain().focus().toggleHeading({ level: 3 }).run())}
        {sep('s3')}
        {btn('→', 'Indent list', false,
          () => editor?.chain().focus().sinkListItem('listItem').run())}
        {btn('←', 'Unindent list', false,
          () => editor?.chain().focus().liftListItem('listItem').run())}

        {/* Import .md — only shown when onImportFile is provided */}
        {onImportFile && (
          <>
            {sep('s4')}
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); mdInputRef.current?.click() }}
              className="ml-1 text-xs text-[#5F728D] hover:text-[#3D5068] underline underline-offset-2 whitespace-nowrap"
            >
              Import .md
            </button>
            <input
              ref={mdInputRef}
              type="file"
              accept=".md,.markdown"
              className="hidden"
              onChange={importMarkdown}
            />
          </>
        )}
      </div>

      {/* Editor surface */}
      <div className="border border-input rounded-b-md bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
