# Ionic-Chicago's photo sharing app backend

## Built with Node, Express, Azure App Service's node SDK, Azure SQL, and Azure Notification Hubs

### About

This app was written to support Ionic-Chicago's photo sharing app. It's a node application that runs on Azure's App Service. The app uses the [Azure Mobile Apps Node SDK](https://github.com/Azure/azure-mobile-apps-node) to connect to Azure SQL for data and Notification Hubs for cross platform messaging.

### Azure Setup

This app relies on a simple SQL database connected to the Azure Web App. The scripts I used to create the database tables are located in the /sql folder. Connect the db to your App Service from the settings blade of your application in the Azure portal.

Push notifications are dependent on [Azure's Notification Hubs](https://azure.microsoft.com/en-us/services/notification-hubs/). You can create the Notification Hub and connect it to your App Service from the settings blade of your application in the Azure portal.

With the database and Notification Hub set up, all you should have to do is [deploy your app to Azure](https://azure.microsoft.com/en-us/documentation/articles/app-service-continous-deployment/) and you should be up and running!

### Local setup

Setup the database and Notification Hubs as described above, and then get the connecton information from the Application Settings blade of your App Service in the Azure Portal.

Create a config file named azureMobile.js in the root of the project, and set it up with your data and notification credentials [using this template](https://github.com/Azure/azure-mobile-apps-node/blob/master/samples/todo/azureMobile.js).

### Installation

Clone the repo and run `npm install`

To start the server with debugging run `npm start` or for no debugging just run `node app.js`

