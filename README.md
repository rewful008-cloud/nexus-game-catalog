# KUN 0X Nexus Game Catalog 🎮

A modern, beautiful static website showcasing a comprehensive game catalog with advanced filtering, search capabilities, and detailed game information.

**Powered by:** KUN 0X Nexus v1.1 Bot  
**Specialized in:** Bypass exploitation and tracking libraries emulation (AppsFlyer, Singular, Adjust)  
**Developed by:** Engineer Eyad Saleh

## ✨ Features

- **🎯 Smart Filtering** - Filter games by platform (Android/iOS), genre, and provider
- **🔍 Real-time Search** - Instant search across game names and packages
- **🎨 Modern UI** - Beautiful glassmorphism design with smooth animations
- **📱 Responsive** - Works perfectly on all devices
- **🌐 Bilingual** - Supports English and Arabic languages
- **⭐ Featured Games** - Highlight your best games
- **🎮 Detailed Modals** - Comprehensive game information with events, jailbreak modes, and more

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling
- **Vue.js 3** - Reactive UI framework
- **Lucide Icons** - Beautiful icon system
- **Vanilla JavaScript** - No build tools needed

## 📁 Project Structure

```
static_site/
├── index.html          # Main HTML file
├── data.json           # Game catalog data
├── js/
│   └── app.js          # Vue.js application logic
├── .gitignore          # Git ignore rules
├── netlify.toml        # Netlify configuration
└── README.md           # This file
```

## 🚀 Local Development

### Option 1: Python HTTP Server
```bash
python -m http.server 3000
```

### Option 2: Custom Server
```bash
python serve_static_site_alt.py
```

Then open: http://localhost:3000

## 🌐 Deployment

This site is optimized for deployment on Netlify:

1. Push to GitHub
2. Connect repository to Netlify
3. Deploy (no build step required!)

See [دليل_الرفع_على_GitHub.md](./دليل_الرفع_على_GitHub.md) for detailed Arabic deployment instructions.

## 📝 Data Format

Games are stored in `data.json` with the following structure:

```json
{
  "id": 1,
  "name": "Game Name",
  "package_name": "com.example.game",
  "device_os": "android",
  "provider": "AppsFlyer",
  "genre": "Action",
  "icon_url": "https://...",
  "header_image_url": "https://...",
  "is_featured": true,
  "is_new": false,
  "status": "active",
  "available_events": ["event1", "event2"],
  "jambara_modes": ["dopamine", "neo"],
  "developer": "Developer Name",
  "store_url": "https://play.google.com/...",
  "work_method": "Description...",
  "admin_notes": "Notes..."
}
```

## 🔄 Updating Game Data

1. Update games in your database
2. Run the site generator: `python modules/site_generator.py`
3. Optionally fetch assets: `python auto_fetch_assets.py`
4. Commit and push the updated `data.json`
5. Netlify will auto-deploy

## 📄 License

© 2024 KUN 0X Nexus. All rights reserved.

## 🙏 Credits

**Bot Name:** KUN 0X Nexus v1.1  
**Developer:** Engineer Eyad Saleh (المهندس إياد صالح)  
**Specialization:** Bypass exploitation and tracking libraries emulation  
**Technologies:** AppsFlyer, Singular, Adjust simulation

Built with modern web technologies and designed for the best user experience.

---

**Live Demo:** [Your Netlify URL]  
**Bot:** [@Kun0x_bot](https://t.me/Kun0x_bot)  
**Support/Community:** [KUN0X Nexus Group](https://t.me/KUN0XNexus)
