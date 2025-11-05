# Tentwenty Timesheet Management Application

A modern, responsive timesheet management application built with Next.js 15, TypeScript, and TailwindCSS.

## Features

- 🔐 **Authentication**: Secure login using NextAuth.js with dummy credentials
- 📊 **Dashboard**: View all timesheet entries in a clean table format
- ➕ **Add/Edit Timesheets**: Create and update timesheet entries with validation
- 🗑️ **Delete Timesheets**: Remove entries with confirmation
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Form Validation**: Comprehensive validation using Zod and React Hook Form
- 🎨 **Modern UI**: Clean, professional interface built with TailwindCSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: NextAuth.js v5
- **Form Management**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library

## Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tentwenty
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables (Optional)**
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```
   Note: For demo purposes, the app will work without these variables, but it's recommended for production.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Login
- For demo purposes, **any email and password combination** will work
- Example: `user@example.com` / `password123`

### Dashboard
- View all timesheet entries in a table format
- Click "Add Timesheet" to create a new entry
- Click the edit icon to modify an existing entry
- Click the delete icon to remove an entry (with confirmation)

### Timesheet Entry
- **Week Number**: Must be between 1 and 52
- **Date**: Required field
- **Status**: Choose from Draft, Submitted, Approved, or Rejected
- **Hours**: Optional (0-168)
- **Description**: Optional text field

## Project Structure

```
tentwenty/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/     # NextAuth API routes
│   │   └── timesheets/            # Timesheet CRUD API routes
│   ├── dashboard/                 # Dashboard page
│   ├── login/                     # Login page
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page (redirects)
│   └── providers.tsx              # Session provider
├── components/
│   ├── TimesheetModal.tsx         # Add/Edit modal component
│   └── TimesheetTable.tsx         # Timesheet table component
├── lib/
│   ├── auth.ts                    # NextAuth configuration
│   ├── timesheetStore.ts          # In-memory data store
│   ├── types.ts                   # TypeScript type definitions
│   └── utils.ts                   # Utility functions
├── types/
│   └── next-auth.d.ts             # NextAuth type extensions
└── __tests__/                     # Test files
```

## API Routes

All API routes are internal (server-side) and require authentication:

- `GET /api/timesheets` - Fetch all timesheet entries
- `POST /api/timesheets` - Create a new timesheet entry
- `PUT /api/timesheets/[id]` - Update an existing entry
- `DELETE /api/timesheets/[id]` - Delete an entry

## Testing

Run tests with:

```bash
npm test
# or
yarn test
# or
pnpm test
```

## Assumptions & Notes

1. **Authentication**: Using dummy authentication for demo purposes. Any email/password combination will authenticate successfully.

2. **Data Storage**: Using in-memory storage for demo purposes. Data will reset on server restart. In production, this would be replaced with a database (PostgreSQL, MongoDB, etc.).

3. **Session Management**: Using NextAuth.js with JWT strategy for session management.

4. **Week Number Calculation**: Using ISO 8601 week numbering standard.

5. **Status Values**: Timesheet statuses are: `draft`, `submitted`, `approved`, `rejected`.

6. **Responsive Design**: The application is fully responsive and tested on mobile, tablet, and desktop viewports.

7. **Error Handling**: All forms include comprehensive error handling and validation feedback.

8. **Accessibility**: Basic accessibility features included (ARIA labels, semantic HTML).

## Time Spent

- **Project Setup**: 30 minutes
- **Authentication Implementation**: 45 minutes
- **Dashboard & Table**: 1 hour
- **Modal Component**: 45 minutes
- **API Routes**: 30 minutes
- **Form Validation**: 30 minutes
- **Testing**: 30 minutes
- **Styling & Responsive Design**: 1 hour
- **Documentation**: 20 minutes

**Total**: ~5.5 hours

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User roles and permissions
- [ ] Export functionality (CSV/PDF)
- [ ] Advanced filtering and sorting
- [ ] Date range selection
- [ ] Bulk operations
- [ ] Email notifications
- [ ] Dark mode support

## License

This project is created for the Tentwenty technical assessment.

## Contact

For questions or issues, please contact the development team.

# tentwenty
# tentwenty
