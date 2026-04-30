# Start Backend and Frontend concurrently
Write-Host "🚀 Starting CareerCampus Platform..." -ForegroundColor Cyan

# Start Backend in a separate window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

# Start Frontend in current window
Write-Host "🌐 Starting Frontend..." -ForegroundColor Yellow
cd frontend
npm run dev
