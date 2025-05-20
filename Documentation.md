
# netieku.es - Ticket Exchange Platform Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Key Features](#key-features)
5. [Components](#components)
6. [Authentication](#authentication)
7. [Database Schema](#database-schema)
8. [User Guide](#user-guide)
9. [Developer Guide](#developer-guide)
10. [API Reference](#api-reference)

## Project Overview
netieku.es is a comprehensive ticket exchange platform for Latvia, designed to facilitate buying, selling, and exchanging tickets for various events. The platform supports multiple languages and provides a seamless user experience across different devices.

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Supabase (Authentication, Database, Storage)
- **State Management**: React Query (@tanstack/react-query)
- **Form Handling**: react-hook-form with zod validation
- **UI Components**: Shadcn UI with custom components
- **Icons**: Lucide React
- **Charts**: Recharts (for admin dashboards)

## Project Structure

```
src/
├── components/        # React components
│   ├── admin/         # Admin panel components
│   ├── auth/          # Authentication components
│   ├── events/        # Event-related components
│   ├── profile/       # User profile components
│   ├── shared/        # Shared/common components
│   └── ui/            # UI components (Shadcn)
├── contexts/          # React contexts
├── features/          # Feature modules
│   └── language/      # Internationalization
├── hooks/             # Custom React hooks
├── integrations/      # Third-party integrations
│   └── supabase/      # Supabase client and types
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Key Features

### Multi-Language Support
The platform supports multiple languages:
- Latvian (LV)
- English (EN)
- Russian (RU) [Partial]

Language preferences are managed through the `LanguageContext` and stored in local storage.

### User Authentication
- Email and password authentication via Supabase
- User profile management
- Authentication state management

### Ticket Management
- Adding tickets for sale
- Purchasing tickets
- Viewing purchased and added tickets
- Ticket categorization
- Ticket search and filtering

### Event Management
- Event listing by category
- Event details view
- Event search and filtering
- Available tickets for events

### User Profile
- Personal information management
- Avatar upload
- Ticket management
- Account settings

### Admin Panel
- User management
- Subscriber management
- Event management
- Category management
- Activity logging
- System statistics

## Components

### Core Components

#### Header
The main navigation component that includes:
- Logo
- Navigation links
- Language selector
- Authentication buttons/user menu

#### Footer
Contains:
- Site links
- Language selector
- Newsletter subscription form
- Social media links

#### Authentication Components
- `LoginDialog`: Login form modal
- `RegistrationForm`: User registration form
- User menu and profile components

### Ticket-Related Components

#### TicketsContent
Main component for displaying user tickets. Supports:
- Viewing ticket details
- Editing tickets
- Deleting tickets
- Preview of tickets

#### VisualTicket
A card component that displays ticket information with:
- Ticket title
- Event details (date, time, venue)
- Price information
- Action buttons (view, edit, delete)

#### AddTicketForm
Form for adding and editing tickets with fields for:
- Title
- Description
- Category
- Venue
- Event date and time
- Quantity
- Price per unit
- File upload

### Event Components

#### EventCard
Card component displaying event information:
- Event title
- Date and time
- Location
- Price range

#### EventHeader
Displays detailed event information:
- Title
- Date and time
- Location
- Description

#### EventTickets
Shows available tickets for a specific event.

### Profile Components

#### ProfileContent
Main component for the user profile page that includes:
- User information
- Tabs for different sections (Account, Tickets, Payments, Settings)

#### ProfileSidebar
Sidebar navigation for profile sections.

## Authentication

Authentication is implemented using Supabase Auth and includes:
- Email and password authentication
- User session management
- Protected routes
- User profile data

The main authentication hooks:
- `useAuth`: Provides authentication context
- `useSupabaseAuth`: Handles Supabase authentication operations

## Database Schema

### Main Tables

#### registered_users
Stores additional user information:
- `id`: UUID (primary key)
- `auth_user_id`: UUID (references Supabase auth.users)
- `email`: Text
- `first_name`: Text
- `last_name`: Text
- `phone`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `last_sign_in_at`: Timestamp
- `status`: Text ('active' or 'inactive')
- `avatar_url`: Text

#### tickets
Stores ticket information:
- `id`: UUID (primary key)
- `title`: Text
- `description`: Text
- `price`: Numeric
- `seller_id`: UUID (references registered_users)
- `buyer_id`: UUID (references registered_users)
- `user_id`: UUID
- `owner_id`: UUID
- `event_id`: UUID (optional, references events)
- `category_id`: UUID (references categories)
- `category_name`: Text
- `file_path`: Text
- `venue`: Text
- `event_date`: Date
- `event_time`: Text
- `quantity`: Integer
- `price_per_unit`: Numeric
- `status`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### categories
Stores ticket categories:
- `id`: UUID (primary key)
- `name`: Text
- `description`: Text
- `status`: Text
- `priority`: Integer
- `created_at`: Timestamp

#### newsletter_subscribers
Stores newsletter subscriber information:
- `id`: Bigint (primary key)
- `email`: Text
- `created_at`: Timestamp

## User Guide

### Registration and Login
1. Click on the "Login" button in the header
2. Choose "Register" if you don't have an account
3. Fill in your personal information and create an account
4. Verify your email (if required)
5. Log in with your email and password

### Adding a Ticket for Sale
1. Navigate to your profile page
2. Select the "Tickets" tab
3. Click "Add Ticket"
4. Fill in the ticket details:
   - Title and description
   - Category
   - Event venue
   - Date and time
   - Quantity and price
   - Upload ticket file (if available)
5. Click "Add Ticket" to complete

### Viewing Your Tickets
1. Go to your profile page
2. Select the "Tickets" tab
3. View your added and purchased tickets in separate tabs

### Editing or Deleting a Ticket
1. Find the ticket in your "Added Tickets" list
2. Click "Edit" to modify ticket details
3. Click "Delete" to remove the ticket from sale

### Finding Events and Tickets
1. Navigate to the "Events" page
2. Browse events by category or use the search function
3. Click on an event to view details and available tickets
4. Use filters to narrow down your search

## Developer Guide

### Setting Up the Development Environment
1. Clone the repository
2. Install dependencies with `npm install` or `bun install`
3. Configure environment variables for Supabase
4. Run the development server with `npm run dev` or `bun run dev`

### Adding a New Feature
1. Create components in the appropriate directory
2. Use existing hooks or create new ones as needed
3. Follow the established patterns for state management
4. Implement internationalization using the language context
5. Add necessary API calls using the Supabase client

### Working with Supabase
1. Authentication is handled through `useAuth` and `useSupabaseAuth`
2. Database operations use the Supabase client from `@/integrations/supabase/client`
3. File storage uses the Supabase storage API

### Adding a New Language
1. Create a new translation file in `src/features/language/translations/`
2. Add the language to the language list in `src/features/language/languages.ts`
3. Implement translations for all required strings

## API Reference

### Hooks

#### useAuth
Provides authentication context and functions:
- `isAuthenticated`: Boolean indicating if the user is authenticated
- `user`: Current user object
- `logout`: Function to log out the user
- `refreshSession`: Function to refresh the authentication session

#### useUserTickets
Manages user tickets with functions:
- `tickets`: Array of user tickets
- `isLoading`: Loading state
- `addTicket`: Function to add a new ticket
- `updateTicket`: Function to update a ticket
- `deleteTicket`: Function to delete a ticket
- `refreshTickets`: Function to refresh the ticket list

#### useLanguage
Manages language preferences:
- `currentLanguage`: Current language object
- `setLanguage`: Function to change the language
- `t`: Translation function

### Supabase Functions

#### Authentication
- `supabase.auth.signUp`: Register a new user
- `supabase.auth.signInWithPassword`: Log in a user
- `supabase.auth.signOut`: Log out a user
- `supabase.auth.getSession`: Get the current session

#### Database
- `supabase.from('table').select()`: Query data
- `supabase.from('table').insert()`: Insert data
- `supabase.from('table').update()`: Update data
- `supabase.from('table').delete()`: Delete data

#### Storage
- `supabase.storage.from('bucket').upload()`: Upload a file
- `supabase.storage.from('bucket').download()`: Download a file
- `supabase.storage.from('bucket').remove()`: Delete a file

This documentation provides a comprehensive overview of the netieku.es platform, its structure, features, and usage guidelines. For more specific information, please refer to the relevant code files and comments within the project.
