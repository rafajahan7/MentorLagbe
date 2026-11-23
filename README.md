
MentorLagbe is a web-based tuition and mentorship platform that connects students with tutors. Students can explore available tuition opportunities, apply for suitable tuitions, and manage their applications. Tutors can post tuition opportunities, manage applicants, and upgrade their accounts to Pro. Administrators can manage users, moderate tuition posts, and monitor transactions.

Live links:

Live Website: https://mentor-lagbe-flax.vercel.app
Backend API: https://mentorlagbe-server-kappa.vercel.app
Frontend Repository: https://github.com/rafajahan7/MentorLagbe
Backend Repository: https://github.com/rafajahan7/MentorLagbe-Server

Admin email & password:

• Admin Email: o@o.com

• Admin Password: 12345678

Key Features:

1.Authentication & User Management
- User registration and login using Better Auth.
- Role-based authentication for Students, Tutors, and Admins.
- Profile management.
- Protected routes and role-based dashboard access.

Student Features:
- Browse available tuition opportunities.
- Search and filter tuitions.
- Server-side pagination.
- View detailed tuition information.
- Apply for tuition opportunities.
- Prevent duplicate applications.
- View and manage submitted applications.
- Cancel pending applications.
- Track application statuses.

tutor features:
- Create and manage tuition posts.
- Upload tuition banner images using ImgBB.
- Free plan allows a maximum of 2 tuition posts.
- Pro plan supports unlimited tuition posts.
- Activate, close, edit, and delete tuition posts.
- View and manage student applicants.
- Accept or reject student applications.
- Upgrade to Pro through Stripe Checkout.

Admin features:
- Admin dashboard with platform statistics.
- Manage registered users.
- Review and moderate tuition posts.
- Approve or reject tuition submissions.
- View transaction records.
- Manage administrator profile.

Additional feautures:
- Responsive design for desktop, tablet, and mobile.
- Dark and light theme toggle.
- Stripe payment integration.
- Stripe webhook integration.
- Toast notifications.
- Custom loading spinner.
- Custom 404 and error pages.
- Demo data seeding for development and testing.

Technologies Used:

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Sonner
- Better Auth
- next-themes

Backend:
- Node.js
- Express.js
- MongoDB
- Better Auth
- JSON Web Token (JWT)


- MongoDB Atlas — Database hosting
- Vercel — Frontend and backend deployment
- Stripe — Payment processing
- ImgBB — Image hosting

Important NPM Packages

The project uses packages including:

Frontend:
- next
- react
- typescript
- tailwindcss
- better-auth
- stripe
- lucide-react
- sonner
- next-themes


Backend:
- express
- mongodb
- cors
- dotenv
- stripe
- jsonwebtoken
