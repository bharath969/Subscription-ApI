# Subscription Tracker API

## Overview
A RESTful API for managing users and subscriptions with authentication, role-based access control, and subscription management.

## Tech Stack
- **Programming Language:** JavaScript
- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Architecture:** MVC (Model-View-Controller)
- **Additional Features:**
  - Bot protection(Arcjet)
  - Rate limiting(Arcjet)

## Features
- User authentication (JWT-based)
- Role-based access control (Admin/User)
- Subscription management (CRUD operations)
- Secure API endpoints
- Rate limiting to prevent abuse
- Bot protection mechanisms

## Installation
```sh
git clone https://github.com/bharath969/Subscription-ApI.git
cd Subscription-ApI
npm install
```

## Usage
1. Create a `.env` file and configure your environment variables.
2. Start the server:
   ```sh
   npm start
   ```
3. Access API endpoints via Postman or any API client.

## API Endpoints
### Authentication
- `POST /api/v1/auth/sign-up` - Register a new user
- `POST /api/v1/auth/sign-in` - User login

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user details
- `DELETE /api/v1/users/:id` - Delete user

### Subscriptions
- `POST api/v1/subscriptions/` - Create a subscription
- `GET api/v1/subscriptions/` - Get all subscriptions
- `GET api/v1/subscriptions/:id` - Get subscription by user-ID
- `PUT api/v1/subscriptions/:id` - Update subscription
- `api/v1/subscriptions/:id` - Delete subscription

## Contributing
Feel free to fork the repository, make improvements, and submit a pull request.

## License
MIT License

