// Utility for making authenticated admin API calls

export interface AdminApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function adminFetch(url: string, options: AdminApiOptions = {}): Promise<Response> {
  // Get admin token from localStorage
  const adminToken = localStorage.getItem("adminToken");
  
  // Merge headers with admin token
  const headers = {
    'Content-Type': 'application/json',
    'X-Admin-Token': adminToken || '',
    ...options.headers,
  };

  // Remove Content-Type for FormData requests
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  return fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });
}

export async function adminApiCall<T = any>(url: string, options: AdminApiOptions = {}): Promise<T> {
  const response = await adminFetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API call failed: ${response.status}`;
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If not JSON, use the text as error message
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  
  return response.json();
}