/** Status of a lab entry in the catalog. */
export type LabStatus = 'planned' | 'in-progress' | 'done';

/** Difficulty level shown on lab cards and headers. */
export type LabLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/** Visual tone for a callout block inside a section. */
export type LabCalloutTone = 'note' | 'tip' | 'warn';

/** Callout block content rendered inside a lab section. */
export type LabCallout = {
  tone: LabCalloutTone;
  title: string;
  text: string;
};

/** Code block metadata for display in a section. */
export type LabCodeBlock = {
  title?: string;
  language?: string;
  snippet: string;
};

/** Section content for a lab page. */
export type LabSection = {
  id: string;
  title: string;
  summary?: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
  code?: LabCodeBlock[];
  callouts?: LabCallout[];
};

/** Exercise metadata used to render the lab task list. */
export type LabExercise = {
  title: string;
  goal: string;
  tasks: string[];
  success: string[];
  stretch?: string[];
};

/** External reference link for the lab. */
export type LabReference = {
  label: string;
  url: string;
};

/** Full lab content used by the lab detail page. */
export type LabContent = {
  id: string;
  title: string;
  tagline: string;
  extra?: boolean;
  status: LabStatus;
  level: LabLevel;
  duration: string;
  summary: string;
  outcomes: string[];
  prerequisites: string[];
  sections: LabSection[];
  exercise: LabExercise;
  references: LabReference[];
};

/** Short catalog card displayed on the labs index page. */
export type LabCatalogItem = {
  id: string;
  title: string;
  extra?: boolean;
  status: LabStatus;
  level: LabLevel;
  duration: string;
  summary: string;
};
