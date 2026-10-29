# ChurchConnect

ChurchConnect is a full-stack church website foundation for **Grace Community Church**, a fictional Addis Ababa congregation. The public site includes church information, events, sermons, announcements, ministries, membership interest, private prayer and pastoral-care requests, and a contact form. Administrators can manage content, follow up on member applications and private inbox submissions, and track event attendance.

## Stack

- React 18, Vite, React Router, and responsive CSS
- Node.js 20+, Express, and Mongoose
- MongoDB
- bcrypt password hashing and JWT sessions in HTTP-only cookies
- Zod request validation; Node's test runner and Vitest

## Requirements

- Node.js 20 or newer and npm
- MongoDB 6 or newer, running locally or hosted

## Get started

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`, `CLIENT_URL`, and a unique `JWT_SECRET` (at least 32 characters). Generate a secret with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`. Never commit `.env`.
2. Run `npm install` from the repository root.
3. Start MongoDB.
4. Create the first administrator from an interactive terminal: `npm run admin:create --workspace backend`. The password is entered without being echoed; choose a unique password of at least 12 characters. There is no public registration route.
5. Start the frontend and API with `npm run dev`.
6. Visit `http://localhost:5173`. The API runs on port `5000`; fictional sample events, sermons, announcements, and ministries are added idempotently after the first successful database connection. To seed them separately, run `npm run seed --workspace backend`.
7. The administrator sign-in is at `http://localhost:5173/admin/login`.

The app fails clearly on startup if the database is unavailable or required environment settings are missing. Sample records use `$setOnInsert`, so startup does not replace content that has already been edited or create duplicate sample records. The sample content is fictional; replace it before launch.

## Environment

### Backend (`backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | API port; defaults to `5000`. |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `CLIENT_URL` | Yes | Exact allowed browser origin, such as `http://localhost:5173`. |
| `JWT_SECRET` | Yes | Random secret with at least 32 characters. |
| `NODE_ENV` | No | `development`, `test`, or `production`; defaults to `development`. |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | No | API origin when deployed separately; leave blank for the Vite development proxy. |

For production, serve the frontend and API from the same site (or compatible same-site subdomains), set `NODE_ENV=production`, use HTTPS, and configure `CLIENT_URL` to the exact frontend origin. Session cookies are `HttpOnly`, `SameSite=Lax`, and `Secure` in production. Configure your hosting platform and reverse proxy consistently; never expose the JWT secret to the frontend.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start API and Vite development server together. |
| `npm run build` | Build the production frontend into `frontend/dist`. |
| `npm test` | Run backend validation tests and frontend API-client tests. |
| `npm run seed --workspace backend` | Idempotently ensure fictional sample events and sermons exist. |
| `npm run admin:create --workspace backend` | Securely create an administrator interactively. |

## API reference

