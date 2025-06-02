# Deployment
This setup works for the current project, but more scalable deployment methods may be necessary if user demand grows. This guide assumes that you have already set up the repo and Auth0 locally.
## 1. Frontend Deployment
The current Frontend is deployed on [Vercel](https://vercel.com/). To deploy the Frontend on Vercel, create an account and link a GitHub Account. Start a new project, and select this GitHub Repository. Under Framework Preset select Vite, in Root Directory select frontend. In the Environment Variables Section, copy the variables from the frontend .env file. 

<img src="https://github.com/user-attachments/assets/a0048e98-55dd-427b-83b7-116a1a3089ad" alt="Logo" height="400"/>

Notes: 
- You may want to set up a different Auth0 environment for production and development.
- `VITE_API_BASE_URL will` be updated after setting up Backend Deployment.
- Vercel will automatically redeploy the frontend when changes are pushed to the main branch.
- You can now access the website using the URL shown in your Vercel Dashboard (highlighted in the screenshot below).
![image](https://github.com/user-attachments/assets/4911b60d-ed9b-4068-8d66-5b523abe04a9)

## 2. Redis & Database Deployment
Currently, the project uses a Neon PostgreSQL database in production.

**Database Deployment**: In the Vercel project Dashboard, navigate to Storage > Create Database > Neon > Continue > Choose a Region > Select Installation plan > Continue > Create

**Redis Cache Deployment**: In the Vercel project Dashboard, navigate to Storage > Create Database > Redis > Continue > Choose a Region > Select a plan > Continue > Create

Notes:
- The values for `REDIS_URL` and `DATABASE_URL` will be needed for the backend deployment.

## 3. Backend Deployment
The current Backend is deployed on [Render](https://render.com/). To deploy the Backend on Vercel, add a new Web Service, connect GitHib as a Git provider, and select this GitHub Repository. In the new web service: create a name, for language select `Node`, for branch enter `main`, select a region, for the root diretory enter `backend`, for the build command enter `npm install`, and  for the run command enter `npm start`. Select an instace type. In environment variables, copy the variables from the backend .env file and update the following values:
```
NODE_ENV=production
REDIS_URL= *The value for the one created in Vercel*
DATABASE_URL = "The value for the one created in Vercel*
```
Deploy the service. Once deployment is complete, you'll receive an onrender.com link to access it.
![image](https://github.com/user-attachments/assets/63cd2f5a-103a-4e2e-b6f2-f5f71dcd58e4)

 To connect the Frontend with the backend, in the Vercel dashboard: Navigate to Settings > Environment Variables > Find VITE_API_BASE_URL > Edit > Update the value to the onrender.com link that was created in Render.
![image](https://github.com/user-attachments/assets/a7d373b5-68b9-4d7a-9e6b-c82f210e71cf)

Notes:
- In Render's free plan, the backend spins down after 15 minutes of inactivity, which can cause a delay when it's accessed again as the server needs to restart.

## 4. Setup Backend Uptime Monitoring (Optional)
Using a service such as [UptimeRobot](https://uptimerobot.com/), we can get around the issue with Render's backend spin-down by sending periodic requests to keep the server awake.

To do this add a HTTP/Website monitor to your backend onrender.com link and add `/hello` at the end (e.g., https://assisted-assignments.onrender.com/hello). For monitor Interval select any time <= 10 minutes to keep the server active.

![image](https://github.com/user-attachments/assets/3f780d7c-f2b8-4d4a-9cb7-b92704a5b656)



