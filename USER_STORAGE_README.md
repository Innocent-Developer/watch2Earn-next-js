# User Storage System Documentation

This document explains how to use the user storage system implemented in this application. The system provides a centralized way to manage user data in localStorage with TypeScript support.

## Overview

The user storage system consists of:
- **Utility Functions**: Located in `app/utils/userStorage.ts`
- **Type Definitions**: TypeScript interfaces for type safety
- **Integration**: Used across components for consistent user data management

## Features

- ✅ **TypeScript Support**: Full type safety with interfaces
- ✅ **Error Handling**: Graceful error handling for localStorage operations
- ✅ **SSR Safe**: Works with Next.js server-side rendering
- ✅ **Utility Functions**: Easy-to-use helper functions
- ✅ **Preferences Management**: User preferences with persistence
- ✅ **Avatar Support**: User initials and avatar handling

## User Data Interface

```typescript
interface UserData {
  id?: string
  name?: string
  email?: string
  phone?: string
  phoneNumber?: string
  totalBalance?: string
  totalWithdrawals?: string
  inviteCode?: string
  level?: string
  avatar?: string
  lastLogin?: string
  isActive?: boolean
  preferences?: {
    notifications?: boolean
    theme?: 'light' | 'dark'
    language?: string
  }
  [key: string]: any // Allow for additional properties
}
```

## Utility Functions

### Core Functions

#### `getUserData(): UserData | null`
Retrieves user data from localStorage.

```typescript
const user = getUserData()
if (user) {
  console.log('User name:', user.name)
}
```

#### `setUserData(userData: UserData): void`
Stores user data in localStorage.

```typescript
const userData: UserData = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  // ... other fields
}
setUserData(userData)
```

#### `clearUserData(): void`
Removes user data from localStorage.

```typescript
clearUserData() // Logs out the user
```

#### `updateUserData(updates: Partial<UserData>): void`
Updates specific user data fields.

```typescript
updateUserData({ totalBalance: '200.00' })
```

#### `isUserLoggedIn(): boolean`
Checks if user is currently logged in.

```typescript
if (isUserLoggedIn()) {
  // User is logged in
}
```

### Helper Functions

#### `getUserDisplayName(): string`
Gets user's display name (name or email fallback).

```typescript
const displayName = getUserDisplayName() // Returns "John Doe" or "john@example.com"
```

#### `getUserInitials(): string`
Gets user's initials for avatar display.

```typescript
const initials = getUserInitials() // Returns "J" for "John Doe"
```

#### `updateLastLogin(): void`
Updates user's last login timestamp.

```typescript
updateLastLogin() // Sets lastLogin to current timestamp
```

### Preferences Functions

#### `getUserPreferences(): UserData['preferences']`
Gets user preferences with defaults.

```typescript
const preferences = getUserPreferences()
// Returns: { notifications: true, theme: 'light', language: 'en' }
```

#### `updateUserPreferences(preferences: Partial<UserData['preferences']>): void`
Updates user preferences.

```typescript
updateUserPreferences({ theme: 'dark', notifications: false })
```

## Usage Examples

### 1. Login Flow

```typescript
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    const data = await response.json()
    
    if (data.user) {
      setUserData(data.user)
      updateLastLogin()
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Login failed:', error)
  }
}
```

### 2. Logout Flow

```typescript
const handleLogout = () => {
  clearUserData()
  router.push('/login')
}
```

### 3. User Profile Update

```typescript
const updateProfile = (updates: Partial<UserData>) => {
  updateUserData(updates)
  // Optionally refresh the UI
  const updatedUser = getUserData()
  setUser(updatedUser)
}
```

### 4. Preferences Management

```typescript
const toggleTheme = () => {
  const currentPreferences = getUserPreferences()
  const newTheme = currentPreferences.theme === 'light' ? 'dark' : 'light'
  updateUserPreferences({ theme: newTheme })
}
```

## Component Integration

### Settings Page Example

```typescript
"use client"

import { getUserData, clearUserData, getUserInitials } from '../utils/userStorage'

const SettingsPage = () => {
  const [user, setUser] = useState(getUserData())
  
  const handleLogout = () => {
    clearUserData()
    router.push('/login')
  }
  
  return (
    <div>
      <div className="avatar">
        <span>{getUserInitials()}</span>
      </div>
      <h1>{user?.name}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
```

### Protected Route Example

```typescript
const ProtectedComponent = () => {
  const router = useRouter()
  
  useEffect(() => {
    if (!isUserLoggedIn()) {
      router.push('/login')
    }
  }, [router])
  
  const user = getUserData()
  if (!user) return <div>Loading...</div>
  
  return <div>Welcome, {user.name}!</div>
}
```

## Testing

Visit `/test-user-storage` to test all functionality:

1. **Set Sample User**: Creates a test user in localStorage
2. **Update User Balance**: Modifies user data
3. **Toggle Preferences**: Changes user preferences
4. **Update Last Login**: Updates login timestamp
5. **Clear User Data**: Removes all user data
6. **Go to Settings**: See user data in action

## localStorage Structure

```json
{
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "totalBalance": "150.00",
    "totalWithdrawals": "50.00",
    "inviteCode": "JOHN123",
    "level": "VIP1",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "isActive": true,
    "preferences": {
      "notifications": true,
      "theme": "light",
      "language": "en"
    }
  }
}
```

## Best Practices

1. **Always check for user existence** before accessing user data
2. **Use TypeScript interfaces** for type safety
3. **Handle errors gracefully** with try-catch blocks
4. **Update last login** when user logs in
5. **Clear data on logout** to prevent security issues
6. **Use utility functions** instead of direct localStorage access
7. **Test with the test page** before implementing in production

## Security Considerations

- localStorage is client-side only and not secure for sensitive data
- Never store passwords or tokens in localStorage
- Clear user data on logout
- Consider using httpOnly cookies for sensitive authentication data
- Implement proper server-side validation

## Browser Support

- ✅ Chrome 4+
- ✅ Firefox 3.5+
- ✅ Safari 4+
- ✅ Edge 12+
- ✅ Internet Explorer 8+

## Error Handling

The utility functions include error handling for:
- localStorage not available (SSR)
- JSON parsing errors
- localStorage quota exceeded
- Invalid data types

All errors are logged to console but don't crash the application. 