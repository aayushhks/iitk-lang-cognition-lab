# IITK Language and Cognition Lab - Survey Portal

## Description

This project is a full-stack web application designed for the IIT Kanpur Language and Cognition Lab. It serves as a platform for conducting psycholinguistic surveys to gather normative data on Hindi words. Users can register, log in, and participate in various surveys, rating words based on different psychological and linguistic characteristics.

The system is composed of three main parts:
1.  **User Frontend (`iitk-frontend`):** A public-facing React application where users can participate in surveys.
2.  **Admin Frontend (`iitk-core-frontend`):** A CoreUI-based React admin dashboard for managing users, tracking survey progress, and viewing data.
3.  **Backend (`iitk-backend`):** A Python (Flask) API that handles user authentication, data storage, and serves survey questions from a Hindi corpus.

## Features

### User Portal (`iitk-frontend`)

* **User Authentication:** Secure user registration and login system.
* **Survey Dashboard:** Users can view a list of available surveys on the home page.
* **Survey Participation:** A dedicated interface (`/course`) for rating words.
    * Supports multiple survey types, including ratings on a 1-7 scale and a slider for "Age of Acquisition".
    * Provides detailed instructions (in Hindi) for each norm, such as:
        * Concreteness (स्थूलता/ठोसपन)
        * Arousal (उत्तेजना)
        * Dominance (प्रभुत्व / प्रभाव)
        * Valence (भावुकता)
        * Imageability (कल्पनाशीलता)
        * Familiarity (परिचय / जानकारी)
* **User Profile:** Users can view and update their profile information.
* **Project Tracking:** A "My Projects" page shows users which surveys they have started or completed.
* **User Manual:** Includes a PDF guide on how to use the portal.

### Admin Dashboard (`iitk-core-frontend`)

* **Admin Authentication:** Secure login portal for administrators.
* **Dashboard:** A central dashboard (based on CoreUI) to view high-level statistics.
* **User Management:** Tables to view and manage registered users ("Customers Management").
* **Survey Monitoring:** View progress of users who have "Opted Surveys".
* **Language Management:** An interface (`LangMgmt`) to view, filter, and manage the words in the corpus.
* **Data Export:** Functionality to download user data and survey results.

### Backend (`iitk-backend`)

* **API Server:** A Flask-based Python server.
* **Authentication:** Uses JWT (JSON Web Tokens) for managing user and admin sessions.
* **Data Handling:**
    * Reads survey definitions and word lists from configuration (`config.json`) and data files (`Hindi_word_frpm_96122.txt`).
    * Manages user data (users.json) and survey responses in JSON files.
* **Survey Logic:** Serves words in blocks/chunks to users and records their responses.

## Tech Stack

* **User Frontend (`iitk-frontend`):**
    * React
    * React Router
    * React Bootstrap

* **Admin Frontend (`iitk-core-frontend`):**
    * React
    * Vite
    * CoreUI (`@coreui/react`, `@coreui/chartjs`)
    * React Router
    * Redux

* **Backend (`iitk-backend`):**
    * Python
    * Flask
    * Flask-JWT-Extended
    * Pandas

## Project Structure

Markdown

# IITK Language and Cognition Lab - Survey Portal

## Description

This project is a full-stack web application designed for the IIT Kanpur Language and Cognition Lab. It serves as a platform for conducting psycholinguistic surveys to gather normative data on Hindi words. Users can register, log in, and participate in various surveys, rating words based on different psychological and linguistic characteristics.

The system is composed of three main parts:
1.  **User Frontend (`iitk-frontend`):** A public-facing React application where users can participate in surveys.
2.  **Admin Frontend (`iitk-core-frontend`):** A CoreUI-based React admin dashboard for managing users, tracking survey progress, and viewing data.
3.  **Backend (`iitk-backend`):** A Python (Flask) API that handles user authentication, data storage, and serves survey questions from a Hindi corpus.

## Features

### User Portal (`iitk-frontend`)

