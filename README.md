# NDIS Portal Project Overview

The NDIS Participant Service Portal is a full-stack web application designed to streamline the interaction between NDIS (National Disability Insurance Scheme) participants and support coordinators. The platform allows participants to discover essential support services and manage their bookings, while providing coordinators with the tools to oversee service delivery, approve requests, and utilize AI-driven insights for care management.


--------------------------------Participant--------------------------------

Self-Registration & Secure Login: Create and manage a personal account.

Service Discovery: Browse and filter available NDIS support services by category.

Booking Management: Submit booking requests and track real-time status updates (Pending, Approved, Canceled).

AI Support: Interact with an AI Chatbot for service inquiries



-------------------------Support Coordinator---------------------------------------

Dashboard Overview: Monitor system-wide activity like active services and pending bookings.

Service Management: Add, edit status active or not active, or remove services from the portal.

Booking Oversight: Review, approve, or cancel participant booking requests.


--------------------------Key Features------------------------------------------------

AI-Enhanced Service Discovery: The Services part of the portal now features integrated AI.

End-to-End Testing: UI automation using Playwright to validate user flows from registration to booking.

ETL Integration: SQL Server Integration Services (SSIS) packages for managing data health and bulk updates.

Responsive Design: A modern UI built with Angular Material, optimized for desktop use by participants and coordinators.




# NDIS Portal Prerequisites

--------------------------Prerequisites------------------------------------------------

Before you begin, ensure you have the following software installed:

