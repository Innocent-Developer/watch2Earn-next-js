# UK ADS - Watch2Earn Application

A modern web application for the UK ADS platform, featuring user management, referral system, and deposit functionality.

## 🚀 Features

### Core Features
- ✅ **User Authentication**: Login/Signup with localStorage persistence
- ✅ **Referral System**: Auto-fill invite codes, non-editable fields
- ✅ **User Dashboard**: Balance tracking, withdrawal management
- ✅ **Deposit System**: Digital business card activation
- ✅ **Settings Management**: User preferences and profile management
- ✅ **Responsive Design**: Mobile-first approach with Tailwind CSS

### Technical Features
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Next.js 15**: Latest version with App Router
- ✅ **Tailwind CSS**: Modern styling with custom design system
- ✅ **Local Storage**: Persistent user data management
- ✅ **API Integration**: RESTful API endpoints
- ✅ **Error Handling**: Graceful error management
- ✅ **Build Optimization**: Production-ready builds

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
│   ├── utils/             # Utility functions
│   ├── login/             # Login page
│   ├── signup/            # Signup page with referral
│   ├── settings/          # User settings
│   ├── referrals/         # Referral management
│   ├── deposit/           # Deposit functionality
│   ├── wallet/            # Wallet management
│   └── test-*/            # Test pages for development
├── public/                # Static assets
├── scripts/               # Build and maintenance scripts
└── package.json
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://watch2earn-vie97.ondigitalocean.app

# Application Settings
NEXT_PUBLIC_APP_NAME=UK ADS
NEXT_PUBLIC_APP_VERSION=1.0.0
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
The application includes several test pages for development:

- `/test-signup` - Test signup API integration
- `/test-referral` - Test referral system functionality
- `/test-user-storage` - Test localStorage management

### API Testing
```bash
# Test signup API
curl -X POST https://watch2earn-vie97.ondigitalocean.app/api/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phoneNumber":"1234567890","password":"password123"}'
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The application is compatible with:
- Vercel
- Netlify
- Railway
- DigitalOcean App Platform
- Any Node.js hosting platform

## 🔍 Troubleshooting

### Build Issues
If you encounter build errors:

```bash
# Clean and rebuild
npm run build:clean

# Or use the script
./scripts/clean-build.sh
```

### Development Issues
For development server issues:

```bash
# Clean cache and restart
npm run dev:clean
```

### Common Issues

1. **Build Manifest Errors**
   - Solution: Clear `.next` cache and rebuild
   - Command: `npm run build:clean`

2. **TypeScript Errors**
   - Solution: Check type definitions in `app/utils/`
   - Command: `npm run lint`

3. **API Connection Issues**
   - Check network connectivity
   - Verify API endpoint in environment variables
   - Test with `/test-signup` page

4. **Local Storage Issues**
   - Clear browser cache
   - Check browser console for errors
   - Test with `/test-user-storage` page

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🔒 Security

### Best Practices
- User data stored in localStorage (client-side only)
- No sensitive data in localStorage
- API calls with proper error handling
- Input validation on all forms

### Data Protection
- Passwords never stored in localStorage
- Session management through API tokens
- Secure API communication (HTTPS)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for UK ADS platform.

## 🆘 Support

For technical support or questions:
- Check the troubleshooting section above
- Review test pages for functionality
- Contact the development team

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
