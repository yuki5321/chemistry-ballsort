# Chemistry Ball Sort Game

## Overview
A React-based chemistry education game where players sort element balls into containers to form chemical compounds. The game uses drag-and-drop mechanics and includes multiple levels with increasing difficulty.

## Project Architecture
- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Express.js server (minimal setup for Replit compatibility)
- **Build**: Vite for development and production builds
- **Game Logic**: Custom game mechanics with element data and compound formulas
- **UI Components**: Modern, responsive design with drag-and-drop interactions

## Recent Changes
**July 24, 2025**
- Migrated project from Bolt to Replit environment
- Verified all game components and utilities are present
- Fixed project structure for Replit compatibility
- Ensured proper client/server separation
- Enhanced container capacity logic to create strategic challenge
- Modified Japanese UI text for test tube (試験管) terminology
- Implemented dynamic capacity calculation based on compound complexity
- Prevented element placement in completed test tubes
- Removed unnecessary elements not required for current level formulas
- Expanded chemical formula database to 22 compounds across 10 levels
- Added complex organic and inorganic compounds for advanced gameplay
- Implemented move limit system with visual countdown
- Added container-specific formula targets for strategic gameplay
- Optimized container quantities (formula count + 2 extra for sorting)
- Enforced strict formula validation (only assigned formulas can complete in each container)
- Added PostgreSQL database integration with user accounts and score tracking
- Implemented comprehensive API routes for authentication and game data
- Created database schema for users, game scores, and progress tracking

## Game Features
- Interactive drag-and-drop element balls
- Multiple chemistry compounds to form (H₂O, CO₂, NaCl, etc.)
- Progressive difficulty with level system
- Timer and scoring system
- Visual feedback for completed formulas
- Container capacity management

## Technical Stack
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Express.js backend
- Vite for build tooling

## User Preferences
- Clean, intuitive UI with educational value
- Responsive design for various screen sizes
- Visual feedback for game interactions