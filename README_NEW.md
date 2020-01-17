# Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
   - [Install the Tools](<#install-the-following-tools-(in-order)>)
   - [Prerequisite Configuration](#prerequisite-configuration---1-time-setup)
     - [VS Code](#VS-Code)
     - [.NET Core User Secrets](#.NET-Core-User-Secrets)
   - [PowerShell Installer](#powershell-installer)
   - [Run the Template Application](#run-the-template)

## Introduction

Welcome to the EDAT Template Application (ETA). The ETA is a Single Page Application (SPA) architecture developed with Angular and .NET Core. The ETA is not a framework, but it incorporates many open-source frameworks and software libraries into a robust architecure pattern for developing web applications for the FDOT. To use the ETA for developing an application, you will need to have experience with the core web languages HTML, CSS, and JavaScript (TypeScript). You will also need an understanding of specific software frameworks like .NET Core and Angular. The ETA, being a SPA, should be thought of as 2 separate applications (a client Angular application and a server .NET Core application). The client application source code is contained within the "ClientApp" folder located in the .NET Core server application project folder.

The ETA was developed for the specific purpose of standardizing the EDAT team's approach to building web applications. It contains several samples that demonstrate common coding techniques typically needed in the business applications we develop. These samples make use of reusable components and services that you can use in your application. These components and services are focused on leveraging Azure platform services (e.g. authentication and BLOB storage), and FDOT infrastructure (e.g. SRS, EDMS, GIS). Most of the components and services are plug-and-play and will not require any code modification to use within your application.

The sample code has been isolated to a single folder in the client (Angular) application and a single API controller in the server (.NET Core) application. The sample code can (and should eventually be) removed from your application, but it is recommended to keep the samples intact until you no longer need them for reference. You can easily remove the sample menu item from the ETA by setting the "EdatHeader.ShowSamples" property to false in the appsettings.json file. Many aspects of the application's behavior is governed by appsettings.json. This will not remove the sample code, but it will remove the link to the samples in the application. With a few minor re-branding tasks like creating a logo and favicon.ico and adding some content to the landing page, and you're ready to start adding components and controllers for your application.

![alt text](Documentation/images/eta.png "EDAT Template Application")

## Getting Started

### Install the Following Tools (in order)

1. [Google Chrome](https://www.google.com/chrome/?brand=CHBD&gclid=Cj0KCQiA04XxBRD5ARIsAGFygj-zVcWMKlPkx_upUXkyUoH-DbhKUATruLe4oAP8_IS-uWWaPvo-v48aAuJEEALw_wcB&gclsrc=aw.ds)
2. [SQL Server Developer](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) and [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017) - latest versions
3. [.NET Core SDK](https://www.microsoft.com/net/download) - currently using .NET Core 3.1.100
4. [Azure Storage Emulator](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-emulator) and (optionally) [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/) - latest versions
5. [Node.js and NPM](https://nodejs.org/en/) - latest LTS version
6. [Angular CLI](https://cli.angular.io/) - currently using version 8.2.14
7. [VS Code](https://code.visualstudio.com/) - latest version

_Visual Studio 2019 is optional, but provides better server-side debugging. If you want to use Visual Studio, please make sure all updates are installed. VS Code is the recommended IDE for developing, but it can be slow when debugging .NET Core code. The ETA is configured for debugging in both VS Code (Node server) and Visual Studio (IIS development server), but they use the same port (44376). If you use Visual Studio for debugging, you will need to kill the IIS process before using the Node server again. Not doing so will result in an exception for the port already in use._

### Prerequisite Configuration - 1 Time Setup

#### VS Code

There are several VS Code extensions and settings customizations that will make developing applications based on the ETA much easier.

##### Fira Code Font

Installing the [Fira Code Font](https://github.com/tonsky/FiraCode) is highly recommended. Once you follow the directions below to configure your VS Code, it will attempt to use this font first. While not required, this font is helpful in that it was developed specifically for coding. The problem statement from their website is: _"Programmers use a lot of symbols, often encoded with several characters. For the human brain, sequences like ->, <= or := are single logical tokens, even if they take two or three characters on the screen. Your eye spends a non-zero amount of energy to scan, parse and join multiple characters into a single logical one. Ideally, all programming languages should be designed with full-fledged Unicode symbols for operators, but that’s not the case yet."_

##### Settings Sync

In VS Code, click "Extensions" on the left menu and search the marketplace for "Settings Sync" and click "Install."

![alt text](Documentation/images/settings-sync.png "Settings Sync extension installation")

In VS Code, click the "Manage" gear button and select "Settings."

![alt text](Documentation/images/vscode-settings.png "VS Code Settings")

Under "Extensions" select "Code Settings Sync" and input the value `573094cd2d2d12bf89d3d590ab59a674` in the "Sync: Gist" textbox.

![alt text](Documentation/images/settings-sync-configuration.png "Settings Sync Configuration")

In VS Code, click the "Manage" gear button and select "Command Palette."

![alt text](Documentation/images/vscode-settings-command-palette.png "VS Code Command Palette")

Type "sync" in the textbox and select `Sync: Download Settings`. This will begin the installation of several VS Code extensions and apply a specific configuration. Once the synchronization completes, please close and reopen VS Code. At this point, you can adjust VS Code to your own preferences for themes and settings. This configuration is just to get you started with a great set of necessary extensions and a good theme and configuration.

![alt text](Documentation/images/settings-sync-download-settings.png "Settings Sync - Download Settings")

#### .NET Core User Secrets

Contact Randy `randy.lee@dot.state.fl.us` to obtain the secrets.json file for the Azure Identity Providers and APIs. This is a JSON file that will be stored on the developers workstation and NEVER committed to Git (the ETA's gitignore file is already set to ignore it). This file must be distributed to each developer via FDOT's File Transfer Appliance (FTA) and not via email.

The secrets.json file contains keys for the following settings:

- `SendGridConfig:ClientSecret` - API key for SendGrid Email Service
- `Security:OpenIdConnectB2EOptions:ClientSecret` - Key for Azure AD Authentication Provider
- `Security:OpenIdConnectB2COptions:ClientSecret` - Key for Azure B2C Authentication Provider
- `FdotCoreApisConfig:ClientSecret` - API key for Arculus common services (Staff, OrgCodes, DotCodes)
- `EdmsApiConfig:Password` - EDMS password for EDMS service
- `EdmsApiConfig:ClientSecret` - API key for EDMS service

##### An explanation of User Secrets

Using the Azure platform requires access to services that provide things like identity management and authentication, SMTP (email), and FDOT enterprise data. These services require a secret (password) for each application. The EDAT Template has been assigned secrets for you to use during development. Once your application is ready to be deployed to Azure TEST, you will need to request secrets that are specific to your application.

The [.NET Core CLI](https://docs.microsoft.com/en-us/dotnet/core/tools/?tabs=netcore2x) will be used to read the secrets.json file and store the keys on your workstation. The .csproj file contains a GUID key that enables the .NET Core compiler to find the secrets associated to your project, and the .NET Core build process will add the secrets to your project's appsettings.json file for deployment.

##### Setting the User Secrets

You must first pull the ETA source code to your workstation before setting the user secrets the first time. This is because the user secrets are stored on your workstation with a GUID key specified in the .NET Core project file. Once you do this one time, you will not need to repeat this process unless the user secrets are updated or the GUID in the project file changes. So you will be able to develop many applications that use the same user secrets as long as each project file uses the same GUID.

Go ahead and use the PowerShell installer to create a sandbox application from the ETA source and the instructions for setting the user secrets will follow after that.

### PowerShell Installer

#### Download and Run the [PowerShell Script](https://fdot.visualstudio.com/EDAT_Agile/_git/CloneTemplate) to Create a New Application from the Template

A special _Thank you!_ to Jim Quinn. There are instructions for how to use the script in the repository **README**. If you have any issues, please contact Jim - `james.quinn@dot.state.fl.us`

Download the script from the Git repository.

![alt text](Documentation/images/powershell-installer-download.png "Allow the PowerShell script to execute")

View the file properties and unblock the PowerShell script.

![alt text](Documentation/images/powershell-installer-unblock.png "Allow the PowerShell script to execute")

The recommended approach for using the installer script is:

- Create a new empty folder on your workstation and place the script in it.
- Open PowerShell `Windows Start -> Type "PowerShell" -> Open`
- Change the directory to the new folder you just created - type `cd "C:\Users\KNABCXX\Desktop\New Folder"`and hit `Enter`
- Type `.\openEDAT_Template.ps1` and hit `Enter`
- Enter a new name for the project (typically a 3 character abbreviation) and hit `Enter`
- Wait for the script to complete. It will take several minutes for the script to clone the code from the Git repository, restore the NuGet packages, build the .NET Core project, install the npm packages, and build the Angular application.

Once the installer completes, you should see the results of the Angular build.

![alt text](Documentation/images/powershell-installer-complete.png "PowerShell script execution end")

##### Open the New Application in VS Code

- In VS Code select `File -> Open Folder`
- Choose the folder that contains the solution file (XXX.sln)
- Your file explorer view in VS Code should look like the image below with `.sln` file and the `.vscode` folder. If this is not what you see, you might have opened the project folder (one level too deep). If this is the case, select `File -> Close Folder` and try again. **You should always open the folder at the solution level in VS Code. Not doing so will cause problems when you attempt to run or debug the application.**

![alt text](Documentation/images/vscode-open-project.png "Project structure")

- Expand the project folder (contains the `.csproj` file).
- Open the `appsettings.json` file for editing, and locate the `AzureStorageConfig.ContainerName` setting.
- Update the value so that it is all lower case and select `File -> Save`. Azure BLOB storage requires container names to be lower case. When you're done, it should look something like the image below.

![alt text](Documentation/images/vscode-azure-blob-container-update.png "Azure BLOB container name update")

##### Set the User Secrets for the Application

- Save the secrets.json file that you were sent via FTA to the project folder. The .gitignore file is already configured to ignore this file, but please verify (it will be dimmed as compared to the other files). The secrets.json file doesn't need to be added to the project, but it makes the next steps easier. See the image below.

![alt text](Documentation/images/vscode-secrets-json.png "secrets.json added to project")

- Select `Terminal -> New Terminal` and make sure the terminal is set to `PowerShell`.
- Change the directory location to the project folder (`cd XXX`).
- Type the command `type ./secrets.json | dotnet user-secrets set` and hit `Enter`
- Verify the user secrets were successfully saved to the secret store with the command `dotnet user-secrets list`
- Once completed, your terminal window should look similar to the image below.

![alt text](Documentation/images/vscode-set-user-secrets.png "Using dotnet CLI to save user secrets")

This will copy the secrets.json file to a folder in your profile's `AppData`

![alt text](Documentation/app_data_user_secrets.png "User secrets stored in AppData")

The .NET Core compiler will look for these secrets and combine them with the project's appsettings.json. The compiler looks for user secrets based on the key in the project file.

![alt text](Documentation/images/vscode-user-secrets-project-file.png "User secrets key in project file")

### Run the Application

- Start the Azure Storage Emulator - `Windows Key`, type `Azure Storage Emulator` and hit `Enter`. You can exit the command window once it starts, and it will continue to run in the background until you exit the process or restart your workstation.
- If this is the first time you're running an ETA application, please clear your development HTTPS certificate and re-add and trust a new cert.
  - In the VS Code terminal, type `dotnet dev-certs https --clean` and hit `Enter`. You will need to confirm the certificate removal by clicking through a Window's dialog (or two).
  - In the VS Code terminal, type `dotnet dev-certs https --trust` and hit `Enter`. You will need to confirm the certificate install by clicking through a Window's dialog.
- In VS Code select the `Debug and Run` menu option on the left, select `ASP.NET Core & Browser` from the dropdown list, and hit `Start Debugging`
- The application should launch in the Google Chrome browser. It might take a few minutes to startup because of all of the code compilation needed.
- If you see the following exception in VS Code `Exception has occurred: CLR/Microsoft.Data.SqlClient.SqlException An exception of type 'Microsoft.Data.SqlClient.SqlException' occurred in Microsoft.EntityFrameworkCore.SqlServer.dll but was not handled in user code: 'A network-related or instance-specific error occurred while establishing a connection to SQL Server. The server was not found or was not accessible. Verify that the instance name is correct and that SQL Server is configured to allow remote connections.` it means the `ConnectionStrings.DbConnection` in `appsettings.json` is invalid.
  - The ETA uses a `.` (period) for the `Server` parameter value which indicates your local SQL Server instance. There can be scenarios where a fully-qualified server name (machine name) is required.
  - Change the `Server=` to your machine name (e.g. `DOTPCO357001`) and try again. If this still doesn't work, you might have multiple local SQL Server instances and will need to specify the instance name.

![alt text](Documentation/images/vscode-run-app.png "Run in VS Code")
