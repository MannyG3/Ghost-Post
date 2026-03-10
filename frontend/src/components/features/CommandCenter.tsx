import { useMemo, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { apiGenerateContent } from "../../lib/api";
import { useProjectStore } from "../../store/projectStore";
import type { Post } from "../../types/content";
import { Card } from "../ui/card";
import { ContentPipeline } from "./ContentPipeline";
import { MagicInput } from "./MagicInput";
import { PostEditorSheet } from "./PostEditorSheet";
import { ProjectSidebar } from "./ProjectSidebar";

export function CommandCenter() {
  const [githubUrl, setGithubUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);

  const mutation = useMutation({
    mutationFn: apiGenerateContent,
    onSuccess: (data) => {
      setSummary(data.summary);
      setPosts(data.posts || []);
      setActiveProject(data.project._id, data.project.name);
    },
  });

  const postCountLabel = useMemo(() => `${posts.length} total posts in pipeline`, [posts.length]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate(githubUrl);
  }

  function handleSelect(post: Post) {
    setSelectedPost(post);
    setSheetOpen(true);
  }

  return (
    <div className="min-h-screen bg-surface text-text">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(31,41,55,0.55),transparent_35%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-6 p-5 lg:grid-cols-[280px_1fr] lg:p-8">
        <ProjectSidebar />

        <main className="space-y-6">
          <header className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Command Center</p>
              <h1 className="text-3xl font-semibold">Ghost-Post Pipeline</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted">
              <Sparkles size={14} className="text-accent" />
              {postCountLabel}
            </div>
          </header>

          <MagicInput githubUrl={githubUrl} onChange={setGithubUrl} onSubmit={handleSubmit} isLoading={mutation.isPending} />

          {mutation.error ? (
            <Card className="border-red-500/30 bg-red-900/20 p-4 text-sm text-red-200">{(mutation.error as Error).message}</Card>
          ) : null}

          {summary ? <Card className="p-4 text-sm text-muted">{summary}</Card> : null}

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Content Pipeline</h2>
              <span className="text-xs text-muted">Draft | Scheduled | Sent</span>
            </div>
            <ContentPipeline posts={posts} onSelect={handleSelect} />
          </Card>
        </main>
      </div>

      <PostEditorSheet post={selectedPost} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </div>
  );
}
