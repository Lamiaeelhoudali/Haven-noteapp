@echo off
echo Starting Haven Backend...
if not exist .env (
  copy .env.example .env
  echo .env file created!
)
npm install
npm run dev
