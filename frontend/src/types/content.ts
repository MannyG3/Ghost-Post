export type Platform = "twitter" | "linkedin";
export type PostStatus = "draft" | "scheduled" | "sent";

export interface Post {
  _id?: string;
  dayIndex: number;
  platform: Platform;
  title: string;
  content: string;
  status: PostStatus;
  hashtags?: string[];
  scheduledDate: string;
}

export interface Project {
  _id: string;
  name: string;
  githubUrl: string;
}

export interface GenerateContentResponse {
  project: Project;
  summary: string;
  sourceTypeUsed: string;
  posts: Post[];
}
