import { useEffect } from 'react';
import { analyticsStore } from '@/lib/analytics-store';

// Hook to track page views and user activity
export function usePageTracker(pageName: string) {
  useEffect(() => {
    // Track page view
    analyticsStore.trackPageView(pageName);
    
    // Track unique visitor (simple implementation)
    const trackUniqueVisitor = () => {
      const visitedPages = localStorage.getItem('visited-pages');
      const pages = visitedPages ? JSON.parse(visitedPages) : [];
      
      if (!pages.includes(pageName)) {
        pages.push(pageName);
        localStorage.setItem('visited-pages', JSON.stringify(pages));
        
        // Update unique visitors count
        const uniqueVisitors = localStorage.getItem('unique-visitors');
        const count = uniqueVisitors ? parseInt(uniqueVisitors) : 0;
        localStorage.setItem('unique-visitors', (count + 1).toString());
      }
    };
    
    trackUniqueVisitor();
    
    // Track session
    const trackSession = () => {
      const sessionId = sessionStorage.getItem('session-id');
      if (!sessionId) {
        const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('session-id', newSessionId);
        sessionStorage.setItem('session-start', Date.now().toString());
        
        // Update active sessions count
        const activeSessions = sessionStorage.getItem('active-sessions');
        const count = activeSessions ? parseInt(activeSessions) : 0;
        sessionStorage.setItem('active-sessions', (count + 1).toString());
      }
    };
    
    trackSession();
    
    // Track time on page
    const startTime = Date.now();
    
    return () => {
      const endTime = Date.now();
      const timeSpent = endTime - startTime;
      
      // Log time spent if more than 10 seconds
      if (timeSpent > 10000) {
        analyticsStore.logActivity({
          action: `Spent ${Math.round(timeSpent / 1000)}s on ${pageName}`,
          user: 'Visitor',
          type: 'system'
        });
      }
    };
  }, [pageName]);
}

// Hook to track admin actions
export function useAdminTracker() {
  const trackAction = (action: string, details?: string) => {
    analyticsStore.logActivity({
      action,
      user: 'Admin',
      type: 'system',
      details
    });
  };
  
  const trackContentEdit = (pageId: string, action: string) => {
    analyticsStore.logActivity({
      action: `${action} ${pageId} page`,
      user: 'Admin',
      type: 'content'
    });
  };
  
  const trackMediaAction = (action: string, filename?: string) => {
    analyticsStore.logActivity({
      action,
      user: 'Admin',
      type: 'media',
      details: filename
    });
  };
  
  return { trackAction, trackContentEdit, trackMediaAction };
}