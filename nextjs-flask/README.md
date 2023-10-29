## Magical To-Do

Magical To-Do is a hybrid Next.js + Python application that uses Next.js as the frontend and Firebase as the database. It was initially designed to use Flask as the API backend, but the backend was later switched to Firebase. Therefore, some Flask-related code and documentation may still be present but is not used.

The application allows users to create, manage, and save to-do lists. It supports user authentication via Google and data persistence using Firebase Firestore.

## Demo Recording link (Loom)
https://www.loom.com/share/bcd720622f2d40d0ab83fff5f74142ec?sid=26e0f125-275a-492d-9444-77030a72375b 

## Installation

To install the application, you need to clone the repository and install the dependencies. The dependencies can be installed using npm, yarn, or pnpm as shown in the code snippet below:

```bash
npm install
# or
yarn
# or
pnpm install
```

The application will be accessible at http://localhost:3000.


## Code Structure

The application's code is organized into several files:

firebase.ts: This file contains the Firebase configuration and initialization code. It also exports the Firebase Auth and Google Auth Provider instances.

LoginForm.tsx: This component handles user login and logout using Firebase Authentication. It also fetches and saves user data from/to Firestore.

page.tsx: This is the main component of the application. It handles the creation, deletion, and completion of to-do lists and their items. It also handles the expansion and collapse of tasks.

layout.tsx: This file contains the root layout of the application.

package.json: This file contains the list of dependencies and scripts for the application.

tsconfig.json: This file contains the TypeScript configuration for the application.

