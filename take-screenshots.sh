#!/bin/bash

SCREENSHOT_DIR="docs/screenshots"
mkdir -p "$SCREENSHOT_DIR"

echo "📸 Intelligent Post-Onboarding - Screenshot Tool"
echo "================================================"
echo ""
echo "This script will help you take screenshots of the application."
echo "Make sure the app is running on http://localhost:3000"
echo ""
read -p "Press Enter to continue..."

# Function to take screenshot
take_screenshot() {
    local name=$1
    local url=$2
    local desc=$3
    
    echo ""
    echo "📍 $desc"
    echo "   URL: $url"
    echo ""
    echo "Steps:"
    echo "  1. Navigate to the URL above"
    echo "  2. Wait for page to load completely"
    echo "  3. Press Enter here"
    echo "  4. Click on the browser window to capture"
    echo ""
    read -p "Ready? Press Enter..."
    
    screencapture -w "$SCREENSHOT_DIR/$name.png" 2>/dev/null
    
    if [ -f "$SCREENSHOT_DIR/$name.png" ]; then
        local size=$(du -h "$SCREENSHOT_DIR/$name.png" | cut -f1)
        echo "✅ Saved: $name.png ($size)"
    else
        echo "❌ Failed to capture. Please try manually."
    fi
}

# Take all screenshots
take_screenshot "dashboard" "http://localhost:3000/" "Dashboard with metrics"
take_screenshot "candidates" "http://localhost:3000/candidates" "Candidates list with filters"
take_screenshot "candidate-details" "http://localhost:3000/candidates/dc1df679-0ac2-42cb-a70b-42e3629b889b" "Candidate detail page"
take_screenshot "follow-ups" "http://localhost:3000/follow-ups" "Follow-ups tracking page"

echo ""
echo "📸 For Risk Assessment:"
echo "   1. Stay on the candidate detail page"
echo "   2. Scroll to the Risk Assessment section"
echo "   3. Press Enter, then select the area with Cmd+Shift+4"
echo ""
read -p "Ready? Press Enter..."
screencapture -s "$SCREENSHOT_DIR/risk-assessment.png" 2>/dev/null

echo ""
echo "🎉 Screenshot capture complete!"
echo ""
echo "📁 Screenshots saved in: $SCREENSHOT_DIR"
echo ""
echo "Captured files:"
ls -lh "$SCREENSHOT_DIR"/*.png 2>/dev/null || echo "No screenshots found"
echo ""
echo "Next steps:"
echo "  git add docs/screenshots/"
echo "  git commit -m 'Add application screenshots'"
echo "  git push"
echo ""
