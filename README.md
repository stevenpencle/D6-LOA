# Introduction

This is a template starter application with an Angular.io SPA front-end and .NET Core back-end.

![alt text](Documentation/edat_template.png "EDAT Template")

## FAQ

- Is this a low-code or no-code solution? - No. You must know how to code and be familiar with languages, frameworks and libraries like HTML, CSS, TypeScript, C# ASP.NET Core, Angular, Bootstrap, and Entity Framework Core.
- Is this a framework? - No. This is an application architecture that is composed of other frameworks to demonstrate specific patterns and techniques for quickly building business applications at the FDOT.
- Why have this template available? - We want to have a standard approach so that when we build applications we are doing it the same way. When somebody leaves and the new person comes in, we pick it up and understand what’s going on.
- When will we start implementing this solution/approach? - Immediately

## Getting Started

### Install the Following Tools

1. [.NET Core SDK](https://www.microsoft.com/net/download) - currently using .NET Core 2.1
2. [VS Code](https://code.visualstudio.com/)
3. [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator) and [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)
4. Node.js and NPM: [https://nodejs.org/en/](https://nodejs.org/en/)
5. SQL Server and [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017)
6. Visual Studio 2017 (optional, but provides better server-side debugging) - make sure all updates are installed

### Prerequisite Configuration - 1 Time Setup

VS Code - Install the necessary extensions. The highlighted extensions are either required or highly recommended. The others are very useful.

![alt text](Documentation/vscode_extensions.png "VS Code extensions")

VS Code or Command Terminal - Verify that you have the latest .NET Core SDK

![alt text](Documentation/dotnet_config.png ".NET Core CLI Commands to verify SDK installation")

Contact Randy `randy.lee@dot.state.fl.us` to obtain the necessary client secrets for the Azure Identity Providers and APIs. This is a JSON file that will be stored on the developers workstation and NEVER committed to Git.

![alt text](Documentation/secrets_json.png "secrets.json file you will need")

An explaination of user secrets... Using the Azure platform requires access to services that provide things like identity management and authentication, SMTP (email), and FDOT enterprise data. These services require a secret (password) for each application. The EDAT Template has been assigned secrets for you to use during development. Once your application is ready to be deployed to Azure TEST, you will need to request secrets that are specific to your application.

### Download and Run the [PowerShell Script](https://fdot.visualstudio.com/EDAT/_git/CloneTemplate?path=%2FopenEDAT_Template.ps1&version=GBmaster&_a=contents) to Create a New Application from the Template

A special _Thank you!_ to Jim Quinn. If you have any issues, please contact Jim - `james.quinn@dot.state.fl.us`

You will need to unblock the PowerShell script before you execute it!

![alt text](Documentation/powershell_security_setting.png "Allow the PowerShell script to execute")

#### Warning

This will take several minutes to complete due to the NPM package installation.

![alt text](Documentation/powershell_script_run.png "PowerShell script execution end")

Save the secrets.json file in the `{your-project-name}` project folder. The .gitignore file is already configured to ignore this file, but please verify. See the image below for the project structure. Notice that the `{your-project-name}` project is the .NET Core project and the `ClientApp` folder contains the Angular application.

![alt text](Documentation/vscode_project_structure.png "Project structure")

VS Code or Command Terminal - Use the `dotnet` CLI to set the user secrets.

![alt text](Documentation/set_user_secrets.png "Using dotnet CLI to save user secrets")

This will copy the secrets.json file to a folder in your profile's `AppData`

![alt text](Documentation/app_data_user_secrets.png "User secrets stored in AppData")

The .NET Core compiler will look for these secrets and combine them with the project's appsettings.json. The compiler looks for user secrets based on the key in the project file.

![alt text](Documentation/user_secrets_project_setting.png "User secrets key in project file")

### Run Template

VS Code - In the Debug Menu (Ctrl + Shift + D), select `ASP.Net Core & Browser` and Hit Play! VS Code will automatically execute the `dotnet build` and `ng serve` commands and start Chrome. You can debug the .NET Core code by setting breakpoints in VS Code and debug the Angular application in Chrome developer tools.

![alt text](Documentation/vscode_debug.png "Run in VS Code")

#### Questions

_**What about Visual Studio? Can I still use it?**_

Yes. After the project is configured, you can choose to use Visual Studio as your IDE. Debugging in Visual Studio will use IIS Express as the development server, whereas debugging in VS Code will use the Angular CLI (Node) server.

_Caution: If you use both Visual Studio and VS Code, be aware that debugging in Visual Studio will result in IIS Express blocking port 44376 until you manually exit it in your system tray. If you leave IIS Express running and then try to debug in VS Code, you will get an error._

_**Where is the unit test project, and where are the client testing frameworks and configuration?**_

They have been removed in an effort to keep the code as simple and straight-forward as possible. Please feel free to add a .NET Core unit test project and add the Jasmine test framework back to Angular.

_**I am so sick of the template theme. How do I change it?**_

The EDAT Template supports [SASS styling](https://sass-lang.com/). the SASS files (.scss) are compiled to CSS as part of the build process. There are currently two built-in Bootstrap themes available, `office` (default) and `fdot`. You can change the theme in `{your-project-name}\ClientApp\src\styles\styles.scss`

![alt text](Documentation/sass_themes.png "SASS themes")

Commenting out the `_theme_office.scss` and uncommenting the `_theme_fdot.scss` changes the application theme to standard FDOT colors.

![alt text](Documentation/_theme_fdot.png "SASS themes")

Please feel free to create your own themes, and please be sure to share with the rest of us. Currently, all themes must meet one of the approved [FDOT color palettes](http://www.fdot.gov/it/docs/standards/colorpalette-10252013.htm)

[Font Awesome](https://fontawesome.com/icons?d=gallery) is included in the template as our glyph library.

_**What do I need to know about the application configuration (appsettings.json) besides the user secrets already mentioned?**_

Here's a cheat-sheet of the more important settings and what their purpose is.

![alt text](Documentation/appsettings_help.png "appsettings help")

_**What do I need to know about the application's security model and how does it work?**_

The `OpenIdConnectB2EOptions:Roles` setting (appsettings.json) is where you define the roles your application will use for network users. In the template application the `Admin` role will be assigned to any authenticated network user that belongs to any of the security groups listed in the array. You will need to use the Azure Portal to determine the Object IDs for the security groups you are using as your application roles.

![alt text](Documentation/security_group.png "Azure AD security groups")

In `B2EOpenIdConnectEvents.cs` the principal's role claim will be assigned the admin role (i.e. `Admin`) if the user is a member of the AS-EDAT security group (i.e. `d13a3eb1-9867-4796-8ae5-7fd75e724613`).

![alt text](Documentation/role_assignment_code.png "Role assignment code")

_IMPORTANT:_ You should use the standard `Authorize()` attribute to decorate your .NET API controllers/methods that are secured (access restricted). This is the primary security layer within the application.

![alt text](Documentation/authorize_attribute.png "Authorize attribute")

In the Angular `app-routing.module.ts` you should use the `RouteGuard` to restrict access to routes by user role. This is not a security aspect in that roles can be spoofed on the client browser by tech-savvy people, but it helps make the security intentions within the application clearer and helps prevents users from accessing routes that will result in an unauthorized (403) response code when an API call is made.

![alt text](Documentation/route_guard.png "RouteGuard")

It is also the developer's responsibility to render only the application menu options that are accessible by the current user's role. This is handled by subscribing to the `SecurityService` (security.service.ts) in the `ngOnInit` lifecycle event of your component. See the example below from the `nav-menu.component.(ts|html)`.

![alt text](Documentation/security_service_component.png "SecurityService use in a component")

![alt text](Documentation/ngif_role_eval_in_template.png "Evaluating the role in the template with *ngIf")

Role assignment for B2C users must be handled via a custom user/role management implementation in your application since these users are not in AD.

### Manual Steps to Create a New Application from the Template

1. Rename the extract folder to `{your-project-name}`
2. Rename the `EdatTemplate` folder to `{your-project-name}`
3. Rename the `EdatTemplate.sln` file to `{your-project-name}.sln`
4. Open the `{your-project-name}` folder
5. Rename the `EdatTemplate.csproj` file to `{your-project-name}.csproj`
6. VS Code - open the `{your-project-name}` folder
7. VS Code - Edit -> Replace in Files `EdatTemplate` with `{your-project-name]` and select "Replace All" (Ctrl + ALt + Enter)
8. VS Code (optional) - Set the `UserSecretsId` in the .NET Core project to a new value (usually a GUID) and reload new secrets for your new application. All applications deployed on Azure will require their own unique secrets, but developers can use the ones provided by Randy for local development.
9. VS Code - Hit Play! This will run these commands in order...
   - From `{your-project-name}` it runs `dotnet build` -> This restores NuGet packages, builds the .NET Core app, and generates the TypeScript model definition files (model.d.ts)
   - From `{your-project-name}\ClientApp` it runs `npm install` -> This creates the `node_modules` folder and installs the NPM packages defined in the `package.json` file.
   - From `{your-project-name}\ClientApp` it runs `ng serve` -> This builds the client app and starts the Angular-CLI server.
10. Images are served from the `{your-project-name}\ClientApp\dist\assets` folder. Running in VS Code will not create this folder since the Angular-CLI server serves files from in-memory. To get get the images for your application, run `npm run build` from inside the `{your-project-name}\ClientApp` folder at least once.

## Features

- Azure AD-B2C identity providers
- Unified client and server model. Synchronization handled with ReinforcedTypings on `dotnet build`
- Themed, 508 compliant, and responsive design (Bootstrap 4) for FDOT standards
- Role impersonation to assist with testing multiple application roles
- Components for header, footer, and navigation
- Service for async http request and response handling
- Security service and route guard
- Base service for subsription based (observable) services (data stores)
- Data navigation service with helper components to handle sorting, filtering, and paging through large data sets
- SRS (Staff) service and staff picker component to handle FDOT staff selections (with example)
- Complete CRUD example for client and server architecture patterns
- [Azure BLOB storage](https://azure.microsoft.com/en-us/services/storage/blobs/) service and component for document management (with example)
- [ngx-charts](https://swimlane.github.io/ngx-charts/#/ngx-charts/bar-vertical) library is included for charts and graphs

## TODO (difficulty 1 - 5)

- Add support for field-level validation message display (2)
- Standardize series and data-point models for all charts and add a chart wrapper component that automatically table-izes the chart data (4)
- Consider switching the current Staff API to a cached StaffJson API in-memory data set to reduce cold-start lag on the staff service (2)

## Where We're Heading

- Full-stack Node.js architecture version (at some point, maybe...)