**Backend (.NET API via Visual Studio 2022):**
- Visual Studio 2022 with **ASP.NET and web development** workload - [Download](https://visualstudio.microsoft.com/downloads/)
  - This automatically installs .NET 8.0 SDK, IIS Express, and all required packages
- SQL Server LocalDB 2019 or later (included with Visual Studio)

**Frontend (Angular UI):**
- Node.js 18.x LTS or 20.x LTS - [Download](https://nodejs.org/)
- npm 10.x (comes with Node.js)
- Angular CLI 18.x - Install via `npm install -g @angular/cli@18`

**Database:**
- SQL Server Management Studio (SSMS) 19.x or later - [Download](https://aka.ms/ssmsfullsetup)

**Version Control:**
- Git 2.40 or later - [Download](https://git-scm.com/downloads)

**Optional (for development):**
- Visual Studio Code - [Download](https://code.visualstudio.com/)
- Postman or Swagger for API testing




# Step-by-Step Local Setup Instructions for the Database

--------------------------Database Setup------------------------------------------------

Follow these steps to set up the SQL Server database:

**Step 1: Open SQL Server Management Studio (SSMS)**
1. Launch SSMS from your Start menu
2. Connect to your LocalDB instance:
   - Server name: `(localdb)\MSSQLLocalDB`
   - Authentication: Windows Authentication
   - Click **Connect**

**Step 2: Copy and Paste the SQL Setup Script**

1. **Open the SQL file in Visual Studio:**
   - In Solution Explorer, find `setup_database.sql` (usually under `NDISPortal.API` folder)
   - Double-click to open it

2. **Select and copy all the SQL code:**
   - Press `Ctrl+A` to select all content
   - Press `Ctrl+C` to copy

3. **Open a new query in SSMS:**
   - In SSMS, click the **New Query** button (top left toolbar)
   - A blank query window will open

4. **Paste and execute:**
   - Press `Ctrl+V` to paste the SQL code
   - Press `F5` to execute the script
   - Wait for execution to complete (you'll see "Command(s) completed successfully")

**What the script creates:**
1. **Database:** `ndis_portal_db`
2. **Tables:**
   - `users` - stores login accounts
   - `service_categories` - service types
   - `services` - available NDIS services
   - `support_workers` - staff information
   - `bookings` - participant bookings
3. **Sample Data:**
   - Default service categories and test services
   - Coordinator test account: `coordinator@ndisportal.com` / `Test@1234.`
   - Participant test account: `participant1@ndisportal.com` / `Test@1234.`

**Step 3: Verify Database Creation**
1. In Object Explorer (left panel), expand `(localdb)\MSSQLLocalDB`
2. Expand **Databases**
3. You should see `ndis_portal_db` listed
4. Expand `ndis_portal_db` → **Tables** to see all created tables:
   - users
   - service_categories
   - services
   - bookings
   - support_workers

**What the script creates:**
- All required database tables with proper relationships
- Sample data for testing (categories, services, admin users)
- Default Coordinator and Participant accounts for testing

**Troubleshooting:**
- **Cannot connect to LocalDB?** Make sure SQL Server LocalDB is installed with Visual Studio
- **Script fails?** Check if database already exists (delete and recreate if needed)
- **Tables not showing?** Right-click on Tables → Refresh




# Step-by-Step Local Setup Instructions for the .NET API

--------------------------API Setup (Visual Studio 2022)--------------------------

Follow these steps to set up the .NET API using Visual Studio 2022:

**Step 1: Install Visual Studio 2022**
1. Download Visual Studio 2022 from: https://visualstudio.microsoft.com/downloads/
2. During installation, select the **"ASP.NET and web development"** workload
3. This automatically installs .NET 8.0 SDK and all required packages

**Step 2: Clone and Open the Project**
1. Open Visual Studio 2022
2. Click **"Clone a repository"**
3. Enter: `https://github.com/Dorowie/ndis-portal.git`
4. Click **Clone**
5. In Solution Explorer, open `NDISPortal.API` folder

**Step 3: Verify Connection String**
Open `appsettings.json` and confirm:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=ndis_portal_db;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

**Step 4: Restore NuGet Packages (via Visual Studio)**
1. In Visual Studio, go to **Tools** → **NuGet Package Manager** → **Package Manager Console**
2. Run: `Update-Package -reinstall`
3. Or right-click on Solution → **Restore NuGet Packages**

**Step 5: Build the Solution**
1. Press `Ctrl+Shift+B` or click **Build** → **Build Solution**
2. Check for any errors in the Error List window

**Step 6: Run the API**
1. Press `F5` or click the green **Start** button
2. Visual Studio will launch the API at `http://localhost:5131`
3. Swagger UI will open automatically for testing

**Alternative: Run without debugging:**
- Press `Ctrl+F5` to run without the debugger attached

**Troubleshooting:**
- **Packages not restoring?** Go to Tools → Options → NuGet Package Manager → Check package sources
- **Build errors?** Clean solution (Build → Clean Solution) then rebuild
- **Database connection failed?** Verify LocalDB is running in SQL Server Configuration Manager
- **Port conflict?** Change port in `Properties/launchSettings.json`




# Step-by-Step Local Setup Instructions for the Angular App

--------------------------Angular UI Setup------------------------------------------------

Follow these steps to set up the Angular frontend:

**Step 1: Open Terminal in VS Code or Command Prompt**
1. Navigate to the Angular project folder:
   ```bash
   cd ndis-portal-ui
   ```

**Step 2: Install Dependencies**
1. Run the following command to install all required packages:
   ```bash
   npm install
   ```
2. This downloads all Angular packages and dependencies listed in `package.json`

**Step 3: Verify Angular CLI Installation**
1. Check if Angular CLI is installed globally:
   ```bash
   ng version
   ```
2. If not installed, run:
   ```bash
   npm install -g @angular/cli@18
   ```

**Step 4: Configure API URL (if needed)**
1. Open `src/app/core/services/auth.service.ts`
2. Verify the API URL matches your backend:
   ```typescript
   private apiUrl = 'http://localhost:5131/api/auth';
   ```
3. Also check `bookings.ts` service for the same base URL

**Step 5: Start the Angular Development Server**
1. Run the development server:
   ```bash
   npx ng serve
   ```
2. Or if Angular CLI is installed globally:
   ```bash
   ng serve
   ```

**Step 6: Open the Application**
1. Open your browser and navigate to: `http://localhost:4200`
2. The login page should appear
3. Use the default test credentials (see below) to log in

**Alternative: Run on different port:**
```bash
ng serve --port 4201
```

**Troubleshooting:**
- **Port 4200 in use?** Use `ng serve --port 4201` or kill the existing process
- **Dependencies missing?** Delete `node_modules` folder and run `npm install` again
- **API not connecting?** Verify the backend API is running at `http://localhost:5131`


# How to run the Playwright tests

--------------------------Playwright tests------------------------------------------------

**Prerequisites**
**Install recomended extension:**
- Playwright Test for VS Code

**Test File Structure**
Playwright test scripts are located in the tests/ directory:
tests/
├── auth.spec.ts
├── services.spec.ts
├── bookings.spec.ts
├── coordinator.spec.ts
├── chatbot.spec.ts
└── helpers/
    └── auth.helper.ts

**Playwright Installation**

To initialize Playwright in the project, run the following command in the terminal:
```bash
   npm init playwright@latest
   ```

**During setup, configure the following:**

- Select TypeScript as the language
- Set the test directory to tests
- Choose whether to include GitHub Actions (optional)
- Install required browsers when prompted

- **This process will generate the playwright.config.ts configuration file.**

**Executing Tests**

1. To execute all tests in headless mode (default):
   ```bash
   npx playwright test
   ```

2. To execute tests in headed mode (browser is visible during execution):
   ```bash
   npx playwright test --headed
   ```

3. To execute tests using the interactive user interface:
   ```bash
   npx playwright test --ui
   ```

4. To execute tests in debug mode:
   ```bash
   npx playwright test --debug
   ```

# Default Login Credentials for Testing

--------------------------Test Accounts------------------------------------------------

Use these pre-configured accounts to test the application:

**Coordinator Account:**
- **Email:** `coordinator@ndisportal.com`
- **Password:** `Test@1234.`
- **Role:** Coordinator
- **Access:** Full access to dashboard, service management, and booking oversight

**Participant Account:**
- **Email:** `participant1@ndisportal.com`
- **Password:** `Test@1234.`
- **Role:** Participant
- **Access:** Service discovery, booking management, and personal profile

**Additional Test Accounts:**
The database seed script creates these accounts automatically when you run `setup_database.sql`.

**Creating New Accounts:**
You can also register new accounts through the application:
1. Go to the login page (`http://localhost:4200`)
2. Click **"Don't have an account? Register"**
3. Fill in the registration form
4. Select role: Coordinator or Participant

**Troubleshooting Login Issues:**
- **"Invalid credentials"?** Make sure the database is set up and API is running
- **"Server error"?** Check if the API is accessible at `http://localhost:5131`
- **Forgot password?** Currently no password reset feature - create a new account for testing




# Known Issues or Limitations

--------------------------Known Issues------------------------------------------------

**Current Limitations:**

1. **Password Reset Feature**
   - Status: Not implemented
   - Workaround: Create a new test account or contact admin

2. **Email Notifications**
   - Status: Not implemented
   - Workaround: Check booking status directly in the application

3. **Mobile Responsiveness**
   - Status: Limited - optimized for desktop use
   - Recommendation: Use desktop browser for best experience

4. **AI Chatbot**
   - Status: UI placeholder only - backend integration pending
   - Note: Chat interface is available but AI responses are simulated

5. **Additional SQL Scripts**
   - Note: For database updates beyond the initial setup, manual SQL scripts may be required

6. **File Uploads**
   - Status: Not supported
   - Note: No profile picture or document upload functionality

**Common Issues:**

- **CORS errors in browser?**
  - Solution: Ensure API CORS configuration includes `http://localhost:4200`

- **Database connection timeout?**
  - Solution: Verify SQL Server LocalDB is running, check connection string

- **Angular build memory errors?**
  - Solution: Increase Node memory limit: `set NODE_OPTIONS=--max-old-space-size=4096`

**Report New Issues:**
