# Network Resilience & Offline Handling

## The Problem

You encountered an application error when:
1. You opened the `/blog` page in a browser tab
2. Switched off your network connection
3. Left the tab open for 1-2 hours
4. Returned to see an application error

## Why This Happened

### Root Causes:
1. **Network Timeout**: The WordPress API request timed out when the network was disconnected
2. **No Retry Logic**: Failed requests weren't retried when the connection was restored
3. **No Fallback Data**: When the API failed, there was no cached or fallback content to display
4. **Poor Error Handling**: The error boundary didn't provide helpful recovery options
5. **No Offline Detection**: The app didn't detect or communicate network status to users

### Technical Details:
- Next.js server-side rendering attempts to fetch data during page load
- When network is unavailable, the `fetch` request hangs indefinitely or times out
- Without proper error handling, this causes the entire page to crash
- The error boundary catches the error but doesn't provide context about network issues

## Solutions Implemented

### 1. Enhanced API Error Handling (`lib/wordpress.ts`)

```typescript
// Added timeout and retry logic
async function fetchGraphQL(query: string, variables: Record<string, any> = {}, retries: number = 3) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

  try {
    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      // ... existing config
      signal: controller.signal, // Enable request cancellation
    })
    // ... handle response
  } catch (error) {
    // Retry logic for network errors
    if (retries > 0 && (error instanceof TypeError || (error as Error).name === 'AbortError')) {
      console.warn(`Retrying GraphQL request. Attempts remaining: ${retries - 1}`)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retry
      return fetchGraphQL(query, variables, retries - 1)
    }
    throw error
  }
}
```

**Benefits:**
- 10-second timeout prevents indefinite hanging
- 3 automatic retries with 1-second delays
- Graceful degradation when all retries fail

### 2. Fallback Data System (`lib/fallback-data.ts`)

```typescript
// Provides static content when API fails
export const fallbackBlogPosts = [
  {
    id: "fallback-1",
    title: "How to Restore Old Family Photos: A Complete Guide",
    excerpt: "Learn the essential techniques...",
    // ... complete post data
  },
  // ... more fallback posts
];
```

**Benefits:**
- Users always see content, even when offline
- Maintains app functionality during network issues
- Provides relevant, helpful content related to photo restoration

### 3. Network Status Monitoring (`components/network-status.tsx`)

```typescript
// Real-time network status detection
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isOffline: !isOnline };
}
```

**Benefits:**
- Real-time network status detection
- Visual feedback to users about connection state
- Automatic notifications when connection is restored

### 4. Improved Error Boundaries (`app/blog/error.tsx`)

```typescript
// Enhanced error handling with network awareness
export default function BlogError({ error, reset }) {
  const [isOnline, setIsOnline] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  // Network status monitoring
  useEffect(() => {
    setIsOnline(navigator.onLine)
    // ... event listeners
  }, [error])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    reset()
  }

  // Different UI based on network status
  return (
    <div>
      {!isOnline ? (
        <WifiOff className="w-16 h-16 text-orange-500 mx-auto mb-4" />
      ) : (
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      )}
      {/* ... contextual error messages */}
    </div>
  )
}
```

**Benefits:**
- Context-aware error messages
- Different handling for network vs. application errors
- Retry tracking and intelligent retry suggestions

### 5. Offline-Aware UI Components

```typescript
// Blog page with offline banner
<main className="pt-32 pb-20">
  <div className="max-w-7xl mx-auto px-4">
    <OfflineBanner /> {/* Shows when offline */}
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogPosts.length > 0 ? (
        // Show posts
      ) : (
        // Show "no content" message with helpful text
      )}
    </div>
  </div>
</main>
```

**Benefits:**
- Clear communication about offline state
- Helpful guidance for users
- Maintains visual consistency

## Prevention Strategies

### For Users:
1. **Refresh the page** if you've been offline for extended periods
2. **Check your internet connection** if you see error messages
3. **Use the retry button** in error screens - it's now smarter about network issues

### For Developers:
1. **Always implement timeouts** for external API calls
2. **Add retry logic** for network-related failures
3. **Provide fallback content** for critical user flows
4. **Monitor network status** and communicate it to users
5. **Test offline scenarios** during development

## Testing the Solutions

### Manual Testing:
1. Open the blog page
2. Disconnect your internet
3. Wait for the offline banner to appear
4. Reconnect your internet
5. See the "Connection restored" notification
6. Refresh the page to see fallback content loading

### Automated Testing:
```javascript
// Example test for offline handling
test('shows fallback content when API fails', async () => {
  // Mock API failure
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))
  
  render(<BlogPage />)
  
  // Should show fallback posts instead of crashing
  expect(screen.getByText('How to Restore Old Family Photos')).toBeInTheDocument()
})
```

## Monitoring & Alerting

Consider implementing:
1. **Error tracking** (e.g., Sentry) to monitor API failures
2. **Performance monitoring** to track API response times
3. **User analytics** to understand offline usage patterns
4. **Health checks** for the WordPress API endpoint

## Future Improvements

1. **Service Worker**: Implement a service worker for true offline caching
2. **IndexedDB**: Store blog posts locally for offline reading
3. **Background Sync**: Queue actions when offline and sync when online
4. **Progressive Enhancement**: Make core functionality work without JavaScript
5. **CDN Caching**: Cache API responses at the edge for faster loading

This comprehensive approach ensures your application remains functional and user-friendly even during network disruptions, providing a much better user experience than the previous "application error" scenario.