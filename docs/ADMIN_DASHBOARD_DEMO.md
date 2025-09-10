# Admin Dashboard Demo Guide

This guide shows exactly how to run and demo the ShaktiAI Admin Dashboard for judges.

## Prerequisites
- Node.js 16+
- npm (comes with Node)

## Start the Admin Dashboard

1) Open a new terminal window
2) Run:

```bash
cd admin-dashboard
npm install
npm start
```

3) Open http://localhost:3000 in your browser

You should see:
- Stats cards: Total Alerts, Active, Resolved, Avg Response Time
- Active Alerts section: live-looking cards with status colors
- Recent Alerts: last 10 incidents with timestamps and details
- Volunteer Responses: list of responder messages

## Live Demo Flow (3 minutes)

- Keep the dashboard open in the browser
- On your phone, open the Expo Go app for the mobile app

Steps:
1) In the mobile app, choose “I'm a Pilgrim”, login with any name/phone
2) Press “SOS” or use “Demo Gesture”
3) Watch the Admin Dashboard:
   - Active Alerts increases
   - New alert card appears in Active Alerts
   - Recent Alerts updates
4) On another device/emulator, choose “I'm a Volunteer”, login, and tap “I'll Respond” on the incoming alert
5) Dashboard updates:
   - Active alert may become Acknowledged/Resolved in lists
   - Volunteer Responses section shows new response

Tips:
- Keep both Pilgrim and Volunteer dashboards active during the demo
- Use multiple triggers to show multiple cards animating in

## Troubleshooting
- If the dashboard doesn’t open, ensure port 3000 isn’t in use
- Hard refresh the browser (Ctrl+F5) if styles don’t load on first run
- If you closed the mobile dev server, re-run it from `mobile` with `npm start`

## Judge Talking Points
- Real-time visibility: Incident flow from detection to response
- Clear status states: Active → Acknowledged → Resolved
- Analytics: Immediate impact shown in the stats cards
- Clean, professional UI built to impress

