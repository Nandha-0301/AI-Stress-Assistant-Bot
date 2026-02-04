# CalmSpace - Stress Relief for Students

A beautiful, calming web application designed to help students (ages 15-25) manage exam stress through guided breathing exercises, motivational quotes, AI chat support, and progress tracking.

## 🌟 Features

- **Guided Breathing Exercises**: Interactive breathing circle with customizable duration (3-8 seconds) to help reduce stress and anxiety
- **Motivational Quotes**: Random inspirational quotes to uplift and motivate during challenging times
- **AI Chatbot**: Supportive conversational interface for emotional support (placeholder API integration included)
- **Progress Tracker**: Monitor your wellness activities and celebrate achievements (placeholder API integration included)
- **Settings**: Theme toggle (light/dark mode) and notification preferences
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and ARIA labels

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Local Setup

1. **Clone or download this repository**

2. **Navigate to the project directory**
   ```bash
   cd calmspace
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Visit `http://localhost:8080`
   - The app will automatically reload when you make changes

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 📦 Opening in CodeSandbox

### Method 1: Upload ZIP File (No Signup Required)

1. **Download this project as a ZIP file**
   - Click the green "Code" button on GitHub
   - Select "Download ZIP"
   - Extract the ZIP file to your computer

2. **Open CodeSandbox**
   - Visit [codesandbox.io](https://codesandbox.io)
   - Click "Create Sandbox" or the "+" button

3. **Import the project**
   - Select "Import Project"
   - Choose "Upload Folder/Files"
   - Upload the extracted project folder

4. **Start coding!**
   - CodeSandbox will automatically install dependencies and run the dev server
   - You can view and edit your app directly in the browser

### Method 2: Import from GitHub

1. **Push to GitHub** (if not already there)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Open CodeSandbox**
   - Visit [codesandbox.io](https://codesandbox.io)
   - Click "Import" from the dashboard

3. **Import from GitHub**
   - Paste your GitHub repository URL
   - CodeSandbox will clone and set up the project automatically

## 🏗️ Project Structure

```
calmspace/
├── src/
│   ├── assets/            # Images and static assets
│   ├── components/        # Reusable React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Navigation.tsx
│   │   ├── BreathingCircle.tsx
│   │   ├── QuoteCard.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ProgressCard.tsx
│   ├── pages/            # Page components
│   │   ├── Index.tsx     # Homepage
│   │   ├── Breathing.tsx # Breathing exercises
│   │   ├── Quotes.tsx    # Motivational quotes
│   │   ├── Chat.tsx      # AI chatbot
│   │   ├── Progress.tsx  # Progress tracker
│   │   ├── Settings.tsx  # App settings
│   │   └── NotFound.tsx  # 404 page
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles and design tokens
├── public/               # Static files
├── index.html           # HTML entry point
├── tailwind.config.ts   # Tailwind CSS configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Project dependencies
```

## 🎨 Design System

The app uses a calming color palette with semantic design tokens defined in `src/index.css`:

- **Primary**: Soft blue (#A9DCFF) - Used for main actions and breathing exercises
- **Secondary**: Lavender (#E7C6FF) - Used for chat and secondary actions
- **Accent**: Mint green (#B2F5EA) - Used for quotes and highlights
- **Background**: Light, airy gradients for a peaceful atmosphere

All colors are defined using HSL values for easy customization and support both light and dark themes.

## 🔌 API Integration

The app includes placeholder API calls that you can replace with your backend:

### Chat API
```typescript
// In src/pages/Chat.tsx
// TODO: Replace with real backend URL
const response = await axios.post('/api/chat', {
  message: inputValue,
  history: messages
});
```

### Progress API
```typescript
// In src/pages/Progress.tsx
// TODO: Replace with real backend URL
const response = await axios.get('/api/progress');
```

**Important**: Never commit API keys or secrets to your repository. Use environment variables for sensitive data.

## ♿ Accessibility Features

- Semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, etc.)
- ARIA labels and roles for screen readers
- Keyboard navigation support
- High contrast ratios for readability
- Focus indicators for interactive elements
- Alt text for all images
- Responsive text sizing

## 🛠️ Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **shadcn/ui** - UI component library
- **Lucide React** - Icon library

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

This is a student wellness project. Feel free to customize it for your needs!

## 📄 License

This project is provided as-is for educational and personal use.

## 🆘 Support Resources

If you're experiencing severe anxiety or mental health concerns, please reach out to:
- Your school counselor or mental health services
- Local crisis helpline
- National mental health organizations

## 💡 Tips for Customization

1. **Change colors**: Edit `src/index.css` to update the design system
2. **Add more quotes**: Expand the quotes array in `src/pages/Quotes.tsx`
3. **Customize breathing duration**: Adjust the range in `src/pages/Breathing.tsx`
4. **Add more pages**: Create new page components and add routes in `src/App.tsx`
5. **Connect real backend**: Replace placeholder API calls with your actual endpoints

## 🎯 Future Enhancements

- User authentication and profiles
- Activity streaks and achievements
- Custom breathing patterns
- Journal feature
- Community support forums
- Mobile app version

---

Made with 💙 for student wellness
