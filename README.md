# Authentication Demo - Simple Login & Register Frontend

A clean, modern Next.js frontend application demonstrating simple authentication functionality with login and registration.

## 🚀 Features

### Authentication Features

- **Beautiful Landing Page** - Simple design with authentication options
- **User Login** - Secure login with JWT tokens
- **User Registration** - Account creation with form validation
- **User Dashboard** - Simple welcome screen showing user information
- **Token Management** - Automatic token handling and validation
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API communication
- **Lucide React** - Beautiful icon library
- **React Context** - State management for authentication

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   │   └── page.tsx
│   │   └── register/      # Registration page
│   │       └── page.tsx
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing/Home page
├── components/            # Reusable components
│   └── ui/               # UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── Modal.tsx
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utilities and configurations
│   ├── api.ts           # Authentication API service
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
    └── index.ts         # Authentication types
```

## 🎨 UI Components

### Core Components

- **Button** - Styled button with variants (primary, secondary, outline, ghost, danger)
- **Input** - Form input with label, error states, and validation
- **Card** - Container component with header, title, and content sections
- **Modal** - Overlay modal for forms and confirmations

## 🔐 Authentication Flow

1. **Landing Page** - Choose between login or registration
2. **Registration** - Create new account with name, email, phone, and password
3. **Login** - Sign in with email and password
4. **Authenticated State** - Welcome screen with user information and logout option

## 📱 Responsive Design

The application is fully responsive with:

- Mobile-first approach
- Breakpoint-optimized layouts
- Touch-friendly interactions
- Accessible navigation patterns

## 🎯 Key Pages

### Landing Page (`/`)

- Authentication selection interface
- Login and registration cards
- User welcome screen when authenticated
- Responsive design

### Login (`/auth/login`)

- Modern login form with validation
- Error handling and loading states
- Password visibility toggle
- Redirect to home after successful auth

### Registration (`/auth/register`)

- Account creation form
- Form validation with error messages
- Password requirements
- Automatic login after registration

## 🔧 Setup and Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create `.env.local`:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Ensure backend is running on http://localhost:3001

## 🚀 Deployment

1. **Build for Production**

   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## 📝 API Integration

The frontend integrates with the NestJS backend for:

- User registration (`POST /auth/register`)
- User login (`POST /auth/login`)
- Profile retrieval (`GET /auth/profile`)
- Token refresh (`POST /auth/refresh`)

## 🎨 Design System

### Colors

- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Gray scale for text and backgrounds

### Typography

- Geist Sans for UI text
- Responsive font sizes
- Proper heading hierarchy

### Spacing

- Consistent spacing scale
- Responsive padding and margins
- Grid-based layouts

## 🔍 Authentication Features

### Form Validation

- Real-time email validation
- Password strength requirements
- Phone number validation
- Error message display

### Security

- JWT token storage in localStorage
- Automatic token validation
- Secure API communication
- Token refresh handling

### User Experience

- Loading states during authentication
- Success and error feedback
- Smooth transitions between states
- Responsive form design

This simplified frontend provides a clean, professional authentication system that can be easily integrated with any backend API.
