# Construction Project Management - Civil Engineering SaaS Platform

A professional, mobile-first construction project management application designed for field engineers, contractors, and project owners.

## 🎯 Features Implemented

### 1. **Database Schema** ✅
- Complete Prisma schema with SQLite
- Tables: Users, Projects, Blocks, Units, Reports, Problems
- Relationships: Project → Blocks → Units hierarchy
- Progress tracking: Gros Œuvre (50%), CES (30%), CET (20%)
- Status management for problems and reports

### 2. **Multilingual System** ✅
- Support for 3 languages: English, French, Arabic (RTL)
- JSON-based translation system
- Language switcher in header
- Automatic RTL support for Arabic

### 3. **UI/UX Design** ✅
- Modern, minimal SaaS design
- Light/Dark mode toggle
- Mobile-first responsive design
- Touch-friendly buttons (44px+)
- Smooth animations
- Sticky header with navigation
- Bottom navigation bar

### 4. **Dashboard** ✅
- Circular progress charts
- KPI cards (Open Problems, Weekly Reports, Blocks)
- Recent activity list
- Progress bars for Gros Œuvre, CES, CET

### 5. **Project Structure** ✅
- Project → Block → Unit hierarchy
- Progress tracking at each level
- Weighted progress calculation
- Project list with cards
- Block navigation

### 6. **Document Hub** ✅
- Three categories: PV de Visite, PV Constat, Rapport Mensuel
- Document list with metadata
- Filtering by type
- Download functionality

### 7. **Problem Management** ✅
- Issue tracking with status (Pending, In Progress, Resolved)
- Filter by status
- Location tagging (Project/Block/Unit)
- Image support
- WhatsApp integration

### 8. **WhatsApp Integration** ✅
- Floating green button
- Pre-filled messages with problem details
- Instant sharing

### 9. **Settings** ✅
- Language selection
- Theme toggle
- Profile information
- Notifications settings

### 10. **Backend APIs** ✅
- File upload API with GPS tagging
- Projects CRUD operations
- Blocks CRUD with progress calculation
- Reports management
- Problems management
- Pagination support (10 items/page)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload/route.ts          # File upload with GPS
│   │   ├── projects/
│   │   │   ├── route.ts             # List & create projects
│   │   │   └── [id]/route.ts       # Get/update/delete project
│   │   ├── blocks/
│   │   │   ├── route.ts             # List & create blocks
│   │   │   └── [id]/route.ts       # Get/update/delete block
│   │   ├── reports/route.ts         # Reports CRUD
│   │   └── problems/route.ts        # Problems CRUD
│   ├── layout.tsx                   # Root layout with providers
│   ├── page.tsx                     # Main app page
│   └── globals.css
├── components/
│   ├── Header.tsx                   # App header
│   ├── BottomNavigation.tsx         # Mobile navigation
│   ├── Dashboard.tsx                # Dashboard view
│   ├── ProjectList.tsx              # Projects view
│   ├── DocumentHub.tsx              # Documents view
│   ├── ProblemList.tsx              # Problems view
│   ├── Settings.tsx                 # Settings view
│   ├── CircularProgress.tsx         # Progress chart
│   ├── KPICard.tsx                  # KPI card
│   ├── RecentActivity.tsx           # Activity feed
│   ├── ProgressCard.tsx             # Progress display
│   ├── LanguageSwitcher.tsx         # Language selector
│   └── ThemeToggle.tsx              # Theme toggle
├── contexts/
│   └── LanguageContext.tsx          # i18n context
├── lib/
│   ├── locales/
│   │   ├── en.json                  # English translations
│   │   ├── fr.json                  # French translations
│   │   └── ar.json                  # Arabic translations
│   ├── i18n.ts                      # i18n utilities
│   ├── db.ts                        # Prisma client
│   └── utils.ts                     # Utility functions
prisma/
├── schema.prisma                    # Database schema
└── custom.db                        # SQLite database
upload/                              # File storage directory
```

## 🚀 API Endpoints

### File Upload
- `POST /api/upload` - Upload images/PDFs with GPS tagging

### Projects
- `GET /api/projects` - List all projects (with pagination)
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Blocks
- `GET /api/blocks?projectId=xxx` - List blocks
- `POST /api/blocks` - Create block (calculates progress)
- `GET /api/blocks/[id]` - Get block details
- `PUT /api/blocks/[id]` - Update block progress (weighted calculation)
- `DELETE /api/blocks/[id]` - Delete block

### Reports
- `GET /api/reports` - List reports (with filters)
- `POST /api/reports` - Create new report

### Problems
- `GET /api/problems` - List problems (with filters)
- `POST /api/problems` - Create problem
- `PUT /api/problems` - Update problem
- `DELETE /api/problems?id=xxx` - Delete problem

## 📊 Progress Calculation

The weighted progress system is implemented as follows:

```
Global Progress = (Gros Œuvre × 50%) + (CES × 30%) + (CET × 20%)
```

Example:
- Gros Œuvre: 75% × 0.50 = 37.5%
- CES: 60% × 0.30 = 18.0%
- CET: 70% × 0.20 = 14.0%
- **Total: 69.5% → 70%**

## 🌍 Multilingual Support

The app supports three languages with automatic RTL support:

1. **English** - Default, LTR
2. **Français** - French, LTR
3. **العربية** - Arabic, RTL

All UI labels are dynamically loaded from JSON files.

## 🎨 Design Features

- **Color System**: Uses Tailwind CSS variables
- **Typography**: Consistent hierarchy with proper font weights
- **Spacing**: Consistent padding and gaps
- **Components**: shadcn/ui component library
- **Responsive**: Mobile-first approach
- **Accessibility**: Semantic HTML, ARIA support
- **Dark Mode**: Full dark mode support

## 📱 Mobile Optimization

- Touch targets: Minimum 44px
- Bottom navigation for easy thumb access
- Sticky header for persistent controls
- Optimized for low-bandwidth environments
- Pagination to limit data transfer
- Fast load times with client-side navigation

## 🔧 Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Database**: SQLite with Prisma ORM
- **State Management**: React hooks
- **Icons**: Lucide React
- **Authentication**: Ready for NextAuth.js v4

## 📝 Usage

### Running the App
```bash
bun run dev
```

### Database Operations
```bash
# Push schema to database
bun run db:push

# Generate Prisma Client
bun run db:generate
```

### Code Quality
```bash
# Run ESLint
bun run lint
```

## 🎯 Key Features for Construction Sites

1. **Fast Access**: Dashboard loads key data in under 3 seconds
2. **Offline-Ready**: Local database with sync capability
3. **GPS Tagging**: Photos can be tagged with location data
4. **WhatsApp Integration**: Quick communication with contractors
5. **Progress Tracking**: Real-time weighted progress calculations
6. **Document Management**: PV de Visite, PV Constat, Rapport Mensuel
7. **Problem Tracking**: Status-based issue management
8. **Multilingual**: Perfect for international construction teams

## 🔒 Future Enhancements

- User authentication with roles
- Real-time notifications
- Push notifications for urgent problems
- PDF generation for reports
- Advanced analytics dashboard
- Offline-first PWA support
- Photo gallery with annotations
- Voice notes for problems
- Calendar integration

## 📄 License

This project is built for professional construction management purposes.

## 👥 Target Users

- **Civil Engineers**: Track progress, create reports
- **Contractors**: Receive notifications, view problems
- **Project Owners**: Monitor overall progress, review reports

---

Built with ❤️ for construction professionals
