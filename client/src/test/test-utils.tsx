import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'wouter/memory-location'

// Create a custom render function that includes providers
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
  queryClient?: QueryClient
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    initialEntries = ['/'],
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

// Mock data generators
export const mockWebinar = {
  id: 'test-webinar-1',
  title: 'Test Webinar',
  description: 'Test Description',
  speaker: {
    name: 'Dr. Test',
    title: 'Test Title',
    bio: 'Test Bio',
    image: 'test-image.jpg'
  },
  date: '2024-12-31',
  time: '10:00',
  duration: 60,
  timezone: 'PKT',
  maxAttendees: 100,
  currentAttendees: 25,
  status: 'published' as const,
  category: 'Test Category',
  tags: ['test', 'webinar'],
  meetingLink: 'https://test.com/meeting',
  materials: ['test-material.pdf'],
  image: 'test-webinar.jpg',
  customQuestions: [
    {
      id: 'q1',
      question: 'What is your experience level?',
      required: true
    }
  ],
  includeExperienceField: true,
  createdAt: '2024-12-20T10:00:00Z',
  updatedAt: '2024-12-20T10:00:00Z'
}

export const mockRegistration = {
  id: 'test-reg-1',
  webinarId: 'test-webinar-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  organization: 'Test University',
  position: 'Researcher',
  experience: '3 years',
  interests: 'Testing, Research',
  customQuestionAnswers: {
    'q1': 'Intermediate'
  },
  registrationDate: '2024-12-20T15:00:00Z',
  status: 'confirmed' as const
}

export const mockColors = {
  dominant: '#3b82f6',
  palette: ['#3b82f6', '#10b981', '#f59e0b'],
  primary: '#3b82f6',
  secondary: '#f1f5f9',
  accent: '#10b981',
  background: '#ffffff',
  text: '#1f2937',
  muted: '#6b7280'
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'