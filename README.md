# USOF Backend

Made By Maksym Cherednychenko

It's a backend web API for a StackOverflow-style forum/website.
It makes registration, posting, commenting, liking and adding categories to posts possible.

## Requirements
- NodeJS with ESM support
- NPM
- MySQL Database
  
## How to run
1. Create .env file by renaming env-example.txt
2. Configure .env with correct parameters
2. Run "npm i" to install node modules
3. Run "npm start" or "node index" in the usof_backend directory
4. Application will run on port 5000 (can be configure in .env)

## Endpoints

### /api/auth...
1. POST /register - register new User. Required parameters:
    1. login
    2. password
    3. password_confirm
    4. email
    5. fullName
    It will send confirmation email to included email with link for activating user
2. POST /email-confirmation/:token - Activate user with given token
3. POST /login - login User. Required:
    1. login
    2. email
    3. password
4. POST /logout - logout
5. POST /password-reset - send email with password reset link. Required:
   1. email
6. POST /password-reset/:token - reset password from link in email. Required:
   1. new_password
   
<!-- ### /api/users...
1. GET / - get all users. Requires Admin privileges
2. GET /:id - get user by id. Requires Authentication
3. POST / - create new active User. Requires Admin privileges. Required:
   1. login
   2. password
   3. password_confirm
   4. email
   5. fullName
   6. role - "User" || "Admin"
4. PATCH /avathar - change your avathar. Requires Authentication. Required:
   1. profile_picture - file
5. PATCH /:id - change user info by id. Requires Admin privileges. Optional:
   1. login
   2. password
   3. password_confirm
   4. email
   5. fullName
   6. role - "User" || "Admin"
   7. active - boolean
6. DELETE /:id - delete user. Requires Admin privileges -->

<!--  -->