Successful responses use `{ "data": ... }`; errors use `{ "error": "...", "details"?: ... }`. Administrative endpoints require the `churchconnect_session` HTTP-only cookie. Prayer requests and contact messages are never included in public responses.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | API and database health. |
| `GET` | `/api/public/events` | Public | List events; clients show upcoming dates before past dates. |
| `GET` | `/api/public/sermons?search=` | Public | List/search sermons by title or speaker. |
| `GET` | `/api/public/announcements` | Public | List published announcements within their publish and expiry window. |
| `GET` | `/api/public/ministries` | Public | List active ministry groups and their public meeting/contact details. |
| `POST` | `/api/public/events/:eventId/register` | Public, rate limited | Register 1–10 attendees (including the registrant) for a future event; one email can register once per event. |
| `POST` | `/api/public/prayer-requests` | Public, rate limited | Submit a private prayer request. |
| `POST` | `/api/public/membership-applications` | Public, rate limited | Ask the church welcome team to make contact; preferred language and optional area/household details are collected. |
| `POST` | `/api/public/contact-messages` | Public, rate limited | Submit a contact message. |
| `POST` | `/api/auth/login` | Public, rate limited | Sign in and set the session cookie. |
| `GET` | `/api/auth/me` | Admin | Return the current administrator. |
| `POST` | `/api/auth/logout` | Admin | Clear the session cookie. |
| `GET` | `/api/admin/overview` | Admin | Return counts for events, sermons, announcements, ministries, registrations, pending membership applications, and inbox items. |
| `GET` | `/api/admin/events`, `/sermons`, `/announcements`, or `/ministries` | Admin | List managed records. |
| `POST` | `/api/admin/events`, `/sermons`, `/announcements`, or `/ministries` | Admin | Create a validated record. |
| `PUT` | `/api/admin/events/:id`, `/sermons/:id`, `/announcements/:id`, or `/ministries/:id` | Admin | Update a validated record. |
| `DELETE` | `/api/admin/events/:id`, `/sermons/:id`, `/announcements/:id`, or `/ministries/:id` | Admin | Delete a record; deleting an event also deletes its registrations. |
| `GET` | `/api/admin/prayer-requests` | Admin | Read private prayer requests. |
| `GET` | `/api/admin/contact-messages` | Admin | Read contact messages. |
| `GET` | `/api/admin/members?status=` | Admin | Review membership interest records, optionally filtered by status (`pending`, `contacted`, `active`, or `declined`). |
| `PATCH` | `/api/admin/members/:id` | Admin | Update membership follow-up status. |
| `DELETE` | `/api/admin/members/:id` | Admin | Permanently remove a membership application and its contact details. |
| `PATCH` | `/api/admin/inbox/prayer-requests/:id/review` or `/api/admin/inbox/contact-messages/:id/review` | Admin | Mark a private inbox item reviewed or unreviewed using `{ "reviewed": true }`. |
| `DELETE` | `/api/admin/inbox/prayer-requests/:id` or `/api/admin/inbox/contact-messages/:id` | Admin | Permanently delete a private inbox item. |
| `GET` | `/api/admin/registrations?eventId=` | Admin | List event registrations, optionally filtered by event. Each record includes `attendeeCount`. |
| `PATCH` | `/api/admin/registrations/:id` | Admin | Track `registered`, `cancelled`, `attended`, or `no-show` status. |
| `DELETE` | `/api/admin/registrations/:id` | Admin | Permanently delete a registration and its contact details. |

Example event registration body:

```json
{
  "name": "Alex Taylor",
  "email": "alex@example.org",
  "phone": "",
  "attendeeCount": 2
}
```

## Security notes

- There is no public administrator registration. Create administrators through the CLI and keep credentials private.
- Passwords are hashed with bcrypt; password hashes are excluded from ordinary model queries and all API responses.
- JWTs are stored only in HTTP-only, same-site cookies; dashboard APIs enforce administrator authentication server-side.
- The API restricts CORS to `CLIENT_URL`, sets Helmet security headers, limits JSON request bodies, validates inputs, and rate-limits sign-in and public submissions.
- Prayer request contents are not logged, and message routes are only mounted behind authentication.
- Public announcements respect publish and expiry dates; inactive ministries stay hidden from public results.
- Event registration collects only name, email, optional phone, and guest count. Registration lists and inbox actions require an authenticated administrator.
- Event registration is rate limited and prevents duplicate registration by the same email for one event.
- Use HTTPS in production. Keep `.env` files, credentials, database URLs, and real prayer/contact data out of version control.

## Project layout

```text
backend/
  src/config/         Environment and database setup
  src/controllers/    Request handlers
  src/middleware/     Authentication
  src/models/         Mongoose models for content, inbox, and registrations
  src/routes/         Public, admin, and auth routes
  src/scripts/        Sample content and administrator setup
  test/               Backend validation tests
frontend/
  src/components/     Shared site, cards, and feedback UI
  src/layouts/        Public and protected admin layouts
  src/pages/          Public and administrator pages
  src/services/       API client and tests
```

Event dates are shown in Addis Ababa time (EAT). The public event page can switch between the Ethiopian (Amete Mihret) and Gregorian calendars when supported by the visitor's browser. The public forms offer English, Amharic, Afaan Oromo, and Tigrinya language preferences for follow-up.

Grace Community Church, its history, events, sermons, people, and Addis Ababa profile are fictional portfolio content. No donation or payment processing is included. Replace sample content and Unsplash imagery with church-approved details before launch.
