#!/bin/bash

# ShaktiAI Demo Setup Script
# This script starts the complete demo environment

echo "🕉️ Starting ShaktiAI Demo Environment"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the root directory (shaktiai-mvp)"
    exit 1
fi

echo "📱 Setting up Mobile App..."
cd mobile

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing mobile app dependencies..."
    npm install
fi

# Start mobile app in background
echo "🚀 Starting Expo development server..."
npm start &
MOBILE_PID=$!

# Wait a moment for mobile to start
sleep 5

echo ""
echo "🌐 Setting up Admin Dashboard..."
cd ../admin-dashboard

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing admin dashboard dependencies..."
    npm install
fi

# Start admin dashboard
echo "🚀 Starting admin dashboard..."
npm start &
DASHBOARD_PID=$!

# Wait for everything to start
sleep 3

echo ""
echo "✅ ShaktiAI Demo Environment Ready!"
echo "=================================="
echo ""
echo "📱 MOBILE APP:"
echo "   - Scan the QR code above with Expo Go"
echo "   - Choose your role: Pilgrim or Volunteer"
echo "   - Test the demo features!"
echo ""
echo "🌐 ADMIN DASHBOARD:"
echo "   - Open http://localhost:3000 in your browser"
echo "   - Monitor alerts in real-time"
echo ""
echo "🎯 DEMO FLOW:"
echo "   1. Open mobile app as Pilgrim"
echo "   2. Press 'Demo Gesture' or 'SOS' button"
echo "   3. Open second device as Volunteer"
echo "   4. Respond to alerts"
echo "   5. Watch admin dashboard for updates"
echo ""
echo "🛑 TO STOP:"
echo "   Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping ShaktiAI Demo Environment..."
    kill $MOBILE_PID 2>/dev/null
    kill $DASHBOARD_PID 2>/dev/null
    echo "✅ Demo stopped successfully!"
    exit 0
}

# Set trap for cleanup
trap cleanup SIGINT SIGTERM

# Keep script running
echo "Demo is running... Press Ctrl+C to stop."
wait
