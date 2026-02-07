# Selforge

## Overview
Selforge is a mobile-optimized self-improvement app that helps users track their daily progress across study, gym, nutrition, and personal goals. The app launches directly to the dashboard without authentication and stores all data locally in the frontend.

## App Structure
The app consists of 5 main sections accessible via bottom navigation:
- Dashboard (Home)
- Study
- Gym
- Nutrition
- Goals

## Dashboard (Home)
Displays today's data summary:
- Daily streak counter at the top
- Study progress: topics completed vs pending for today
- Gym data: muscle groups trained today, total calories burned from exercise
- Nutrition summary: total calories eaten, protein consumed, sugar intake
- School activity: displays if user went to school (adds 1700 kcal burned)
- Total calorie burn: gym + school activity combined
- Net calories: food calories minus total burned calories (shows deficit/surplus)
- Daily goal completion status

Uses dark theme with neon green and yellow accents, rounded cards, and prominent number displays.

## Study Section
- Users can add subjects and chapters within subjects
- Each topic can be marked as "done today" or "to be done later"
- Daily study goal automatically completes when all today's topics are marked done
- Shows progress of completed vs pending topics

## Gym Section
Two workout types:
1. **Gym workout**: Select from comprehensive categorized muscle groups and their extensive sub-exercises:
   - **Chest**: Bench Press (barbell, dumbbell, incline, decline, machine), Cable Fly, Dips, Push-ups
   - **Shoulders**: Overhead Press (barbell, dumbbell, machine), Lateral Raise, Rear Delt Fly, Upright Row, Shrugs
   - **Legs**: Squat (barbell, dumbbell, machine), Leg Press, Leg Curl, Leg Extension, Lunges, Calf Raises
   - **Back**: Pull-up, Lat Pulldown, Seated Row, Bent-over Row (barbell, dumbbell), Deadlift
   - **Biceps**: Barbell Curl, Dumbbell Curl, Hammer Curl, Preacher Curl, Cable Curl
   - **Triceps**: Tricep Dip, Overhead Extension, Close-Grip Press, Cable Pushdown, Diamond Push-ups
   - **Core**: Plank, Crunches, Russian Twist, Mountain Climbers, Leg Raises
   - **Cardio**: Running, Cycling, Elliptical, Rowing, Swimming
   
   For each exercise, input sets, reps, and weight
2. **Cardio workout**: Select activity type and duration

Features dynamic exercise search and auto-complete functionality across all categories.

Uses DeepSeek AI API as the primary data source to fetch exercise details, muscle groups, and calculate calories burned:
- Primary: DeepSeek AI API for comprehensive exercise library and calorie calculations
- Based on fixed user profile: Age 17, Height 172cm, Weight 80kg
- Exercise duration and intensity

Displays total calories burned and muscle groups trained today.

## Nutrition Section
- Add multiple foods per day with name, quantity (g/ml), and optional brand
- Uses DeepSeek AI API as the primary data source with enhanced Indian brand coverage to fetch accurate nutrition data (calories, protein, sugar):
  - Primary: DeepSeek AI API for both Indian brands (Amul, Mother Dairy, Country Delight, Verka, and regional brands) and global food data
  - Falls back to estimation calculations if API is unavailable
- Display daily totals for calories eaten, protein, and sugar
- Calculate net calories (food calories - total burned calories)
- Reference daily targets: 1900 kcal, 120g protein, under 20g sugar

## School Activity Logic
Daily prompt: "Did you go to school today?"
- If yes: adds 1700 kcal to total daily calorie burn
- Included in dashboard's total calorie calculations

## Goals Section
Five daily goals tracked:
1. **Study**: Auto-completes when all today's study topics are done
2. **Gym**: Completes when any gym/cardio activity is logged
3. **Nutrition**: Manual checkbox
4. **Sleep**: Manual yes/no checkbox  
5. **Discipline/NMB habit**: Manual yes/no checkbox

Completing all goals maintains the daily streak.

## External API Integration
- **DeepSeek AI API**: Primary unified data source for both exercise and nutrition information
- All API calls made securely from frontend using REST fetch calls
- Fallback calculations maintained if API is unavailable for offline operation
- No backend proxy required

## Technical Requirements
- No authentication or backend user management
- All data stored locally in frontend state
- Mobile-first responsive design optimized for portrait orientation
- Dark theme (#000 black) with neon green (#00FF7F) and yellow (#FFFF33) accents
- External API integration with DeepSeek AI for enhanced reliability
- Clean, minimalist UI focusing on numbers and metrics over text
- App content in English

## Data Storage
All user data is stored locally in the frontend:
- Daily study topics and completion status
- Gym/cardio activities and calories burned
- Food entries and nutrition totals
- Goal completion status
- Daily streak counter
- School attendance status
