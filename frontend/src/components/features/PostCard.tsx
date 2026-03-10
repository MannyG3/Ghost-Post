import { motion } from "framer-motion";
import { CalendarDays, MessageSquareText } from "lucide-react";
import type { Post } from "../../types/content";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

interface PostCardProps {
  post: Post;
  onClick: (post: Post) => void;
}

const STATUS_TONE: Record<string, string> = {
  draft: "text-amber-300 border-amber-300/30",
  scheduled: "text-sky-300 border-sky-300/30",
  sent: "text-emerald-300 border-emerald-300/30",
};

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <motion.button
      layout
      onClick={() => onClick(post)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="text-left"
    >
      <Card className="p-4 transition hover:border-accent/50">
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge className={STATUS_TONE[post.status] || ""}>{post.status}</Badge>
          <Badge>{post.platform}</Badge>
        </div>
        <p className="text-sm font-semibold text-text">{post.title}</p>
        <p className="mt-2 line-clamp-4 text-sm text-muted">{post.content}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={13} />
            {new Date(post.scheduledDate).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageSquareText size={13} />
            Day {post.dayIndex}
          </span>
        </div>
      </Card>
    </motion.button>
  );
}
