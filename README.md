# Hall Booking System

This project is a comprehensive Hall Booking System, featuring a Django backend for robust data management and API services, and a React frontend built with Vite for a dynamic and responsive user interface.

## Project Structure

The project is divided into two main parts:

-   [`backend/`](backend/): Contains the Django application, including API endpoints, database models, and business logic.
-   [`Frontend 1/`](Frontend%201/): Contains the React application, responsible for the user interface and interacting with the backend API.

## Getting Started

Follow these instructions to set up and run the project locally.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install Python dependencies:**
    It's recommended to use a virtual environment.
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```

4.  **Create a superuser (optional, for admin access):**
    ```bash
    python manage.py createsuperuser
    ```

5.  **Run the Django development server:**
    ```bash
    python manage.py runserver
    ```
    The backend API will typically be available at `http://localhost:8000/`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd Frontend\ 1
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Run the React development server:**
    ```bash
    npm run dev
    ```
    The frontend application will typically be available at `http://localhost:5173/` or a similar address.

## Usage

Once both the backend and frontend servers are running:

1.  Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173/`).
2.  You can now interact with the Hall Booking System, browse halls, make bookings, and manage administrative tasks (if logged in as a superuser).