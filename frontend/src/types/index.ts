export type Priority = "High" | "Medium" | "Low";

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  priority: Priority;
}

export interface MeetingExtraction {
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
}

export interface ProcessRequest {
  transcript: string;
}

export interface ProcessResponse {
  extraction: MeetingExtraction;
  rawTranscript: string;
}

export interface ConfirmRequest {
  actionItems: ActionItem[];
  attendeeEmails: string[];
  notionDatabaseId: string;
  summary: string;
  decisions: string[];
  rawTranscript: string;
}

export interface ConfirmResponse {
  notionUrl: string;
  taskCount: number;
  emailsSent: number;
}

export type Screen = "input" | "processing" | "review" | "success";

export interface AppState {
  screen: Screen;
  transcript: string;
  extraction: MeetingExtraction | null;
  confirmResult: ConfirmResponse | null;
  error: string | null;
}
