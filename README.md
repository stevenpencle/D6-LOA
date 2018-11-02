# Introduction

This is a template starter application with an Angular.io SPA front-end and .NET Core back-end.

## FAQ

- Is this a low-code or no-code solution? - No. You must know how to code and be familiar with languages, frameworks and libraries like HTML, CSS, TypeScript, C# ASP.NET Core, Angular, Bootstrap, and Entity Framework Core.
- Is this a framework? - No. This is an application architecture that is composed of other frameworks to demonstrate specific patterns and techniques for quickly building business applications at the FDOT.
- Why have this template available? - We want to have a standard approach so that when we build applications we are doing it the same way. When somebody leaves and the new person comes in, we pick it up and understand what’s going on.
- When will we start implementing this solution/approach? - Immediately

## Getting Started

### Install the Following Tools

1. [.NET Core SDK](https://www.microsoft.com/net/download)
2. [VS Code](https://code.visualstudio.com/)
3. [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator) and [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)
4. Node.js and NPM: [https://nodejs.org/en/](https://nodejs.org/en/)
5. SQL Server and [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017)
6. Download the repository code as a .zip file to your local drive and extract

### Prerequisite Configuration - 1 Time Setup

1. VS Code - Install the necessary extensions. The highlighted extensions are either required or highly recommended. The others are very useful. ![alt text](Documentation/vscode_extensions.png "VS Code extensions")
2. VS Code or Command Terminal - Verify that you have the latest .NET Core SDK ![alt text](Documentation/dotnet_config.png ".NET Core CLI Commands to verify SDK installation")
3. Contact Randy (randy.lee@dot.state.fl.us) to obtain the necessary client secrets for the Azure Identity Providers and APIs. This is a JSON file that will be stored on the developers workstation and NEVER committed to Git. ![alt text](Documentation/secrets_json.png "secrets.json file you will need")
4. Save the secrets.json file in the `EdatTemplate` project folder. The .gitignore file is already configured to ignore this file, but please verify. See the image below for the project structure. Notice that the `EdatTemplate` project is the .NET Core project and the `ClientApp` folder contains the Angular application. ![alt text](Documentation/vscode_project_structure.png "Project structure")
5. VS Code or Command Terminal - Use the `dotnet` CLI to set the user secrets. ![alt text](Documentation/set_user_secrets.png "Using dotnet CLI to save user secrets") This will copy the secrets.json file to a folder in your profile's `AppData.` ![alt text](Documentation/app_data_user_secrets.png "User secrets stored in AppData") The .NET Core compiler will look for these secrets and combine them with the project's appsettings.json. The compile looks for user secrets based in the key in the project file. ![alt text](Documentation/user_secrets_project_setting.png "User secrets key in project file")

### Run As-Is Template

1. Visual Studio - Build the .NET project (uses reinforcedtypings to generate d.ts model)
2. VS Code - Navigate to `EdatTemplate/Scripts` (the client app)
   - Execute `npm install`
   - Execute `“`npm run build`”`
3. Visual Studio - Create the local database
   - The local connection string is `Server=.;Database=EdatTemplate;Trusted_Connection=True;` so no modification is required
   - Set the `“`initializeDatabase`”` app setting to `true`
   - Run
   - Stop and reset the setting to false if you don't want a fresh database each time you run
   - Run

### Create a New Application from the Template

1. Rename the extract folder to `{your-project-name}`
2. Rename the `EdatTemplate` folder to `{your-project-name}`
3. Rename the `EdatTemplate.sln` file to `{your-project-name}.sln`
4. Open the `{your-project-name}` folder
5. Rename the `EdatTemplate.csproj` file to `{your-project-name}.csproj`
6. VS Code - open the `{your-project-name}` folder
7. VS Code - Edit -> Replace in Files `EdatTemplate` with `{your-project-name]` and select "Replace All" (Ctrl + ALt + Enter)
8. VS Code - Hit Play

## Features

- Azure AD-B2C identity providers
- Unified client and server model. Synchronization handled with ReinforcedTypings on "dotnet build"
- Themed, 508 compliant, and responsive design (Bootstrap 4) for FDOT standards
- Role impersonation to assist with testing multiple application roles
- Components for header, footer, and navigation
- Service for async http request and response handling
- Security service and route guard
- Base service for subsription based services (data stores)
- Data navigation service with helper components to handle sorting, filtering, and paging through large data sets
- SRS (Staff) service and staff picker component to handle FDOT staff selections (with example)
- Complete CRUD example for client and server architecture patterns
- [Azure BLOB storage](https://azure.microsoft.com/en-us/services/storage/blobs/) service and component for document management (with example)

## Where We're Heading

- Installer (CLI) to eliminate the manual steps in "Create a New Application from the Template"
- Full-stack Node.js architecture version (at some point, maybe)
