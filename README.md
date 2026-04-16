# ConstitutionLearn 🇮🇳

An interactive educational platform for learning about the Indian Constitution through AI-powered chatbots, quizzes, and comprehensive article browsing.

## 🚀 Features

- **Indian Constitution Dataset** - Complete access to all 454 articles from the Indian Constitution
- **AI Chatbot** - Interactive tutor powered by constitutional knowledge
- **Constitution Browser** - Search, filter, and explore articles with ease
- **Quiz Module** - Test your constitutional knowledge
- **Learning Module** - Study with interactive flashcards
- **Profile System** - Track progress and achievements
- **Offline Support** - Access constitution data even without internet
- **Responsive Design** - Mobile-first approach for all screen sizes
- **Modern UI** - Built with Tailwind CSS for a beautiful user experience

## 📋 Prerequisites

- Node.js (v12.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 📁 Project Structure

```
ConstitutionLearn/
├── css/
│   ├── tailwind.css          # Tailwind source file
│   └── main.css              # Compiled CSS
├── js/
│   └── constitutionData.js   # Constitution dataset manager
├── pages/
│   ├── login.html            # User login page
│   ├── registration.html     # User registration
│   ├── dashboard.html        # Main dashboard
│   ├── constitution.html     # Article browser (NEW!)
│   ├── chatbot.html          # AI tutor chatbot (ENHANCED!)
│   ├── quiz_module.html      # Quiz system
│   ├── learning_module.html  # Study materials
│   └── profile_module.html   # User profile
├── server/
│   ├── server.js             # Backend API
│   └── routes/               # API routes
├── data/                     # Data directory
├── index.html                # Landing page
├── test-dataset.html         # Dataset testing page
├── CONSTITUTION_DATASET.md   # Dataset documentation
├── ARCHITECTURE.md           # System architecture
└── package.json              # Dependencies
```

## 🎯 New: Constitution Dataset Integration

### Features
- **454 Articles**: Complete Indian Constitution coverage
- **Smart Search**: Find articles by keyword or number
- **Topic Filtering**: Browse by Fundamental Rights, Directive Principles, etc.
- **Offline Mode**: LocalStorage caching for offline access
- **AI Integration**: Enhanced chatbot with constitutional context

### Quick Access
- **Browse Articles**: Open `pages/constitution.html`
- **Test Integration**: Open `test-dataset.html`
- **Documentation**: See `CONSTITUTION_DATASET.md`
- **Architecture**: See `ARCHITECTURE.md`
## 📊 Dataset

**Source**: [Hugging Face - Indian Constitution Dataset](https://huggingface.co/datasets/Sharathhebbar24/Indian-Constitution)
**Author**: Sharath Hebbar
**Total Articles**: 454
**API**: Hugging Face Datasets Server

The dataset includes:
- All constitutional articles
- Fundamental Rights (Articles 12-35)
- Directive Principles (Articles 36-51)
- Union Government structure
- States and their governance
- Judiciary system
- Elections and finance
- Emergency provisions
- Constitutional amendments

## 🎓 Usage Examples

### Browse Constitution Articles
1. Open `pages/constitution.html`
2. Use the search bar to find articles
3. Click topic badges to filter by category
4. Jump to specific article numbers
5. Get random articles for learning

### Chat with AI Tutor
1. Open `pages/chatbot.html`
2. Ask questions like:
   - "Tell me about Article 21"
   - "What are Fundamental Rights?"
   - "Explain the Preamble"
3. Get AI-powered answers with article references

### Test the Integration
1. Open `test-dataset.html`
2. View loading statistics
3. Test search functionality
4. Verify cache operations

## 🔧 Technical Details

### Constitution Data Manager
The `ConstitutionDataManager` class provides:
```javascript
// Fetch all articles
await constitutionManager.fetchAllArticles();

// Search articles
const results = constitutionManager.searchArticles('fundamental rights');

// Get specific article
const article = constitutionManager.getArticleByNumber(21);

// Random article
const random = constitutionManager.getRandomArticle();
```

### Caching
- Articles cached in localStorage
- 7-day cache duration
- ~500KB storage size
- Automatic refresh when expired

## 🌟 Key Pages

- **Landing**: `index.html` - Welcome page
- **Dashboard**: `pages/dashboard.html` - Main hub
- **Constitution Browser**: `pages/constitution.html` - Browse all articles
- **AI Chatbot**: `pages/chatbot.html` - Interactive tutor
- **Quiz**: `pages/quiz_module.html` - Test knowledge
- **Learning**: `pages/learning_module.html` - Study materials

## 🙏 Acknowledgments

- **Dataset**: Sharath Hebbar (Hugging Face)
- **API**: Hugging Face Datasets Server
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
## 🎨 Styling

This project uses Tailwind CSS for styling. Custom utility classes include:


## 🧩 Customization

To customize the Tailwind configuration, edit the `tailwind.config.js` file:


## 📦 Build for Production

Build the CSS for production:

```bash
npm run build:css
# or
yarn build:css
```

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints:

- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up
- `2xl`: 1536px and up

## 🙏 Acknowledgments


