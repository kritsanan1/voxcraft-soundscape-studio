import { QueryClient } from "@tanstack/react-query";

// Default API request function
export async function apiRequest(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const [url, ...params] = queryKey as [string, ...unknown[]];
        const searchParams = new URLSearchParams();
        
        // Add any query parameters from the query key
        params.forEach((param, index) => {
          if (param !== undefined && param !== null) {
            searchParams.append(`param${index}`, String(param));
          }
        });

        return apiRequest(`${url}?${searchParams}`);
      },
    },
  },
});