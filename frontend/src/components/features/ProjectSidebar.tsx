import { FolderGit2, Layers3, Settings } from "lucide-react";
import { Card } from "../ui/card";
import { useProjectStore } from "../../store/projectStore";

export function ProjectSidebar() {
  const { activeProjectName } = useProjectStore();

  return (
    <Card className="h-full p-5">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-accent/20 p-2 text-accent">
          <Layers3 size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Workspace</p>
          <p className="text-sm font-semibold text-text">Ghost-Post</p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
        <p className="text-xs uppercase tracking-wide text-muted">Active Project</p>
        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-text">
          <FolderGit2 size={14} className="text-accent" />
          {activeProjectName}
        </p>
      </div>

      <nav className="mt-6 space-y-2 text-sm">
        <button className="w-full rounded-lg bg-white/10 px-3 py-2 text-left text-text">Command Center</button>
        <button className="w-full rounded-lg px-3 py-2 text-left text-muted hover:bg-white/5">Projects</button>
        <button className="w-full rounded-lg px-3 py-2 text-left text-muted hover:bg-white/5">Connectors</button>
        <button className="w-full rounded-lg px-3 py-2 text-left text-muted hover:bg-white/5">Analytics</button>
      </nav>

      <div className="mt-auto pt-8 text-xs text-muted">
        <div className="inline-flex items-center gap-2">
          <Settings size={13} />
          Settings ready for intern extension hooks
        </div>
      </div>
    </Card>
  );
}
