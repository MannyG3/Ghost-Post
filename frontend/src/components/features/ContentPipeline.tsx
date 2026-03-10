import { AnimatePresence, motion } from "framer-motion";
import type { Post, PostStatus } from "../../types/content";
import { PostCard } from "./PostCard";

interface ContentPipelineProps {
  posts: Post[];
  onSelect: (post: Post) => void;
}

const STAGES: PostStatus[] = ["draft", "scheduled", "sent"];

export function ContentPipeline({ posts, onSelect }: ContentPipelineProps) {
  return (
    <div className="space-y-6">
      {STAGES.map((stage) => {
        const stagePosts = posts.filter((post) => post.status === stage);

        return (
          <section key={stage}>
            <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">{stage}</h3>
            <motion.div layout className="space-y-3">
              <AnimatePresence>
                {stagePosts.length > 0 ? (
                  stagePosts.map((post) => <PostCard key={post._id || `${post.platform}-${post.dayIndex}`} post={post} onClick={onSelect} />)
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-muted"
                  >
                    No {stage} posts yet.
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}
