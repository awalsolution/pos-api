## Technology Stack

InSnync is developed with the following technologies:

1. The frontend is developed with the React Js, Redux Js, react-router-dom, Tailwindcss and Flowbite.
2. The backend is developed with the Adonisjs framework (a Nodejs framework),
3. MySQL is used for data persistence on the backend.

## Demo

You can explore the application Api's demo https://localhost:3333/api. Please note that InSync under active development and has not be released yet.

## Pre-requisites for Installation

1. Make sure that you have fully setup MySQL on your preferred environment. Please research how to install MySQL on your preferred environment (Windows, MacOS, or Linux).
2. Make sure that you have installed `git` on your preferred environment.
3. Make sure that you have installed `Nodejs` on your preferred environment using `nvm`.
4. Make sure that you have installed `yarn` package manager on your preferred environment

## How to Install

1. Launch your preferred terminal.

2. Clone this repository
   ```bash
   git clone https://github.com/abendsoft/insync-backend.git
   ```
3. After cloning, change into the application directory.
   ```
   cd insync-backend
   yarn install
   ```
4. Create a new `.env` file for the backend and generate a new `APP_KEY`. Copy the output and paste it into the `.env` file at the end of the line for `APP_KEY`.
   ```bash
   cp .env.example .env
   node ace generate:key #Generates new APP_KEY
   ```
5. Within the `.env` file, configure the MYSQL\* variables to suit your environment setup.

6. When the backend installation is completed, launch the backend server.

   ```bash
   yarn dev
   ```

7. You won't be able to log in because there are no users. So, it is time to seed the database.

8. To prepare (seed) the database with mock data:

   1. First, let's migrate the database.

      ```bash
      node ace migration:run
      ```

   2. Next, Let's seed important tables on the database. Run the index seeder command below to run all configured seeders for the application and fully setup it up in one command:

      ```bash
      node ace db:seed --files="database/seeders/MainSeeder/Index.ts"
      ```

      If you are on Windows and having errors, you can run:

      ```bash
      node ace db:seed --files="database\seeders\MainSeeder\Index.ts"
      ```

      Please note that this operation could take a couple of minutes.

9. After running the index seeder, all users generated will be logged to file. Check the file: `database/data/seeded_users.txt` and take note of the user credentials logged to the file.
10. Get an email and password of a user and log in.
11. Congratulations. You have successfully set up the InSync.
12. After you log in, check the role of the logged-in user. Click the avatar on the top-right corner of the user interface. The role is displayed after the user's name. E.g. `Admin`, `Editor`, or `Staff`.
13. If you need to switch to another user with a higher role:
    1. Open the side drawer by clicking the menu icon on the top-left corner of the user interface.
    2. Click `Settings`. On the Settings page, view Users. Take note of the email and role of the user you want to switch over to.
    3. Log out.
    4. Open the `database/data/seeded_users.txt` file to find the user's credentials.
    5. Log in with the credentials.
