# Regression Testing Checklist

Use this checklist after any rebuild or deployment to verify that core functionality remains intact.

## 1. Layout and Responsiveness

### Desktop (>720px width)
- [ ] Application is centered on screen
- [ ] Content is constrained to 720px width
- [ ] Content is constrained to 1600px height
- [ ] No horizontal scrolling occurs
- [ ] Background extends to full viewport width
- [ ] Bottom navigation is aligned with content (720px width)

### Mobile (<720px width)
- [ ] Application fills screen width
- [ ] No horizontal scrolling occurs
- [ ] Content is readable without zooming
- [ ] Bottom navigation spans full width
- [ ] All interactive elements are tappable

### Tablet (720px-1024px width)
- [ ] Layout behaves like desktop (centered 720px canvas)
- [ ] No layout breaks or overflow

## 2. Navigation

### Bottom Navigation Bar
- [ ] Navigation bar is visible at bottom of screen
- [ ] Navigation bar is fixed (stays visible when scrolling)
- [ ] All 5 navigation items are present:
  - [ ] Dashboard (Home icon)
  - [ ] Study (BookOpen icon)
  - [ ] Gym (Dumbbell icon)
  - [ ] Nutrition (Apple icon)
  - [ ] Goals (Target icon)
- [ ] Active page is highlighted in neon green
- [ ] Inactive pages are shown in muted gray
- [ ] Clicking each item navigates to correct page
- [ ] Active state updates immediately on click

### Page Switching
- [ ] Dashboard loads by default on app start
- [ ] Each page loads without errors
- [ ] Page content is preserved when switching away and back
- [ ] No blank screens or loading states that never resolve

## 3. Live Calendar Widget (Dashboard)

### Time Display
- [ ] Time is displayed in HH:MM:SS format
- [ ] Time uses 24-hour format (not 12-hour AM/PM)
- [ ] Time updates every second (visible ticking)
- [ ] Time display is in neon green with glow effect
- [ ] Time uses tabular numbers (digits aligned)

### Date Display
- [ ] Weekday name is displayed (e.g., "Saturday")
- [ ] Month name is displayed (e.g., "February")
- [ ] Day number is displayed (e.g., "8")
- [ ] Year is displayed (e.g., "2026")
- [ ] Date format: "Weekday" on one line, "Month Day, Year" on next line

### What Should NOT Be Present
- [ ] No calendar month grid (no days of the month in a grid)
- [ ] No date picker functionality
- [ ] No month/year navigation controls
- [ ] Widget only shows current time and date, nothing else

## 4. Dashboard Content

### Header Section
- [ ] "Selforge" title is visible
- [ ] Streak counter shows flame icon + number + "days"
- [ ] Streak counter is in neon yellow with glow
- [ ] Live calendar widget is displayed below header

### Summary Cards
- [ ] Study card shows topics completed/pending/total
- [ ] Gym card shows calories burned and muscles trained
- [ ] Nutrition card shows calories eaten, protein, sugar
- [ ] Calorie Burn card shows gym/school/total/net calories
- [ ] Daily Goals card shows goals completed out of 5

### Data Accuracy
- [ ] All numbers update when data changes on other pages
- [ ] Calculations are correct (spot check a few)
- [ ] Net calories show correct sign (+ for surplus, - for deficit)

## 5. Study Page

- [ ] Can add new study topics
- [ ] Topics show with correct status (pending/in-progress/done)
- [ ] Can change topic status
- [ ] Can delete topics
- [ ] Topic count updates on Dashboard

## 6. Gym Page

- [ ] Can add gym activities
- [ ] Exercise name, muscle group, duration, and calories are captured
- [ ] Calories burned updates on Dashboard
- [ ] Muscles trained list updates on Dashboard
- [ ] Can delete activities

## 7. Nutrition Page

- [ ] Can add food entries
- [ ] Food name, calories, protein, and sugar are captured
- [ ] Totals update on Dashboard
- [ ] Can delete food entries

## 8. Goals Page

- [ ] All 5 daily goals are listed
- [ ] Can toggle each goal on/off
- [ ] Can toggle "Went to School" switch
- [ ] School toggle affects calorie burn (1700 kcal)
- [ ] Goals completed count updates on Dashboard

## 9. Data Persistence

- [ ] Data persists after page refresh
- [ ] Data persists after closing and reopening browser
- [ ] Streak calculation is correct across days
- [ ] Today's data is separate from previous days

## 10. Visual Design

### Color Scheme
- [ ] Dark theme is active (black background)
- [ ] Neon green used for primary actions and positive metrics
- [ ] Neon yellow used for warnings and secondary highlights
- [ ] Muted gray used for inactive states and labels

### Typography
- [ ] Text is readable at all sizes
- [ ] Hierarchy is clear (titles > sections > body)
- [ ] No text overflow or truncation issues

### Spacing
- [ ] Consistent spacing between cards
- [ ] Adequate padding inside cards
- [ ] No cramped or overly spacious areas

## 11. Performance

- [ ] App loads in under 3 seconds
- [ ] Page transitions are instant
- [ ] Time widget updates smoothly (no lag)
- [ ] No console errors in browser DevTools
- [ ] No memory leaks (check after 5+ minutes of use)

## Pass/Fail Criteria

- **PASS**: All checkboxes can be checked ✓
- **FAIL**: Any checkbox cannot be checked (indicates regression)

## Notes

Record any issues found during testing:

---

**Tested by:** _______________  
**Date:** _______________  
**Build/Version:** _______________  
**Result:** PASS / FAIL  
**Issues found:** _______________
