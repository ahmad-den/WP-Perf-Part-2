# BigScoots Performance Debugger Extension

A Chrome extension for analyzing website performance metrics, cache headers, and optimization features specifically designed for BigScoots hosting environments.

## Features

- **Core Web Vitals Monitoring** - Real-time CLS, LCP, INP, and TTFB tracking
- **Resource Analysis** - Image and font optimization insights
- **Cache & Headers** - BigScoots-specific cache status and CDN detection
- **Debug Tools** - Perfmatters toggles and cache bypass parameters
- **Detachable Interface** - Multi-monitor support with persistent state

## Quick Start

### Installation
```bash
npm install
npm run build
```

### Chrome Extension Setup
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → select `dist` folder

### Development
```bash
npm run build:dev    # Development build
npm run watch        # Watch mode
npm run release      # Production package
```

## Architecture

```
Background Service Worker ←→ Popup Interface ←→ Content Scripts
         ↓                        ↓                    ↓
   Tab Management          Display Modules        Performance
   Window Control          State Manager          Monitoring
   Message Router          Toggle Controls        Resource Scan
```

## File Structure

```
src/
├── background/          # Service worker & tab management
├── content/            # Page analysis & monitoring
│   ├── performance/    # Core Web Vitals tracking
│   └── analyzers/      # Resource & PSI analysis
├── popup/              # UI components & displays
│   └── displays/       # Tab-specific UI modules
├── utils/              # Shared utilities
└── styles/             # Component stylesheets
```

## Key Components

### Performance Monitoring
- **CLS Monitor** - Layout shift detection with element highlighting
- **LCP Monitor** - Largest contentful paint tracking
- **INP Monitor** - Interaction responsiveness measurement
- **PSI Analyzer** - PageSpeed Insights integration

### UI Features
- **Tab System** - Organized display with smooth transitions
- **Detached Mode** - Separate window for multi-monitor setups
- **Debug Controls** - Real-time optimization toggles
- **Element Highlighting** - Click-to-highlight performance elements

## Adding Features

### New Performance Metric
1. Create monitor in `src/content/performance/`
2. Add to `src/content/index.js`
3. Create display in `src/popup/displays/`
4. Update UI in `src/popup.html`

### New Resource Analyzer
1. Create analyzer in `src/content/analyzers/`
2. Add display module in `src/popup/displays/`
3. Wire up in `src/popup/index.js`
4. Add tab if needed in `src/popup.html`

### New Debug Toggle
1. Add HTML in `src/popup.html`
2. Update `src/popup/toggle-manager.js`
3. Handle in `src/background/parameter-manager.js`

## Build Commands

```bash
npm run build          # Production build
npm run build:dev      # Development build with source maps
npm run watch          # Development with auto-rebuild
npm run validate       # Pre-release validation
npm run release        # Build + package for Chrome Web Store
```

## Version Management

```bash
npm run version:patch  # 1.0.0 → 1.0.1
npm run version:minor  # 1.0.0 → 1.1.0  
npm run version:major  # 1.0.0 → 2.0.0
```

## License

ISC License - Built for the BigScoots community