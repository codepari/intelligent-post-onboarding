# Screenshots Guide

To add screenshots to the repository, take screenshots of these pages and save them in `/docs/screenshots/`:

## Required Screenshots

### 1. Dashboard (dashboard.png)
- Navigate to: http://localhost:3000/
- Shows: Total candidates, risk distribution, upcoming joinings, at-risk count
- **How to take**:
  ```bash
  # On Mac
  Cmd + Shift + 4, then Space, click on browser window

  # Or full screen
  Cmd + Shift + 3
  ```

### 2. Candidates List (candidates.png)
- Navigate to: http://localhost:3000/candidates
- Shows: Candidate table with filters, search, and Export CSV button
- Make sure to show:
  - Search bar
  - Risk level filter
  - Region filter
  - Export CSV button
  - Candidate list with risk scores

### 3. Candidate Details (candidate-details.png)
- Navigate to: http://localhost:3000/candidates/dc1df679-0ac2-42cb-a70b-42e3629b889b
- Shows: Full candidate profile with "Schedule Follow-ups" button
- Make sure to show:
  - Candidate name and info
  - Risk assessment section
  - Schedule Follow-ups button
  - Timeline/communications

### 4. Follow-ups Tracking (follow-ups.png)
- Navigate to: http://localhost:3000/follow-ups
- Shows: Pending follow-ups table with "Open Google Sheet" button
- Make sure to show:
  - Follow-up list
  - Days since joining badges
  - Status indicators
  - Complete button

### 5. Risk Assessment (risk-assessment.png)
- On candidate detail page, scroll to risk assessment section
- Shows: AI-powered risk prediction with score and recommendations
- Make sure to show:
  - Risk score
  - Risk level badge
  - Risk factors
  - Recommendations

## Quick Screenshot Script

Save this as `take-screenshots.sh`:

```bash
#!/bin/bash

SCREENSHOT_DIR="docs/screenshots"
mkdir -p "$SCREENSHOT_DIR"

echo "📸 Taking screenshots..."
echo ""
echo "Please navigate to each URL and press Enter to take screenshot:"
echo ""

# Dashboard
echo "1️⃣  Navigate to: http://localhost:3000/"
read -p "Press Enter when ready..."
screencapture -w "$SCREENSHOT_DIR/dashboard.png"
echo "✅ Dashboard saved"

# Candidates
echo "2️⃣  Navigate to: http://localhost:3000/candidates"
read -p "Press Enter when ready..."
screencapture -w "$SCREENSHOT_DIR/candidates.png"
echo "✅ Candidates saved"

# Candidate Details
echo "3️⃣  Navigate to: http://localhost:3000/candidates/dc1df679-0ac2-42cb-a70b-42e3629b889b"
read -p "Press Enter when ready..."
screencapture -w "$SCREENSHOT_DIR/candidate-details.png"
echo "✅ Candidate Details saved"

# Follow-ups
echo "4️⃣  Navigate to: http://localhost:3000/follow-ups"
read -p "Press Enter when ready..."
screencapture -w "$SCREENSHOT_DIR/follow-ups.png"
echo "✅ Follow-ups saved"

# Risk Assessment
echo "5️⃣  Scroll to Risk Assessment section on candidate detail page"
read -p "Press Enter when ready..."
screencapture -s "$SCREENSHOT_DIR/risk-assessment.png"
echo "✅ Risk Assessment saved"

echo ""
echo "🎉 All screenshots taken!"
echo "Screenshots saved in: $SCREENSHOT_DIR"
```

## Using the Script

```bash
# Make executable
chmod +x take-screenshots.sh

# Run it
./take-screenshots.sh
```

## Manual Process

1. **Open application**: http://localhost:3000
2. **Login**: admin@example.com / admin123
3. **For each page**:
   - Navigate to the page
   - Press `Cmd + Shift + 4` (Mac) or `Win + Shift + S` (Windows)
   - Click spacebar to capture window, or select area
   - Save to `docs/screenshots/`
4. **Name files exactly as**:
   - `dashboard.png`
   - `candidates.png`
   - `candidate-details.png`
   - `follow-ups.png`
   - `risk-assessment.png`

## After Taking Screenshots

1. **Verify files exist**:
   ```bash
   ls -lh docs/screenshots/
   ```

2. **Optimize images** (optional):
   ```bash
   # Install imageoptim-cli
   npm install -g imageoptim-cli

   # Optimize
   imageoptim docs/screenshots/*.png
   ```

3. **Add to git**:
   ```bash
   git add docs/screenshots/
   git commit -m "Add application screenshots"
   git push
   ```

## Screenshot Specifications

- **Format**: PNG
- **Size**: Optimize to < 500KB each
- **Resolution**: 1920x1080 or similar
- **Browser**: Show Chrome/Firefox with clean UI
- **Hide**: Personal data, if any

## Tips for Good Screenshots

✅ **Do**:
- Use light mode (better visibility)
- Show realistic data
- Capture full page/window
- Include UI elements (navigation, buttons)
- Make sure text is readable

❌ **Don't**:
- Include personal information
- Use blurry images
- Cut off important UI elements
- Use dark backgrounds that hide details

## After Adding Screenshots

The README will display them automatically:

```markdown
### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Candidates List
![Candidates](docs/screenshots/candidates.png)
```

---

**Next Step**: Take the 5 screenshots and run `git add docs/screenshots/ && git commit && git push`
