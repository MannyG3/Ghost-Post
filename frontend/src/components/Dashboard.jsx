import { useMemo, useState } from "react";
import { apiGenerateContent } from "../lib/api";

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

function groupPostsByDate(posts) {
  return posts.reduce((acc, post) => {
    const key = new Date(post.scheduledDate).toISOString().split("T")[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(post);
    return acc;
  }, {});
}

export default function Dashboard() {
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [posts, setPosts] = useState([]);

  const groupedPosts = useMemo(() => groupPostsByDate(posts), [posts]);
  const sortedDates = useMemo(() => Object.keys(groupedPosts).sort(), [groupedPosts]);

  async function onGenerate(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = await apiGenerateContent(githubUrl);
      setSummary(payload.summary || "");
      setPosts(payload.posts || []);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Ghost-Post Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Generate a 7-day LinkedIn + Twitter Dev-Log calendar from any GitHub repository.</p>

          <form onSubmit={onGenerate} className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="url"
              value={githubUrl}
              onChange={(event) => setGithubUrl(event.target.value)}
              placeholder="https://github.com/owner/repo"
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Generating..." : "Generate Content"}
            </button>
          </form>

          {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
          {summary ? <p className="mt-4 text-sm text-slate-700">{summary}</p> : null}
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Content Calendar</h2>
            <span className="text-sm text-slate-500">{posts.length} posts</span>
          </div>

          {sortedDates.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
              Generate content to populate your 7-day calendar.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedDates.map((date) => (
                <article key={date} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{formatDate(date)}</h3>
                  <div className="mt-4 space-y-3">
                    {groupedPosts[date].map((post) => (
                      <div key={post._id || `${post.platform}-${post.dayIndex}`} className="rounded-xl border border-slate-200 p-3">
                        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                          <span className="text-slate-900">{post.platform}</span>
                          <span className="text-slate-500">{post.status}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{post.title}</p>
                        <p className="mt-2 line-clamp-5 text-sm text-slate-700">{post.content}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}