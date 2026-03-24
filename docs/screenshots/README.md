# Screenshots

This directory contains application screenshots for the README and documentation.

## Required Screenshots

Please add the following screenshots to this directory:

### 1. dashboard.png
- **Page**: Dashboard (http://localhost:3000/)
- **Shows**: 
  - Total candidates count
  - Risk distribution chart
  - Upcoming joinings
  - At-risk candidates count
  - Quick stats cards

### 2. candidates.png
- **Page**: Candidates List (http://localhost:3000/candidates)
- **Shows**:
  - Searchable table with candidate list
  - Filter controls (Risk Level, Region)
  - Export CSV button
  - Pagination
  - Risk scores displayed

### 3. candidate-details.png
- **Page**: Candidate Detail (http://localhost:3000/candidates/[id])
- **Shows**:
  - Full candidate profile
  - Schedule Follow-ups button
  - Risk assessment section
  - Communications history
  - Documents section

### 4. follow-ups.png
- **Page**: Follow-ups Tracking (http://localhost:3000/follow-ups)
- **Shows**:
  - Pending follow-ups table
  - Days since joining badges (10, 15, 20)
  - Assigned to column
  - Complete button
  - Open Google Sheet button

### 5. risk-assessment.png
- **Page**: Scroll to Risk section on candidate detail
- **Shows**:
  - AI Risk Score (0-100)
  - Risk Level badge (LOW/MEDIUM/HIGH/CRITICAL)
  - Risk factors breakdown
  - Recommendations list

## How to Take Screenshots

### On macOS:
```bash
# Run the helper script
./take-screenshots.sh

# Or manually:
# 1. Press Cmd + Shift + 4
# 2. Press Spacebar (to capture window)
# 3. Click on browser window
```

### On Windows:
```bash
# Press Win + Shift + S
# Select area or window
```

### On Linux:
```bash
# Use gnome-screenshot or similar
gnome-screenshot -w
```

## File Naming

Save screenshots with exact names:
- `dashboard.png`
- `candidates.png`  
- `candidate-details.png`
- `follow-ups.png`
- `risk-assessment.png`

## Image Specifications

- **Format**: PNG
- **Max size**: < 500KB each
- **Resolution**: 1920x1080 or similar
- **Browser**: Clean UI, no personal data

## After Adding Screenshots

```bash
# Verify files
ls -lh docs/screenshots/*.png

# Add to git
git add docs/screenshots/
git commit -m "Add application screenshots"
git push
```

## Tips

✅ Use light mode for better visibility
✅ Show realistic sample data
✅ Capture full page/window
✅ Make text readable

❌ Don't include personal information
❌ Don't use blurry images
❌ Don't cut off UI elements
