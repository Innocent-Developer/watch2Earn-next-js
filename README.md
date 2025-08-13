# UK ADS - Watch2Earn Application

A comprehensive web application for the UK ADS platform, featuring advanced user management, video ad watching, referral system, and complete API integration with PKR currency support.

## 🚀 Features

### Core Features
- ✅ **User Authentication**: Secure login/signup with persistent localStorage
- ✅ **Watch Ads System**: Complete video watching platform with reward tracking
- ✅ **API Integration**: Full backend integration with watch2earn-vie97.ondigitalocean.app
- ✅ **Referral System**: Advanced referral tracking with earnings and statistics
- ✅ **User Dashboard**: Comprehensive balance tracking and transaction history
- ✅ **Deposit System**: Digital business card activation and payment processing
- ✅ **Wallet Management**: Multi-currency support with PKR as primary currency
- ✅ **Settings Management**: Complete user preferences and profile management
- ✅ **Responsive Design**: Mobile-first approach with modern UI/UX

### Advanced Features
- ✅ **Video Ad Platform**: 
  - Real-time video progress tracking
  - Completion validation and reward claiming
  - Support for direct videos and social media links
  - Daily watch limits and history tracking
  - Error handling and retry mechanisms

- ✅ **API Data Management**:
  - Real-time user data synchronization
  - Offline support with smart caching
  - Automatic data refresh and background updates
  - Comprehensive error handling and fallbacks

- ✅ **Enhanced User Experience**:
  - Loading states and progress indicators
  - Real-time balance updates
  - Transaction history tracking
  - Referral statistics and analytics

### Technical Features
- ✅ **TypeScript**: Full type safety with comprehensive interfaces
- ✅ **Next.js 15**: Latest version with App Router and optimizations
- ✅ **Tailwind CSS**: Modern styling with custom design system
- ✅ **React Hooks**: Custom hooks for data management and API integration
- ✅ **Smart Caching**: Intelligent caching system with stale-while-revalidate
- ✅ **Error Boundaries**: Comprehensive error handling throughout the app
- ✅ **API Integration**: RESTful API endpoints with fallback mechanisms
- ✅ **PKR Currency**: Localized for Pakistani market with PKR display

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd my-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run dev:clean    # Clean cache and start development server
```

### Building
```bash
npm run build        # Build for production
npm run build:clean  # Clean cache and build for production
```

### Maintenance
```bash
npm run clean        # Remove .next directory
npm run clean:all    # Remove .next and node_modules, reinstall
npm run lint         # Run ESLint
```

### Production
```bash
npm run start        # Start production server
```

## 🏗️ Project Structure

```
my-app/
├── app/                    # Next.js App Router
│   ├── components/         # Reusable components
│   │   ├── DashboardClient.tsx      # Main dashboard with API integration
│   │   ├── UserDataDisplay.tsx      # Complete user data component
│   │   ├── DepositModal.tsx         # Enhanced deposit functionality
│   │   ├── WithdrawModal.tsx        # Withdrawal management
│   │   ├── Header.tsx               # Navigation header
│   │   ├── Footer.tsx               # Bottom navigation
│   │   └── SideDrawer.tsx           # Mobile navigation
│   ├── utils/             # Utility functions and API integration
│   │   ├── api.ts                   # Core API functions
│   │   ├── userStorage.ts           # Enhanced user data management
│   │   ├── useUserData.ts           # React hooks for data management
│   │   ├── referralUtils.ts         # Referral system utilities
│   │   └── API_README.md            # API documentation
│   ├── watch-ads/         # Video ad watching platform
│   ├── login/             # Authentication pages
│   ├── signup/            # Registration with referral support
│   ├── settings/          # User preferences management
│   ├── referrals/         # Advanced referral tracking
│   ├── deposit/           # Payment and deposit system
│   ├── wallet/            # Multi-currency wallet management
│   ├── rewards/           # Reward level system
│   ├── level/             # User level progression
│   ├── bonus/             # Bonus and promotional features
│   └── test-*/            # Development testing pages
├── public/                # Static assets
├── scripts/               # Build and maintenance scripts
└── package.json
```

## 🎬 Watch Ads System

### Features
- **Video Player**: Full-featured video player with progress tracking
- **Reward System**: Earn PKR 1.00 per completed video
- **Daily Limits**: 5 ads per day with progress tracking
- **Multiple Formats**: Support for MP4, WebM, OGG, and social media links
- **Error Handling**: Comprehensive error recovery and retry mechanisms
- **Completion Validation**: 95% watch requirement for reward claiming

### Eligibility Requirements
- Pro user plan (plan = "pro")
- Account balance greater than PKR 1
- Not exceeded daily watch limit

### Video Types Supported
- **Direct Videos**: MP4, WebM, OGG with full player controls
- **Social Media**: Instagram, YouTube, TikTok with external link handling
- **Error Recovery**: Automatic retry for failed video loads

## 🔌 API Integration

### Endpoints Integrated
- `GET /user/withdrawals/:email` - User withdrawal history
- `GET /user/deposits/:uid` - User deposit history  
- `GET /user/referrals/:uid` - Referral data and statistics
- `GET /user/complete/:uid` - Comprehensive user data
- `POST /auto/update/balance` - Balance updates from ad watching

### API Features
- **Smart Caching**: 5-minute cache with automatic refresh
- **Offline Support**: Fallback to cached data when offline
- **Error Handling**: Graceful degradation with fallback mechanisms
- **Type Safety**: Full TypeScript interfaces for all API responses
- **Parallel Requests**: Optimized API calls for better performance

### Usage Example
```typescript
import { useUserData } from './utils/useUserData'

