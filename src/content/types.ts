export type TicketSource = "ai" | "fallback";

export type SubjectId =
  | "tech"
  | "maths"
  | "science"
  | "history"
  | "english"
  | "geography"
  | "coding"
  | "business"
  | "health"
  | "music"
  | "art"
  | "civics"
  | "languages"
  | "logic"
  | "digital";

export type ExamId = "220-1101" | "220-1102" | "220-1201" | "220-1202";
export type ExamTrack = "v15" | "v14";
export type ExamCore = 1 | 2;

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
  /** Browse group inside a subject hub (Core 1, Algebra, Privacy, …). */
  cluster?: string;
}

export interface LessonCallout {
  type: "tip" | "watch" | "exam";
  text: string;
}

export interface LessonTable {
  headers: string[];
  rows: string[][];
}

/** Teaching media: labelled diagram, lazy image, or no-autoplay embed. */
export type FigureKind = "diagram" | "image" | "video";

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

export type TeachDiagramId =
  | DiagramId
  | "rear-io"
  | "usb-c-roles"
  | "soho-topo"
  | "osi-where"
  | "fru-laptop"
  | "packet-path"
  | "number-line"
  | "room-scale"
  | "food-web"
  | "wifi-rooms"
  | "timer-wire"
  | "privacy-stack"
  | "four-bar"
  | "claim-test"
  | "cash-flow"
  | "suburb-map"
  | "swollen-pack"
  | "soldered-cpu"
  | "heat-flow"
  | "door-hello";

export interface ContentFigure {
  kind: FigureKind;
  /** Required when kind is diagram */
  diagram?: TeachDiagramId;
  /** Image path (/figures/…) or a YouTube / Vimeo URL */
  src?: string;
  alt: string;
  caption: string;
  credit?: string;
  /** Labels drawn on a see-beat diagram. Empty labels fail the linter. */
  labels?: string[];
}

export interface LessonSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: LessonTable;
  callout?: LessonCallout;
  figure?: ContentFigure;
}

export type LearnBeatType = "hook" | "see" | "try" | "name" | "contrast" | "decide" | "lock";

export type SpeakLine = string | { silent: true };

export interface LearnBeat {
  id: string;
  type: LearnBeatType;
  title: string;
  /** Six-word completion after “I can”. */
  iCan: string;
  speak: SpeakLine;
  body?: string[];
  bullets?: string[];
  figure?: ContentFigure;
  table?: LessonTable;
  check?: PathCheck;
  termsIntroduced?: string[];
  /** Cluster lock line. Decide.cardHook must equal the following lock.lockLine. */
  lockLine?: string;
  /** Decide only. Awards this card on a correct answer. Skip still drops nothing. */
  cardId?: string;
  cardHook?: string;
  objective?: string;
  speakFeedbackCorrect?: string;
  speakFeedbackWrong?: string;
}

export interface Lesson {
  id: string;
  domainId: DomainId;
  title: string;
  minutes: number;
  intro: string;
  sections: LessonSection[];
  keyTakeaways: string[];
  /** Opening figure for the path hook beat */
  figure?: ContentFigure;
  objective?: string;
  /** Authored pedagogy beats. When present, the player uses these instead of compiling sections. */
  beats?: LearnBeat[];
  lockLine?: string;
}

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
  kind: "hook" | "check" | "explain" | "tip" | "recap" | LearnBeatType;
  type?: LearnBeatType;
  title: string;
  iCan?: string;
  speak?: SpeakLine;
  body?: string[];
  bullets?: string[];
  diagram?: DiagramId;
  figure?: ContentFigure;
  table?: LessonTable;
  check?: PathCheck;
  callout?: LessonCallout;
  termsIntroduced?: string[];
  lockLine?: string;
  cardId?: string;
  cardHook?: string;
  objective?: string;
  speakFeedbackCorrect?: string;
  speakFeedbackWrong?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  /** Official-style objective code, e.g. 220-1201 2.1 — study-aid mapping, not an exam item id. */
  objective?: string;
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

export interface ProjectStep {
  id: string;
  title: string;
  body: string;
  figure?: ContentFigure;
}

export interface ProjectCheck {
  id: string;
  label: string;
}

export interface Project {
  id: string;
  subject: SubjectId;
  title: string;
  blurb: string;
  goal: string;
  materials: string[];
  steps: ProjectStep[];
  checklist: ProjectCheck[];
  pathIds?: DomainId[];
  difficulty: Difficulty;
  minutes: number;
  xp: number;
  figure?: ContentFigure;
}

/** Knowledge cards for the Binder / Bench chassis. Not stickers. */
export type CardType =
  | "component"
  | "symptom"
  | "tool"
  | "procedure"
  | "gotcha"
  | "crest"
  | "glue";

export type CardRarity = "common" | "uncommon" | "rare" | "crest" | "glue" | "legendary";

export type BenchSlot =
  | "chassis"
  | "psu"
  | "cpu"
  | "ram-a"
  | "ram-b"
  | "storage-m2"
  | "storage-sata"
  | "wifi"
  | "display"
  | "tool-wall";

export type CardEarnSource = "path" | "brain" | "lab" | "pack" | "fuse" | "gotcha" | "weekly";

export interface BenchCard {
  id: string;
  type: CardType;
  rarity: CardRarity;
  title: string;
  subtitle: string;
  /** Level 1 / 2 / 3 back-face lines. Falls back to subtitle. */
  subtitles?: [string, string, string];
  body: string;
  subject: SubjectId;
  domain?: DomainId;
  pathId?: DomainId;
  artHint: string;
  slot?: BenchSlot;
  tags: string[];
  sheetId?: string;
  /** Short stamp on the serial, e.g. USBCPD */
  printCode?: string;
  /** Two exam tells printed on the back. */
  examTells?: [string, string];
  seenIn?: {
    lesson?: string;
    ticket?: string;
    fusion?: string;
  };
}

export interface FusionRecipe {
  id: string;
  title: string;
  inputIds: [string, string] | [string, string, string];
  outputId: string;
  blurb: string;
}
