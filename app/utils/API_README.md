# API Integration Utilities

This document describes the API integration utilities for the watch2earn-vie97.ondigitalocean.app/api endpoint.

## Overview

The API utilities provide a complete integration with the user data API endpoints, including:
- User withdrawals
- User deposits  
- User referrals
- Complete user data
- Caching and offline support
- React hooks for easy integration

## API Endpoints

The following endpoints are integrated:

- `GET /user/withdrawals/:email` - Get user withdrawals by email
- `GET /user/deposits/:uid` - Get user deposits by UID
- `GET /user/referrals/:uid` - Get user referral information and invited users
- `GET /user/complete/:uid` - Get comprehensive user data (withdrawals, deposits, referrals)

## Files

### 1. `api.ts` - Core API Functions

Contains the main API request functions and TypeScript interfaces.

```typescript
import { getUserWithdrawals, getUserDeposits, getUserReferrals, getUserCompleteData } from './api'

// Get user withdrawals
const withdrawals = await getUserWithdrawals('user@example.com')

// Get user deposits
const deposits = await getUserDeposits('user123')

// Get user referrals
const referrals = await getUserReferrals('user123')

// Get complete user data
const completeData = await getUserCompleteData('user123')
```

### 2. `userStorage.ts` - Enhanced User Storage

Enhanced with API integration functions:

```typescript
import { syncUserDataWithAPI, getUserWithdrawalsData } from './userStorage'

// Sync user data with API
const userData = await syncUserDataWithAPI('user123', 'user@example.com')

// Get withdrawals with caching
const withdrawals = await getUserWithdrawalsData('user@example.com', false) // false = use cache if available
```

### 3. `useUserData.ts` - React Hooks

Custom React hooks for easy integration:

```typescript
import { useUserData, useUserWithdrawals, useUserDeposits, useUserReferrals } from './useUserData'

// Main hook for all user data
const {
  userData,
  withdrawals,
  deposits,
  referrals,
  isLoading,
  error,
  refresh
} = useUserData('user123', 'user@example.com', {
  autoRefresh: true,
  refreshInterval: 5 * 60 * 1000 // 5 minutes
})

// Individual hooks for specific data
const { withdrawals, isLoading, error, refresh } = useUserWithdrawals('user@example.com')
const { deposits, isLoading, error, refresh } = useUserDeposits('user123')
const { referrals, isLoading, error, refresh } = useUserReferrals('user123')
```

### 4. `UserDataDisplay.tsx` - Example Component

A complete example component showing how to use the hooks:

```typescript
import { UserDataDisplay } from './components/UserDataDisplay'

// Use in your component
<UserDataDisplay uid="user123" email="user@example.com" />

// Or let it auto-detect from localStorage
<UserDataDisplay />
```

## Usage Examples

### Basic API Calls

```typescript
import { getUserWithdrawals, getUserDeposits, getUserReferrals } from './utils/api'

// Fetch user data
const fetchUserData = async (uid: string, email: string) => {
  try {
    const [withdrawals, deposits, referrals] = await Promise.all([
      getUserWithdrawals(email),
      getUserDeposits(uid),
      getUserReferrals(uid)
    ])
    
    return { withdrawals, deposits, referrals }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    throw error
  }
}
```

### Using React Hooks

```typescript
import { useUserData } from './utils/useUserData'

const UserDashboard = () => {
  const { userData, isLoading, error, refresh } = useUserData('user123', 'user@example.com')
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h1>User Dashboard</h1>
      <button onClick={refresh}>Refresh Data</button>
      
      <h2>Withdrawals: {userData?.withdrawals.length || 0}</h2>
      <h2>Deposits: {userData?.deposits.length || 0}</h2>
      <h2>Referrals: {userData?.referrals?.totalReferrals || 0}</h2>
    </div>
  )
}
```

### Caching and Offline Support

The utilities automatically cache API responses in localStorage and provide offline access:

```typescript
import { getCachedUserData, isCachedDataStale } from './utils/userStorage'

// Check if cached data is available and fresh
const cachedData = getCachedUserData()
if (cachedData && !isCachedDataStale()) {
  // Use cached data (less than 5 minutes old)
  return cachedData
}

// Fetch fresh data from API
const freshData = await syncUserDataWithAPI(uid, email)
```

## Configuration Options

### Hook Options

```typescript
const options = {
  autoRefresh: true,           // Enable automatic refresh
  refreshInterval: 300000,     // Refresh every 5 minutes
  initialRefresh: true         // Fetch data on mount
}

const { userData } = useUserData(uid, email, options)
```

### API Request Options

```typescript
// Force refresh (bypass cache)
const withdrawals = await getUserWithdrawalsData(email, true)

// Use cache if available
const withdrawals = await getUserWithdrawalsData(email, false)
```

## Error Handling

All API functions include comprehensive error handling:

```typescript
try {
  const userData = await syncUserDataWithAPI(uid, email)
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message)
    // Handle specific error
  } else {
    console.error('Unknown error:', error)
    // Handle unknown error
  }
}
```

## TypeScript Interfaces

The utilities provide full TypeScript support:

```typescript
interface WithdrawalData {
  id: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

interface DepositData {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

interface ReferralData {
  inviteCode: string
  totalReferrals: number
  totalEarnings: number
  invitedUsers: Array<{
    id: string
    email: string
    name?: string
    joinedAt: string
    status: 'active' | 'inactive'
  }>
}

interface CompleteUserData {
  withdrawals: WithdrawalData[]
  deposits: DepositData[]
  referrals: ReferralData
}
```

## Best Practices

1. **Use React Hooks**: Prefer the custom hooks over direct API calls in React components
2. **Handle Loading States**: Always show loading indicators while data is being fetched
3. **Error Boundaries**: Implement error boundaries to catch and handle API errors gracefully
4. **Caching Strategy**: Use the built-in caching for better user experience and reduced API calls
5. **Refresh Intervals**: Set appropriate refresh intervals based on data volatility
6. **Offline Support**: The utilities automatically fall back to cached data when offline

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the API endpoint allows requests from your domain
2. **Authentication**: Some endpoints may require authentication headers
3. **Rate Limiting**: Implement appropriate delays between API calls
4. **Network Errors**: Always handle network failures gracefully

### Debug Mode

Enable debug logging by setting the log level:

```typescript
// In your app initialization
localStorage.setItem('debug', 'true')
```

## Performance Considerations

- **Parallel Requests**: Use `Promise.all` for fetching multiple data types simultaneously
- **Caching**: Leverage the built-in caching to reduce API calls
- **Lazy Loading**: Only fetch data when needed
- **Debouncing**: Implement debouncing for refresh operations

## Security Notes

- Never expose API keys in client-side code
- Validate all API responses before use
- Implement proper error handling to avoid information leakage
- Use HTTPS for all API communications 