* **User Authentication:** Secure user registration and login system.
* **Survey Dashboard:** Users can view a list of available surveys on the home page.
* **Survey Participation:** A dedicated interface (`/course`) for rating words.
    * Supports multiple survey types, including ratings on a 1-7 scale and a slider for "Age of Acquisition".
    * Provides detailed instructions (in Hindi) for each norm, such as:
        * Concreteness (स्थूलता/ठोसपन)
        * Arousal (उत्तेजना)
        * Dominance (प्रभुत्व / प्रभाव)
        * Valence (भावुकता)
        * Imageability (कल्पनाशीलता)
        * Familiarity (परिचय / जानकारी)
* **User Profile:** Users can view and update their profile information.
* **Project Tracking:** A "My Projects" page shows users which surveys they have started or completed.
* **User Manual:** Includes a PDF guide on how to use the portal.

### Admin Dashboard (`iitk-core-frontend`)

* **Admin Authentication:** Secure login portal for administrators.
* **Dashboard:** A central dashboard (based on CoreUI) to view high-level statistics.
* **User Management:** Tables to view and manage registered users ("Customers Management").
* **Survey Monitoring:** View progress of users who have "Opted Surveys".
* **Language Management:** An interface (`LangMgmt`) to view, filter, and manage the words in the corpus.
* **Data Export:** Functionality to download user data and survey results.

### Backend (`iitk-backend`)

* **API Server:** A Flask-based Python server.
* **Authentication:** Uses JWT (JSON Web Tokens) for managing user and admin sessions.
* **Data Handling:**
    * Reads survey definitions and word lists from configuration (`config.json`) and data files (`Hindi_word_frpm_96122.txt`).
    * Manages user data (users.json) and survey responses in JSON files.
* **Survey Logic:** Serves words in blocks/chunks to users and records their responses.

## Tech Stack

* **User Frontend (`iitk-frontend`):**
    * React
    * React Router
    * React Bootstrap

* **Admin Frontend (`iitk-core-frontend`):**
    * React
    * Vite
    * CoreUI (`@coreui/react`, `@coreui/chartjs`)
    * React Router
    * Redux

* **Backend (`iitk-backend`):**
    * Python
    * Flask
    * Flask-JWT-Extended
    * Pandas

## Project Structure

iitk-lang-cognition-lab/ ├── iitk-backend/ # Python Flask API │ ├── roo/ # Main backend logic │ │ ├── index.py # Main Flask app, routes, and logic │ │ ├── db/ # JSON-based database files │ │ │ ├── config.json # Survey definitions │ │ │ └── users.json # User data (created at runtime) │ │ └── security.py # Password hashing functions │ ├── data/ # Raw data corpus │ └── requirements.txt # Python dependencies │ ├── iitk-core-frontend/ # React Admin Dashboard │ ├── public/ │ ├── src/ │ │ ├── components/ # CoreUI components (Header, Sidebar, etc.) │ │ ├── views/ # Admin pages (Dashboard, Tables, Forms) │ │ ├── _nav.js # Sidebar navigation config │ │ └── routes.js # Admin panel routes │ ├── package.json # Admin frontend dependencies │ └── vite.config.mjs # Vite configuration │ └── iitk-frontend/ # React User Portal ├── public/ # Static assets, User_Manual.pdf ├── src/ │ ├── components/ # (Not used, components are in src/) │ ├── assets/ │ ├── App.js # Main React router │ ├── Home.jsx # Survey selection page │ ├── Course.jsx # Word rating interface │ ├── Login.js # User login page │ ├── SignUp.js # User registration page │ ├── .jsx # Other pages (MyProfile, ContactUs, etc.) │ └── instruction.jsx # Instructions for each survey └── package.json # User frontend dependencies

## Setup and Installation

To run this project, you need to start all three services (backend, user frontend, and admin frontend) independently.

### 1. Backend (`iitk-backend`)

1.  Navigate to the backend directory:
    ```bash
    cd iitk-backend
    ```
2.  Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Run the Flask server (note: you may need to update the host IP in `index.py` to match your network):
    ```bash
    python roo/index.py
    ```

### 2. User Frontend (`iitk-frontend`)

1.  Navigate to the user frontend directory:
    ```bash
    cd iitk-frontend
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```

### 3. Admin Frontend (`iitk-core-frontend`)

1.  Navigate to the admin frontend directory:
    ```bash
    cd iitk-core-frontend
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite development server:
    ```bash
    npm start
    ```
