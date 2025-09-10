# SECKIOB — UltraPro (tout-en-un)
Modules: Abonnements (MobileMoney mock + Stripe), Kiosques, Business (secteurs + ajout manuel),
Agents 5%, GPS (carte), IA vocale (TTS), Comptabilité simple.

## Serveur
cd server
copy .env.example .env
npm install
npm run dev

## App
cd app
npm install
# Dans app/src/config/env.js met l'IP du serveur

## Build APK
eas login
eas build:configure --platform android
eas build -p android --profile production
