import { Loader2, Sparkles } from "lucide-react";
import type { FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";

interface MagicInputProps {
  githubUrl: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  isLoading: boolean;
}

export function MagicInput({ githubUrl, onChange, onSubmit, isLoading }: MagicInputProps) {
  return (
    <Card className="mx-auto w-full max-w-3xl p-6">
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="text-sm font-medium text-text">Magic Input</label>
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input
            type="url"
            required
            value={githubUrl}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Paste GitHub URL or drop markdown source"
          />
          <Button type="submit" glow disabled={isLoading} className="min-w-52 gap-2">
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {isLoading ? "Generating..." : "Generate with AI"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
