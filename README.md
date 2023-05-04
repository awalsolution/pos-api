## InSync CRM

InSnync CRM API's is developed with the following technologies:

2. Adonisjs (a Nodejs framework),
3. MySQL for (Database).

## Demo

Api's demo http://localhost:5000/api.

## How to Install

1. Launch your preferred terminal.

2. Clone this repository
   ```bash
   git clone https://github.com/abendsoft/insync-crm-api.git
   ```
3. After cloning, change into the application directory.
   ```
   cd insync-crm-api
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
