# Long Line Site Diary

A professional construction project management application designed as a digital ring binder. Built for interior fitout and construction project managers who need to track multiple sites, daily diaries, tasks, and documentation.

![Long Line Site Diary](screenshot.png)

## Features

### 🏗️ Project Site Management
- Track up to 10+ construction sites simultaneously
- Store client details, addresses, contact information
- Monitor project budgets and spending
- Visual milestone tracking with progress bars
- Priority levels (Urgent, High, Medium, Low)

### 📓 Daily Site Diary
Comprehensive daily entry system covering:
- **Weather conditions** (temperature, wind, conditions)
- **Labor tracking** by trade (carpenters, electricians, plumbers, etc.)
- **Work completed** descriptions
- **Deliveries** and material receipts
- **Safety checklist** (incidents, toolbox talks, PPE compliance)
- **Next day planning**
- **Photo documentation**

### 📅 Calendar & Scheduling
- Monthly calendar view with all milestones and tasks
- Color-coded events by priority and status
- Click any date to see detailed events
- Track site visits and inspections

### ✅ Task Management
- Categorized tasks (Urgent Deadline, Review Docs, Client Meeting, etc.)
- Priority-based color coding
- Due date tracking
- Site-specific or general tasks
- One-click completion

### 📁 Document Management
- Upload and organize documents per site
- Photo gallery for site progress
- File download capability
- Local storage (no cloud required)

### 💾 Data Management
- **100% Offline** - All data stored in browser LocalStorage
- Export/Import JSON backups
- No internet connection required
- No subscription fees

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **date-fns** - Date handling
- **Lucide React** - Icons

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/long-line-site-diary.git
cd long-line-site-diary
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Building for Production

```bash
npm run build
```

This creates a `dist` folder with static files ready for deployment.

### Deployment

#### GitHub Pages
```bash
npm run deploy
```

#### Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

#### Netlify (Free)
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify drop zone

## Usage Guide

### First Run
1. The app comes with 6 sample projects pre-loaded
2. Delete or edit these to match your real projects
3. All data saves automatically to your browser

### Creating a Site Diary Entry
1. Click **Sites** tab
2. Select a project site
3. Click **Open Diary**
4. Fill in the daily sections (Weather, Labor, Work Done, Safety)
5. Click **Save Entry**

### Managing Tasks
1. Click **Tasks** tab
2. Click **Add Task**
3. Set category, priority, due date, and site
4. Tasks appear on Dashboard and Calendar

### Backing Up Data
1. Click **Export** button (top right)
2. Saves a JSON file with all your data
3. Store this file safely

### Restoring Data
1. Click **Import** button (top right)
2. Select your backup JSON file
3. All data is restored

## Customization

### Adding More Sites
Edit `src/data/initialData.js` to add default sites, or add them through the UI.

### Modifying Diary Fields
The diary template is in `src/data/initialData.js` under `diaryTemplate`.

### Changing Colors
Edit `tailwind.config.js` to modify the binder color scheme.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Storage Limits

- LocalStorage: ~5-10MB (sufficient for years of project data)
- Photos are stored as base64 (consider exporting old projects to manage size)

## License

MIT License - Free for personal and commercial use.

## Support

For issues or feature requests, please open a GitHub issue.

---

Built with ❤️ for construction professionals who need reliable project management without the subscription costs.
