# Assisted Assignments

## Prototype a web-based tool for creating and executing task-delineated, collaborative, AI-assisted assignments

## How to Clone the Repository
To clone this repository to your local machine, follow these steps:

Open a terminal or command prompt.

Navigate to the directory where you want to store the project.

Run the following command to clone the repository:
```
git clone https://github.com/CollinK23/assisted-assignments.git
```
After cloning, navigate into the project folder:
```
cd assisted-assignments
```


## To run frontend
Create a .env file in the frontend directory with the following values:
```
VITE_DOMAIN = *Your Auth0 Domain*
VITE_CLIENTID = *Your Auth0 ClientId*
VITE_AUDIENCE = *Your Auth0 Audience*
```
Open a terminal and navigate to the directory of the project and enter the following commands
```
cd frontend
npm install
npm run dev
```

## To run chatbot server
Create a .env file in the backend directory with the following values:
```
GOOGLE_API_KEY= *Your Google API key*
TOKEN_SIGNING_ALG = *Your Toke signing algorith*
ISSUER_BASE_URL = *Your Auth0 Issuer URL*
AUDIENCE = *Your Auth0 Audience*
```
Open another terminal and navigate to the directory of the project and enter the following commands
```
cd backend
npm install
node server.js
```
After running the frontend and backend you will be able to access the application at http://localhost:5173/
