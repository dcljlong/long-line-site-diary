export const SCHEMA_VERSION = 1;

/*
  CANONICAL DATA MODEL
*/

export const CanonicalModels = {

  Site: {
    id: "string",
    jobNumber: "string",
    name: "string",
    projectAddress: "string",
    mainContractor: "string",
    status: "Active|On Hold|Complete",
    description: "string",
    createdAt: "ISO",
    updatedAt: "ISO"
  },

  Task: {
    id: "string",
    siteId: "string|null",
    title: "string",
    status: "planned|active|complete",
    priority: "normal|high|urgent",
    startDate: "ISO|null",
    dueDate: "ISO|null",
    durationDays: "number|null",
    createdAt: "ISO",
    updatedAt: "ISO"
  },

  DiaryEntry: {
    id: "string",
    siteId: "string",
    date: "YYYY-MM-DD",
    weather: "object",
    labour: "object",
    notes: "string",
    photos: "array",
    attachments: "array",
    createdAt: "ISO",
    updatedAt: "ISO"
  }

};
