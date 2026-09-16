export type TicketSource = "ai" | "fallback";

export type SubjectId = "tech" | "maths" | "science" | "history";

export type ExamId = "220-1101" | "220-1102";

export type AplusDomainId =
  | "mobile-devices"
  | "networking"
  | "hardware"
  | "virtualization-cloud"
  | "hw-net-troubleshooting"
  | "operating-systems"
  | "security"
  | "software-troubleshooting"
  | "operational-procedures";

export type DomainId = string;

export type ScenarioTheme =
  | "hardware"
  | "network"
  | "os"
  | "security"
  | "printer"
  | "mobile";

export type Difficulty = "easy" | "medium" | "hard";

export type ScenarioPhase = "gather" | "tools" | "cause" | "fix";

export type ScenarioKind = "ticket" | "challenge";

export interface Domain {
  id: DomainId;
  subject: SubjectId;
  exam?: ExamId;
  number: number;
  title: string;
  weight?: string;
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

export type DiagramId =
  | "laptop"
  | "layers"
  | "connectors"
  | "cloud"
  | "loop"
  | "window"
  | "lock"
  | "boot"
  | "clipboard"
  | "balance"
  | "atom"
  | "leaf"
  | "scroll"
  | "prism";

export type PathCheckType = "choice" | "truefalse" | "order" | "match";

export interface PathChoice {
  id: string;
  label: string;
  correct: boolean;
  why: string;
}

export interface PathPair {
  left: string;
  right: string;
}

export interface PathCheck {
  id: string;
  type: PathCheckType;
  prompt: string;
  afterHeading?: string;
  choices?: PathChoice[];
  answer?: boolean;
  why?: string;
  items?: { id: string; label: string }[];
  correctOrder?: string[];
  pairs?: PathPair[];
  extraRights?: string[];
}

export interface PathBeat {
  id: string;
  kind: "hook" | "check" | "explain" | "tip" | "recap";
  title: string;
  body?: string[];
  bullets?: string[];
  diagram?: DiagramId;
  table?: LessonTable;
  check?: PathCheck;
  callout?: LessonCallout;
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
  subject: SubjectId;
  kind?: ScenarioKind;
  exam?: ExamId;
  theme?: ScenarioTheme;
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
  subject?: SubjectId;
  tables: CheatsheetTable[];
  notes?: string[];
}
