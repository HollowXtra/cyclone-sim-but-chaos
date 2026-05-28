# cyclone-sim
A p5.js tropical cyclone simulation game

## Windows app

This repo can be packaged as a Windows desktop app with Electron.

```powershell
npm install
npm start
npm run build:win
```

The local Windows installer and portable build are written to `dist/`.

## GitHub Releases

Pushing a version tag such as `v0.4.25` runs the Windows release workflow. The workflow builds the app and uploads the installer/portable `.exe` files to a draft GitHub Release.
