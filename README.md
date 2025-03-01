# CourseApp

CourseApp is the backend for a course-selling platform, featuring basic CRUD operations and separate routes for admins and users.

## Features

- User authentication and authorization
- CRUD operations for courses
- Separate admin and user routes
- Secure API with JWT authentication

## Technologies Used

- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- JWT for authentication

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/CourseApp.git
   cd CourseApp
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```sh
   npm start
   ```

## Todo

- [ ] Create the frontend
- [ ] Explicitly define the database models and schema
- [ ] Experiment migrating the project to TypeScript
- [ ] Incorporate payment gateway in course purchase route
- [ ] Implement error handling using asynchronous middlewares

## License

MIT License

---

Feel free to contribute and improve the project!

