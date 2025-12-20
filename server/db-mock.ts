// Mock database for development without PostgreSQL
export const db = {
  query: {
    testimonials: {
      findMany: () => Promise.resolve([]),
    },
    publications: {
      findMany: () => Promise.resolve([]),
    },
    contactSubmissions: {
      insert: () => Promise.resolve({ id: 'mock-id' }),
    },
    joinApplications: {
      insert: () => Promise.resolve({ id: 'mock-id' }),
    },
    feedbackSubmissions: {
      insert: () => Promise.resolve({ id: 'mock-id' }),
    },
  },
};