const { userData, isLoading, error, refresh } = useUserData(uid, email, {
  autoRefresh: true,
  refreshInterval: 5 * 60 * 1000 // 5 minutes
})
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://watch2earn-vie97.ondigitalocean.app
NEXT_PUBLIC_API_BASE_URL=https://watch2earn-vie97.ondigitalocean.app/api

# Application Settings
NEXT_PUBLIC_APP_NAME=UK ADS
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_CURRENCY=PKR

# Feature Flags
NEXT_PUBLIC_ENABLE_WATCH_ADS=true
NEXT_PUBLIC_ENABLE_API_INTEGRATION=true
NEXT_PUBLIC_DEBUG_MODE=false
```

### Tailwind CSS
The project uses Tailwind CSS with custom colors defined in `app/globals.css`:

```css
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --dark-purple: #4c1d95;
  --light-purple: #e9d5ff;
}
```

## 🧪 Testing

### Test Pages
The application includes comprehensive test pages:

- `/test-signup` - Test signup API integration
- `/test-referral` - Test referral system functionality
- `/test-user-storage` - Test localStorage and API data management

### API Testing
```bash
# Test user data API
curl -X GET https://watch2earn-vie97.ondigitalocean.app/api/user/complete/123

# Test balance update
curl -X POST https://watch2earn-vie97.ondigitalocean.app/api/auto/update/balance \
  -H "Content-Type: application/json" \
  -d '{"uid": 123, "amount": 1}'
```

### Video Testing
- Test various video formats (MP4, WebM, OGG)
- Test social media links (Instagram, YouTube, TikTok)
- Test video completion tracking and reward claiming
- Test error handling and recovery mechanisms

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production
Ensure these are set in your deployment platform:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_CURRENCY=PKR`

### Build Optimization
The app is optimized for production with:
- Static page generation where possible
- Image optimization
- Code splitting and lazy loading
- Efficient caching strategies

## 🔍 Troubleshooting

### API Integration Issues
1. **API Connection Failures**
   - Check network connectivity
   - Verify API endpoint configuration
   - Check CORS settings on API server
   - Test with direct API calls

2. **Caching Issues**
   - Clear localStorage: `localStorage.clear()`
   - Clear API cache: Use clear functions in utils
   - Restart development server

3. **Video Playback Issues**
   - Check video URL accessibility
   - Verify video format support
   - Test with different browsers
   - Check console for detailed error messages

### Build Issues
```bash
# Clean and rebuild
npm run build:clean

# Clear all caches
npm run clean:all
```

### Common Issues

1. **Video Error Details: {}**
   - Fixed with improved error handling
   - Safe property access in video error handlers
   - Detailed error logging and user feedback

2. **API Rate Limiting**
   - Implemented smart caching to reduce API calls
   - Added request queuing for high-frequency operations
   - Fallback to cached data when API is unavailable

3. **Currency Display Issues**
   - All currency displays updated to PKR
   - Consistent formatting throughout the app
   - Proper localization for Pakistani market

## 💰 Currency Support

The application now uses **PKR (Pakistani Rupees)** as the primary currency:

- ✅ All balance displays show PKR
- ✅ Withdrawal amounts in PKR
- ✅ Deposit amounts in PKR  
- ✅ Referral earnings in PKR
- ✅ Ad watching rewards in PKR (PKR 1.00 per video)
- ✅ Bonus amounts in PKR

## 📱 Browser Support

- ✅ Chrome 90+ (with video support)
- ✅ Firefox 88+ (with video support)
- ✅ Safari 14+ (with video support)
- ✅ Edge 90+ (with video support)
- ✅ Mobile browsers (iOS Safari, Android Chrome)

## 🔒 Security

### Best Practices
- User data encryption in localStorage
- API request validation and sanitization
- CORS protection for API endpoints
- Input validation on all forms
- XSS protection with React's built-in sanitization

### Data Protection
- No sensitive data stored in localStorage
- Session management through secure API tokens
- Video URLs validated before playback
- API responses validated with TypeScript interfaces

### Video Security
- Cross-origin video loading with proper headers
- URL validation for video sources
- Error handling to prevent XSS attacks
- Safe rendering of video content

## 📊 Performance Optimizations

- **Lazy Loading**: Components and routes loaded on demand
- **Caching Strategy**: Smart caching with 5-minute TTL
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting by Next.js
- **API Optimization**: Parallel requests and request deduplication
- **Video Optimization**: Progressive video loading and error recovery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Ensure all tests pass
5. Submit a pull request with detailed description

### Development Guidelines
- Follow TypeScript best practices
- Add comprehensive error handling
- Include loading states for all async operations
- Test API integration thoroughly
- Maintain backwards compatibility

## 📄 License

This project is proprietary software for UK ADS platform.

## 🆘 Support

For technical support or questions:
- Check the troubleshooting section above
- Review API documentation in `app/utils/API_README.md`
- Test functionality with development test pages
- Check browser console for detailed error messages
- Contact the development team

## 🔄 Version History

### v2.0.0 (Current)
- ✅ Complete API integration with backend
- ✅ Advanced video ad watching platform
- ✅ PKR currency implementation
- ✅ Enhanced user data management
- ✅ Real-time balance updates
- ✅ Comprehensive error handling

### v1.0.0
- ✅ Basic user authentication
- ✅ Simple referral system
- ✅ Basic deposit functionality
- ✅ localStorage user management

---

**Built with ❤️ using Next.js 15, TypeScript, Tailwind CSS, and comprehensive API integration**

*Optimized for the Pakistani market with PKR currency support and localized user experience*
