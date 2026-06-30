import { useRef } from "react";
import { FileText, Paperclip, Upload, X } from "lucide-react";

export function FileDrop({
  files,
  onChange,
}: {
  files: Array<{ name: string; size: number }>;
  onChange: (f: Array<{ name: string; size: number }>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  function add(list: FileList | null) {
    if (!list) return;
    const next = [...files];
    for (const f of Array.from(list)) {
      if (!next.find((x) => x.name === f.name)) next.push({ name: f.name, size: f.size });
    }
    onChange(next);
  }
  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          add(e.dataTransfer.files);
        }}
        className="flex items-center justify-between gap-3 rounded-md border border-dashed border-hairline bg-canvas-soft/60 px-3 py-2.5 text-[12px] text-secondary-text"
      >
        <span className="inline-flex items-center gap-2">
          <Upload className="h-3.5 w-3.5 text-primary" />
          Drag & drop PDFs, docs, CSVs — or
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[12px] font-medium text-heading ring-1 ring-hairline hover:bg-canvas-soft transition-colors cursor-pointer"
        >
          <Paperclip className="h-3 w-3" /> Choose files
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => add(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {files.map((f) => (
            <li
              key={f.name}
              className="inline-flex items-center gap-1.5 rounded-md bg-surface px-2 py-1 text-[11.5px] text-heading ring-1 ring-hairline"
            >
              <FileText className="h-3 w-3 text-primary" />
              {f.name}
              <button
                type="button"
                onClick={() => onChange(files.filter((x) => x.name !== f.name))}
                className="text-muted-text hover:text-destructive"
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
