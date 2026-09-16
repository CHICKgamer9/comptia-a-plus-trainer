export type TicketSource = "ai" | "fallback";

export type ExamId = "220-1101" | "220-1102";

export type DomainId =
  | "mobile-devices"
  | "networking"
  | "hardware"
  | "virtualization-cloud"
  | "hw-net-troubleshooting"
  | "operating-systems"
  | "security"
  | "software-troubleshooting"
  | "operational-procedures";

export type ScenarioTheme =
  | "hardware"
  | "network"
  | "os"
  | "security"
  | "printer"
  | "mobile";

export type Difficulty = "easy" | "medium" | "hard";

export type ScenarioPhase = "gather" | "tools" | "cause" | "fix";

export interface Domain {
  id: DomainId;
  exam: ExamId;
  number: number;
  title: string;
  weight: string;
  summary: string;
  lessonId: string;
  quizId: string;
}

export interface LessonCallout {
  type: "tip" | "watch" | "exam";
  text: string;
}

export interface LessonTable {
  headers: string[];
  rows: string[][];
}

export interface LessonSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: LessonTable;
  callout?: LessonCallout;
}

export interface Lesson {
  id: string;
  domainId: DomainId;
  title: string;
  minutes: number;
  intro: string;
  sections: LessonSection[];
  keyTakeaways: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  domainId: DomainId;
  title: string;
  questions: QuizQuestion[];
}

export interface ScenarioChoice {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
}

export interface ScenarioStep {
  id: string;
  phase: ScenarioPhase;
  title: string;
  prompt: string;
  findings?: string;
  choices: ScenarioChoice[];
}

export interface Scenario {
  id: string;
  title: string;
  ticketId: string;
  requester: string;
  location: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  exam: ExamId;
  theme: ScenarioTheme;
  domainIds: DomainId[];
  difficulty: Difficulty;
  minutes: number;
  summary: string;
  ticket: string;
  steps: ScenarioStep[];
  debrief: string;
  source?: TicketSource;
}

export interface CheatsheetTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface Cheatsheet {
  id: string;
  title: string;
  summary: string;
  tables: CheatsheetTable[];
  notes?: string[];
}
