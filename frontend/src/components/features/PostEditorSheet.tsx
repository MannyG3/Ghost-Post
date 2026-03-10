import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Platform, Post } from "../../types/content";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sheet } from "../ui/sheet";
import { Textarea } from "../ui/textarea";

interface PostEditorSheetProps {
  post: Post | null;
  open: boolean;
  onClose: () => void;
}

export function PostEditorSheet({ post, open, onClose }: PostEditorSheetProps) {
  const [previewPlatform, setPreviewPlatform] = useState<Platform>("linkedin");
  const [draft, setDraft] = useState(post?.content || "");

  useEffect(() => {
    if (!post) return;
    setDraft(post.content);
    setPreviewPlatform(post.platform === "twitter" ? "twitter" : "linkedin");
  }, [post]);

  if (!post) return null;

  return (
    <Sheet open={open} onClose={onClose}>
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Post Editor</p>
            <h3 className="text-lg font-semibold text-text">{post.title}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg border border-white/10 p-2 text-muted hover:text-text">
            <X size={16} />
          </button>
        </div>

        <div className="mb-5 flex items-center gap-2">
          <Button
            type="button"
            className={previewPlatform === "linkedin" ? "" : "bg-white/10 from-white/10 to-white/10"}
            onClick={() => setPreviewPlatform("linkedin")}
          >
            LinkedIn View
          </Button>
          <Button
            type="button"
            className={previewPlatform === "twitter" ? "" : "bg-white/10 from-white/10 to-white/10"}
            onClick={() => setPreviewPlatform("twitter")}
          >
            Twitter View
          </Button>
        </div>

        <div className="mb-4 space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <Badge>{previewPlatform}</Badge>
            <Badge>{post.status}</Badge>
          </div>
          <p className="text-sm text-text">{draft}</p>
        </div>

        <label className="mb-2 text-sm font-medium text-text">Edit Caption</label>
        <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} />

        <div className="mt-auto pt-4">
          <Button type="button">Save Draft</Button>
        </div>
      </div>
    </Sheet>
  );
}
