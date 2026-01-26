# Safecracking Timer for Alt1

A lightweight Alt1 app that tracks safecracking cooldowns across all RuneScape safe locations.
It automatically detects successful safe cracks via the in-game chatbox and displays timers, progress bars, and optional tooltip alerts.

This project was originally created by **pertinate**.  
This README documents setup, usage, and deployment so the tool can be maintained long term.

## Features
- Tracks cooldowns for every safe location automatically
- Optional Alt1 tooltip notification when a safe becomes available  
- Add notes to each location

## Using the App in Alt1

1. Paste this URL into your browser:
```
alt1://addapp/https://pertinate.github.io/alt1-safecracking-timer/appconfig.json
```
2. Alt1 will register the app. Ensure that you tick the boxes to grant the necessary permissions.
   
<img width="321" height="414" alt="image" src="https://github.com/user-attachments/assets/5569423a-f1e7-404e-8cfa-834835e77bbf" />
    
3. Add the safes you want to track.

<img width="283" height="318" alt="image" src="https://github.com/user-attachments/assets/b280ea54-ff61-46db-bd71-0064ffcb303a" />
   
4. Crack safes normally. The timer updates automatically when it detects that the safe has been cracked.

## Development

### Requirements

- Node.js 16  
- npm  
- Alt1 Toolkit installed locally for testing  

### Install dependencies
```
npm install
```
### Build
```
npm run build
```

Output is generated in `dist/`.

### Local Testing
Serve the dist folder:
```
npx http-server dist -p 3000
```

Then paste this link into your browser:
```
alt1://addapp/http://localhost:3000/appconfig.json
```
Alt1 will detect the app and prompt to add it.

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow that automatically builds and deploys.

If GitHub Pages is enabled, the app will be served at:
```
https://<username>.github.io/alt1-safecracking-timer/
```
You can then add this to Alt1 by pasting this into your browser:
```
alt1://addapp/https://<username>.github.io/alt1-safecracking-timer/appconfig.json
```
## Credits

Original author: **[Pertinate](https://github.com/pertinate)**  
Alt1 framework: **[Skillbert](https://github.com/skillbert)**  
Contributor: **[Zakary2841](https://github.com/Zakary2841)**
