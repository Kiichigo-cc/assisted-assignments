# <img src="logo.png" alt="Logo" width="50"/> Assisted Assignments


## A web-based tool for creating and executing task-delineated, collaborative, AI-assisted assignments

# Download / Usage / Installation / Deployment Guide

Visit the [Project Presentation Page](https://kiichigo-cc.github.io/td3a-landing/)

Visit the [Project Website](https://assisted-assignments.vercel.app/)

View the [Deployment Instructions](Deployment.md)

# Running Locally
## 1. Resources to Setup/Install
- **Google Gemini Integration**: Get a [Google Gemin API Key](https://ai.google.dev/gemini-api/docs/api-key)
- **Caching**: Install [Redis](https://redis.io/)
- **User Authentication**: Create an [Auth0](https://auth0.com/) application for "Single Page Web Applications", and create an API.
<img src="https://github.com/user-attachments/assets/c95cc073-5ab2-4dde-88ec-0f436b660da8" alt="Logo" width="400" height="400"/>
<img src="https://github.com/user-attachments/assets/ca9839a6-d335-40a4-afef-fe15ccd16888" alt="Logo" width="400" height="400"/>

In the created Auth0 API, under the permissions tab create the following permissions (These will be used for controlling user access):
- create:courses
- create:assignments
- read:chatHistory

![image](https://github.com/user-attachments/assets/10e299ef-abb2-4d88-a820-2390ad361384)

In the Auth0 dashboard navigate to User Management > Users. This will show a list of users, for the users that you want to give instructor access: Click the ellipses > Assign permissions > Select the API > Select and add all permissions.



## 2. Clone the Repository
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


## 3. To run frontend
Create a .env file in the frontend directory with the following values:
```
VITE_DOMAIN= *Your Auth0 Domain*
VITE_CLIENTID= *Your Auth0 ClientId*
VITE_AUDIENCE= *Your Auth0 Audience*
VITE_API_BASE_URL=http://localhost:5001
```
Open a terminal and navigate to the directory of the project and enter the following commands
```
cd frontend
npm install
npm run dev
```

## 4. To run chatbot server
Create a .env file in the backend directory with the following values:
```
GOOGLE_API_KEY= *Your Google API key*
TOKEN_SIGNING_ALG= *Your Toke signing algorith*
ISSUER_BASE_URL= *Your Auth0 Issuer URL*
AUDIENCE= *Your Auth0 Audience*
ALLOWED_ORIGIN=http://localhost:5173
NODE_ENV=development
REDIS_URL=redis://127.0.0.1:6379
```
Open another terminal. Note: On Windows, WSL is required. Run the following command
```
redis-server
```
Open another terminal and navigate to the directory of the project and enter the following commands
```
cd backend
npm install
npm start
```
After running the frontend and backend you will be able to access the application at http://localhost:5173/



## Contact Information
Please send any questions you have about the project or implementation to any of our team members who worked on this project:

- **Collin Kimball**  
  Email: [kimbacol@oregonstate.edu](mailto:kimbacol@oregonstate.edu)

- **Oliver Zhou**  
  Email: [oliveryzhou@gmail.com](mailto:oliveryzhou@gmail.com)

- **Ethan Lu**  
  Email: [luet@oregonstate.edu](mailto:luet@oregonstate.edu)

- **Sai Meenakshisundaram**  
  Email: [meenkass@oregonstate.edu](mailto:meenkass@oregonstate.edu)

- **Trent Matsumura**  
  Email: [matsumut@oregonstate.edu](mailto:matsumut@oregonstate.edu)

