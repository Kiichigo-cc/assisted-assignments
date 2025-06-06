# <img src="logo.png" alt="Logo" width="50"/> [Assisted Assignments](https://assisted-assignments.vercel.app/)


## A web-based tool for creating and executing task-delineated, collaborative, AI-assisted assignments

# Technical Documentation: Download / Installation / Deployment Guide

Visit the [Project Presentation Page](https://kiichigo-cc.github.io/td3a-landing/)

Visit the [Project Website](https://assisted-assignments.vercel.app/)

View the [Deployment Instructions](Deployment.md)

View the [API Docs](https://app.swaggerhub.com/apis-docs/assistedassignments/TD3A/1.0.0)

View the [System Design](SystemDesign.png)

View the [Database Schema](schema.png)

# Features
- Create organized assignments and tasks
- Configure chatbots for assignments
- Track and analyze student activity
- Exportable asignment objects for Canvas

# Tech Stack
- React.js - Frontend
- Zustand - State Management
- TailwindCSS - Styling
- shadcn/ui - Design System
- Node.js - Backend
- Redis - Cache
- PostgreSQL - Database
- Sequelize - Database ORM
- Auth0 - User Auth

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
git clone https://github.com/Kiichigo-cc/assisted-assignments.git
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

# Maintenance/Troubleshooting guidelines
## Frontend
- This project uses shadcn/ui components to maintain a consistent design system. View the [shadcn docs](https://ui.shadcn.com/docs/components) to learn more about how to use the ui components.
- Noteable Folders & Files:
```
├── frontend/
│   ├── src/
│   │   ├── api/ - Contains backend request functions
│   │   ├── components/ - Reusable React components
│   │   │   ├── assignments/
│   │   │   ├── courses/
│   │   │   ├── student-reports/ - Components for the student metrics page
│   │   │   ├── user-permissions/ - Components for controlling access to UI elements
│   │   │   ├── ui/ - shadcn component library
│   │   │   ├── Chatbot.jsx - Chatbot interface component
│   │   │   ├── Chatlogs.jsx - Chtalogs interface component
│   │   ├── hooks/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
```

## Backend
- This project uses Sequelize for the Database ORM. View the [sequelize docs](https://sequelize.org/docs/v6/other-topics/migrations/) to make migrations to the database.
- Running `npm start` will automtatically run any database migrations that were created.
- On Windows, WSL is required for installing Redis.
- Noteable Folders & Files:
```
├── backend/
│   ├── config/ - Database environment configurations
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── migrations/
│   ├── queries/ - Scripts to query the database
│   └── server.js
```

# User Guides: Teachers and Students

---

# Instructor User Guide

## Logging In

Find the login button at the bottom left of the homepage.  
![Login Button](https://github.com/user-attachments/assets/e5da3e07-535b-44d9-a269-d2184f5ead1d)

Follow the on-screen instructions to log into your account or create a new one.

Note: You must be designated as an instructor to create assignments. Please contact an administrator to receive instructor privileges.

---

## Creating a Course

Click the orange "Create a Course" button at the top right of the dashboard.  
![Create Course](https://github.com/user-attachments/assets/1da87a13-a541-47b8-a6c1-04aec8832af4)

Enter the course name, term indicator, and course number. Then click "Save Changes."  
![Course Details](https://github.com/user-attachments/assets/aa667747-d3f8-4b0b-b7bf-25972ac873c7)

After creating the course, an access code will be generated. Share this code with students to allow them to join.

## Adding an Assignment

Adding an assignment requires multiple entries. Enter in the prompts in the photo attached which consist of:
Assignment Name, Purpose, Instructions, Submission Details, Grading Criteria, and AI Instructions.
![image](https://github.com/user-attachments/assets/4651b1ea-39b8-4447-af1f-24bb38bb832d)

## Adding tasks

At the bottom of each assignment creation object, you can click the Add Task button to add a new task.
The new task you have created can have its own name and instructions within them.
![image](https://github.com/user-attachments/assets/ce620224-687b-48e0-89a8-8ea9333e5eac)

## Viewing Student Metrics

Access the "Student Metrics" tab in the sidebar.

Click on the Course dropdown to select a course, next click on the Assignment dropdown to select an assignment.
![image](https://github.com/user-attachments/assets/d4016981-69c3-4ba5-badd-8cb5fa5f837b)

Clicking on the "Show Filter" button will allow you to filter students within the Student Performance Table.
![image](https://github.com/user-attachments/assets/76c5fb0b-5d8c-435e-aceb-f120b45e3e6c)

Clicking on a students name in the "Issues Report" table will allow you to view any issues that the student had with the assignment.
![image](https://github.com/user-attachments/assets/a81ddd9f-0b41-4958-9767-b5dd20bab135)




---

# Student User Guide

## Logging In

Find the login button at the bottom left of the homepage.  
![Login Button](https://github.com/user-attachments/assets/1a40c0fd-1c13-455e-813a-e8abb607f47e)

Follow the on-screen instructions to log into your account or create a new one.

---

## Joining a Course

Click the orange "Join Course" button at the top right of the dashboard.  
![Join Course](https://github.com/user-attachments/assets/5f163d24-d895-49ed-a521-5a547e59bb75)

Paste the access code provided by your instructor to join the course.  
![Enter Access Code](https://github.com/user-attachments/assets/b4ab72a1-a80c-4d41-bf40-067647016b63)

## Interacting with the AI Chatbot

After opening the AI chatbot via the navigation bar in the assignment page, students can speak to an AI assistance chatbot.
![image](https://github.com/user-attachments/assets/5bc03749-dd3d-4ca6-8c6d-a20b09f2202d)

Enter in prompts in the text box at the bottom and submit your questions to the AI Chatbot. An automatically generated response will be output to assist.

---

License

ISC License

Copyright (c) 2025 TD3A

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

---

# Support and Contact Information
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
  Email: [tstyle926@gmail.com](mailto:tstyle926@gmail.com)

