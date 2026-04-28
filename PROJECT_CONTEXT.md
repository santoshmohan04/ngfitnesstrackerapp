# Project Context (UI/UX, Features, APIs)

Repository: santoshmohan04/ngfitnesstrackerapp  
Description: Angular Fitness Tracker App with Firebase  
Last updated: 2026-04-28

## 1) Purpose & Product Summary
This project is an Angular-based fitness tracking application backed by Firebase. It focuses on helping a user track workouts/activities, view history, and manage simple fitness goals with a clean, responsive UI.

**Primary users**
- Individual users who want to log workouts and track progress over time.

**Core value proposition**
- Quick activity logging + clear progress visibility with minimal friction.

**Primary user goals**
- Start/stop or log a workout/activity.
- Review workout history and trends.
- Manage profile/settings and (optionally) goals.

**Non-goals (typical for v1)**
- Complex coaching plans, nutrition tracking, or advanced social features unless explicitly added.

## 2) UX Principles
- **Fast to log**: primary actions (start workout, log activity) should be reachable within 1–2 taps/clicks.
- **Clarity**: prefer simple charts/summary cards over dense tables.
- **Consistency**: reuse Angular components and patterns; consistent form validation and messaging.
- **Feedback**: strong loading/empty/error states for Firebase reads/writes.
- **Accessible by default**: keyboard navigation, labels, contrast, and sensible focus states.

## 3) UI Context
### 3.1 UI Surfaces / Screens (Typical)
> Adjust to match the actual implementation as needed.

- **Auth**
  - Sign in / Sign up / Sign out
  - Password reset (optional)
- **Dashboard / Home**
  - Summary cards (e.g., weekly workouts, total time)
  - Quick action CTA (log workout)
- **Activity / Workout Logging**
  - Form to capture activity type, duration, intensity, notes
  - Validation + submit feedback
- **History**
  - List of past workouts
  - Filters (date range, type)
  - Details view
- **Progress**
  - Simple charts (e.g., workouts per week, total minutes)
- **Settings / Profile**
  - Profile data
  - Preferences (units, theme)

### 3.2 Design System (Suggested)
- **Component strategy**: Angular components with shared UI primitives.
- **Styling**: SCSS with variables/tokens (colors, spacing, typography).
- **Responsiveness**: mobile-first breakpoints; avoid horizontal scrolling.
- **Reusable components**
  - Buttons, inputs, select, date picker (if used)
  - Cards, lists, dialogs/modals
  - Toast/snackbar notifications

### 3.3 UI States
- **Loading**: skeletons or spinners for dashboard/history.
- **Empty**: show guidance + CTA (e.g., “No workouts yet—log your first”).
- **Errors**: actionable error messages with retry.
- **Success**: confirmation toast/snackbar after saves.

## 4) Features & Functionality (Functional Scope)
### 4.1 Authentication & Identity
- Sign up / sign in using Firebase Authentication.
- Maintain session and protect authenticated routes.

### 4.2 Workout / Activity Tracking
- Create new workout/activity records.
- Edit/delete (optional) with confirmation.
- Capture core attributes:
  - type (running/strength/etc.)
  - duration
  - date/time
  - intensity
  - notes (optional)

### 4.3 History & Search
- View chronological workout history.
- Filter by time range and activity type.
- View workout details.

### 4.4 Progress & Insights
- Aggregate metrics (weekly/monthly totals).
- Visualizations (simple charts).

### 4.5 Settings
- Units (metric/imperial), theme (optional).
- Profile info.

### 4.6 Quality Attributes
- **Performance**: minimize Firebase reads; paginate history when large.
- **Reliability**: handle offline/poor network gracefully (where feasible).
- **Security**: enforce access control with Firebase Security Rules.

## 5) API Context (Firebase)
This app primarily uses Firebase rather than a custom REST API. “API” here refers to the Firebase SDK calls and the logical data contracts in Firestore/Realtime Database.

### 5.1 Firebase Services (Typical)
- **Firebase Authentication**: user sign-in/sign-up, session state.
- **Cloud Firestore** (common choice): workouts, user profile, preferences.
- **Firebase Storage** (optional): profile images.
- **Cloud Functions** (optional): aggregation, server-side validation, scheduled jobs.

### 5.2 Data Model (Proposed)
> The exact structure should match the repo; adjust if different.

**Collection: users**
- `/users/{uid}`
  - `displayName`: string
  - `email`: string
  - `createdAt`: timestamp
  - `preferences`: object
    - `units`: "metric" | "imperial"
    - `theme`: "light" | "dark" | "system"

**Collection: workouts**
- `/users/{uid}/workouts/{workoutId}`
  - `type`: string
  - `durationMinutes`: number
  - `intensity`: "low" | "medium" | "high" (or numeric)
  - `performedAt`: timestamp
  - `notes`: string (optional)
  - `createdAt`: timestamp
  - `updatedAt`: timestamp

### 5.3 Client-Side “API” Operations (Examples)
- Auth
  - `createUserWithEmailAndPassword(email, password)`
  - `signInWithEmailAndPassword(email, password)`
  - `signOut()`
- Workouts
  - Create: add workout document
  - Read: query workouts by date range, order by `performedAt desc`
  - Update: patch fields (`updatedAt`)
  - Delete: remove workout document
- Aggregations (two patterns)
  - Client-side aggregation for small datasets.
  - Cloud Function/materialized summaries for larger datasets.

### 5.4 Security Rules (Expectations)
- Users can only read/write their own data under `/users/{uid}`.
- Validate required fields and types where possible.

## 6) UI ↔ Data Flow Mapping
- **Login screen** → Firebase Auth sign-in; on success route to dashboard.
- **Dashboard** → query recent workouts + summary metrics.
- **Log workout form** → create workout doc; show toast; refresh dashboard/history.
- **History** → paginated query; filters update query.
- **Progress** → compute aggregates from workouts or load summary docs.

## 7) Observability & Diagnostics
- Client-side error logging (console + optional remote logging).
- Track key UX funnels (optional): signup success, workout logged success.

## 8) Open Questions / Decisions
- Which Firebase database is used (Firestore vs Realtime Database)?
- Do we support offline persistence?
- Do we need Cloud Functions for aggregation/validation?
- Do we support multiple workout templates or routines?