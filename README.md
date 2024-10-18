## PicSharingServer

PicSharingServer is a ExpressJs Server designed for sharing images. This guide will help you set up and run the server locally.

Prerequisites
- Node.js (version 14 or higher)
- NPM (version 6 or higher)

Installation

1. Clone the repository:

- git clone https://github.com/ndnghia24/PicSharingServer.git
- cd PicSharingServer

2. Install dependencies:

- npm install

3. Configuration

To run the application locally, you need to set up environment variables. Create a .env file in the root directory of the project and add the following variables:

DB_USERNAME=<your_database_username>
DB_PASSWORD=<your_database_password>
DB_DATABASE=<your_database_name>
DB_HOST=<your_database_host>
DB_DIALECT=postgres
DB_SSL_REQUIRE=true
DB_SSL_REJECT_UNAUTHORIZED=false
DATABASE_URL=postgresql://<DB_USERNAME>:<DB_PASSWORD>@<DB_HOST>/<DB_DATABASE>?sslmode=require

4. Running the Application

After configuring the environment variables, start the server using the following command:

- node src/index.js

The server will be accessible at http://localhost:3000 by default.