# Frontend Client - CE School Platform

Client application for the Amirkabir University of Technology Computer Engineering School platform, built with Next.js 16 (App Router), React 19, and Tailwind CSS.

---

## Key Features

- Next.js 16 and Turbopack: Fast compilation and server-side components (RSC).
- Responsive RTL Layout: Native Right-to-Left design optimized for Persian typography and all screen sizes.
- Typography: Full range of Yekan Bakh FaNum font weights with Persian numerical glyphs.
- Mobile Navigation: Slide-over drawer menu for responsive mobile browsing.
- SEO and Performance: Optimized asset delivery via Next.js image and local font loaders.

---

## Directory Structure

```
frontend/
├── public/                       # Static files, fonts, and images
│   ├── fonts/ttf/                # Yekan Bakh font family files
│   └── photos/                   # Course banners and instructor portraits
├── src/
│   ├── app/                      # Next.js App Router pages and layouts
│   │   ├── layout.js             # Root layout with typography initialization
│   │   ├── globals.css           # Global Tailwind and RTL stylesheets
│   │   ├── page.js               # Root redirect to /courses
│   │   ├── courses/              # Course listing and detail pages
│   │   │   ├── page.js           # Main course catalog
│   │   │   ├── [id]/             # Dynamic course detail router
│   │   │   └── 1..7/             # Dedicated syllabus and detail pages for each course
│   │   ├── syllabus/             # Course curriculum and syllabus table
│   │   ├── instructors/          # Faculty members and instructor directory
│   │   ├── about/                # About Amirkabir CE School
│   │   ├── contact/              # Contact info and department location
│   │   ├── terms/                # Academic regulations, discounts, and policies
│   │   ├── info/                 # Supplementary information and FAQ
│   │   ├── calendar/             # Academic calendar and term timelines
│   │   ├── register/             # Registration instructions and application form
│   │   └── micromaster/          # Micro-master bundled programs
│   ├── components/               # Reusable React components
│   │   ├── CourseCard.js         # Card component for course listings
│   │   ├── InstructorCard.js     # Faculty profile card
│   │   └── Layout/               # Structural layout components
│   │       ├── Header.js         # Navigation header and breadcrumbs
│   │       ├── Sidebar.js        # Responsive sidebar with active state tracking
│   │       └── MainLayout.js     # Unified page layout wrapper
│   └── data/
│       └── sampleData.js         # Static seed data for courses and instructors
├── Dockerfile                    # Multi-stage production container build (Standalone)
├── Dockerfile.dev                # Development container with volume mounts
├── next.config.mjs               # Next.js configuration
├── tailwind.config.js            # Tailwind CSS theme configuration
└── package.json                  # Dependencies and execution scripts
```

---

## Routing Map

| Route | Page Title | Description |
|---|---|---|
| `/` | Home | Automatic redirect to `/courses` |
| `/courses` | Courses | Complete list of courses for the active term |
| `/courses/[id]` | Course Details | Comprehensive course specifications, syllabus, and prerequisites |
| `/syllabus` | Syllabus | Structured curriculum table with assigned instructors |
| `/instructors` | Instructors | Directory of faculty members and academic credentials |
| `/about` | About | Mission, objectives, and university accreditation |
| `/contact` | Contact Us | Contact numbers, email addresses, and physical location |
| `/terms` | Rules and Policies | Academic regulations, refund policies, and evaluation criteria |
| `/info` | Information | Frequently asked questions (FAQ) |
| `/calendar` | Academic Calendar | Term schedules, enrollment deadlines, and exam dates |
| `/register` | Registration | Step-by-step enrollment guide and submission form |
| `/micromaster` | Micro-Masters | Multi-course certification packages |

---

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm, yarn, or pnpm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The application will be accessible at http://localhost:3000.

### Production Build

```bash
npm run build
npm start
```
