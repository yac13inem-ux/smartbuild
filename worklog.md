---
Task ID: 1
Agent: Z.ai Code
Task: Add gros oeuvre and construction tracking features to projects

Work Log:
- Updated Prisma schema to add new fields to Project model: grosOeuvre (Boolean), numberOfFloors (Int), concretePourFloor (Int), reinforcementInspectionDate (DateTime), apartmentsPerFloor (String - JSON format for per-floor data)
- Updated Arabic translation file (ar.json) with new keys for all new fields and floor tracking
- Updated English translation file (en.json) with new keys for all new fields and floor tracking
- Updated French translation file (fr.json) with new keys for all new fields and floor tracking
- Completely rewrote SimpleAddProjectDialog component to include:
  - Basic project information (name, location, description)
  - Gros Oeuvre checkbox
  - Number of Floors input
  - Concrete Pour Floor input
  - Reinforcement Inspection Date picker
  - Dynamic floor tracking form that generates inputs for each floor based on numberOfFloors
  - For each floor: number of apartments, CES progress (%), CET progress (%)
- Pushed schema changes to database using `bun run db:push`
- Generated Prisma Client successfully
- Verified dev server is running without errors

Stage Summary:
- Added comprehensive construction project tracking features
- Users can now track: gros oeuvre work, number of floors, concrete pour floor, reinforcement inspection dates, and per-floor details (apartments count, CES progress, CET progress)
- All new fields are properly translated in Arabic, English, and French
- Dynamic form adapts based on number of floors entered
- Database schema updated and synchronized successfully
- Application is ready for testing with the new project creation form
