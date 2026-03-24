# How to Add Screenshots to Repository

The repository is ready, but we need screenshots of the application for the README.

## Quick Steps

1. **Make sure app is running**:
   ```bash
   # Backend (Terminal 1)
   cd backend && npm run dev
   
   # Frontend (Terminal 2)
   cd frontend && npm run dev
   ```

2. **Login to the application**:
   - Open: http://localhost:3000
   - Email: admin@example.com
   - Password: admin123

3. **Take 5 screenshots**:

   **Screenshot 1: Dashboard**
   - URL: http://localhost:3000/
   - Press `Cmd + Shift + 4`, then `Spacebar`, click browser
   - Save as: `docs/screenshots/dashboard.png`

   **Screenshot 2: Candidates List**
   - URL: http://localhost:3000/candidates
   - Capture the page showing filters and Export CSV button
   - Save as: `docs/screenshots/candidates.png`

   **Screenshot 3: Candidate Details**
   - Click on any candidate (John Doe)
   - Show the "Schedule Follow-ups" button
   - Save as: `docs/screenshots/candidate-details.png`

   **Screenshot 4: Follow-ups Page**
   - URL: http://localhost:3000/follow-ups
   - Show pending follow-ups (if any)
   - Save as: `docs/screenshots/follow-ups.png`

   **Screenshot 5: Risk Assessment**
   - On candidate detail page, scroll to Risk section
   - Capture just that section
   - Save as: `docs/screenshots/risk-assessment.png`

4. **Add to repository**:
   ```bash
   git add docs/screenshots/*.png
   git commit -m "Add application screenshots"
   git push
   ```

## Alternative: Use the Script

```bash
./take-screenshots.sh
```

This will guide you through taking each screenshot interactively.

## What Screenshots Show

The screenshots demonstrate:
- ✅ Clean, modern UI with Material Design
- ✅ Dashboard with real-time metrics
- ✅ Candidate management interface
- ✅ AI-powered risk assessment
- ✅ Follow-up tracking system
- ✅ Professional, production-ready appearance

## After Adding

The README will automatically display them in the Screenshots section!

---

**Status**: Screenshots pending (README is ready to display them)
