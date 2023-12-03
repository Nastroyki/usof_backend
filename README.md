# USOF Backend

Made By Maksym Cherednychenko

It's a backend web API for a StackOverflow-style forum/website.
It makes registration, posting, commenting, liking and adding categories to posts possible.

## Requirements
- NodeJS
- NPM
- MySQL Database
  
## How to run
1. Create .env file by renaming env-example.txt
2. Configure .env with correct parameters
3. Run db.sql on your MySQL Server
4. Run "npm i" to install node modules
5. Run "npm start" or "node index" in the usof_backend directory
6. Application will run on port 5000 (can be configure in .env)

## Endpoints

### /api/auth...
1. **POST /register** - Register a new user.
   - Required:
     - login
     - password
     - confirm
     - email
   - Returns 201 on successful registration with user data.

2. **POST /login** - User login.
   - Required:
     - login
     - password
   - Returns a JWT token on successful login.

3. **GET /me** - Get user profile.
   - Requires Authentication.
   - Returns user profile information without sensitive data.

4. **POST /logout** - Logout user.
   - Clears the authentication token.
   - Returns a message indicating successful logout.

5. **POST /refresh** - Refresh authentication token.
   - Requires Authentication.
   - Returns a new JWT token with an extended expiration.

6. **POST /verify-email** - Verify and update user email.
   - Required:
     - login
     - password
     - code or email
   - Returns user data with an updated email on success.

7. **POST /password-reset** - Request a password reset code.
   - Required:
     - login or email
   - Sends a reset code to the user's email.

8. **POST /password-reset-confirm** - Confirm password reset.
   - Required:
     - login or email
     - password
     - code
   - Resets the user's password on successful code verification.

### /api/users...

9. **GET /** - Get all users.
   - Returns a list of all users.
   - Returns 404 if no users are found.

10. **GET /:id** - Get user by ID.
       - Required:
         - id
       - Returns user data by ID.
       - Returns 404 if the user is not found.

11. **POST /** - Create a new user. Requires Admin privileges.
       - Requires Authentication.
       - Required:
         - login
         - password
         - confirm
         - email
         - role (Admin or User)
       - Returns 201 on successful user creation with user data.

12. **PATCH /avatar** - Change user avatar. Requires Authentication.
       - Required:
         - profile_picture (file)
       - Resizes and saves the user's profile picture.
       - Returns 200 on successful avatar change.

13. **PATCH /:id** - Change user information by ID. Requires Admin privileges or own user ID.
       - Requires Authentication.
       - Optional:
         - login
         - password
         - full_name
         - email
         - role (Admin or User)
       - Returns 200 on successful user information update with user data.

14. **DELETE /:id** - Delete user by ID. Requires Admin privileges or own user ID.
       - Requires Authentication.
       - Returns 200 on successful user deletion.

### /api/posts...

15. **GET /** - Get paginated list of posts.
    - Optional query parameters:
      - page (default: 1)
      - tag (default: 0)
      - status (default: '')
      - sort (default: 'publish_date')
      - order (default: 'DESC')
    - Returns a paginated list of posts.
    - Returns 404 if no posts are found.

16. **GET /:id** - Get post by ID.
    - Required:
      - id
    - Returns post data by ID.
    - Returns 404 if the post is not found.

17. **GET /:id/comments** - Get comments for a specific post by ID.
    - Required:
      - id
    - Returns comments associated with the post.

18. **POST /:id/comments** - Add a comment to a specific post by ID. Requires Authentication.
    - Required:
      - content
    - Adds a comment to the post.
    - Returns 201 on successful comment creation.

19. **GET /:id/tags** - Get tags for a specific post by ID.
    - Required:
      - id
    - Returns tags associated with the post.

20. **GET /:id/like** - Get like and dislike counts for a specific post by ID.
    - Required:
      - id
    - Returns the count of likes and dislikes for the post.

21. **GET /:id/like/:user_id** - Check if a user has liked or disliked a specific post by ID.
    - Required:
      - id
      - user_id
    - Returns information about the user's like/dislike status for the post.

22. **POST /** - Create a new post. Requires Authentication.
    - Required:
      - title
      - content
    - Optional:
      - tags
    - Returns 201 on successful post creation with post data.

23. **POST /:id/like** - Add or update a like or dislike for a specific post by ID. Requires Authentication.
    - Required:
      - type ('like' or 'dislike')
    - Adds or updates a like or dislike for the post.
    - Returns 201 on successful like/dislike addition.

24. **PATCH /:id** - Update a post by ID. Requires Authentication.
    - Required:
      - post_id
      - title
      - content
      - tags
    - Returns 200 on successful post update with updated post data.

25. **DELETE /:id** - Delete a post by ID. Requires Authentication.
    - Required:
      - id
    - Returns 200 on successful post deletion.

26. **DELETE /:id/like** - Delete a user's like or dislike for a specific post by ID. Requires Authentication.
    - Required:
      - id
    - Returns 200 on successful like or dislike deletion.
   
### /api/tags...

27. **GET /** - Get all tags or search tags by title.
    - Optional query parameters:
      - search (default: '')
    - Returns a list of tags, optionally filtered by title.

28. **GET /:id** - Get tag by ID.
    - Required:
      - id
    - Returns tag data by ID.
    - Returns 404 if the tag is not found.

29. **GET /:id/posts** - Get posts associated with a specific tag by ID.
    - Required:
      - id
    - Returns posts associated with the tag.

30. **POST /** - Create a new tag. Requires Authentication.
    - Required:
      - title
      - description
    - Returns 201 on successful tag creation with tag data.

31. **PATCH /:id** - Update a tag by ID. Requires Authentication.
    - Required:
      - title
      - description
    - Returns 200 on successful tag update with updated tag data.

32. **DELETE /:id** - Delete a tag by ID. Requires Authentication.
    - Required:
      - id
    - Returns 200 on successful tag deletion.
   
### /api/comments...

33. **GET /:id** - Get comment by ID.
    - Required:
      - id
    - Returns comment data by ID.
    - Returns 404 if the comment is not found.

34. **GET /:id/likes** - Get likes and dislikes count for a specific comment by ID.
    - Required:
      - id
    - Returns an object with 'likes' and 'dislikes' counts.

35. **GET /:id/likes/:user_id** - Check if a user has liked or disliked a comment by ID.
    - Required:
      - id
      - user_id
    - Returns information about the user's like or dislike status.

36. **GET /:id/answers** - Get answers (replies) to a specific comment by ID.
    - Required:
      - id
    - Returns a list of answers to the comment.

37. **POST /:id/answer** - Post an answer (reply) to a specific comment by ID. Requires Authentication.
    - Required:
      - content
    - Returns 201 on successful answer creation with answer data.

38. **POST /:id/likes** - Like or dislike a specific comment by ID. Requires Authentication.
    - Required:
      - type ("like" or "dislike")
    - Deletes the user's existing like if type is not valid.
    - Returns 201 on successful like or dislike.

39. **PATCH /:id** - Update content of a comment by ID. Requires Authentication.
    - Required:
      - content
    - Returns 200 on successful comment update with updated comment data.

40. **DELETE /:id** - Delete a comment by ID. Requires Authentication.
    - Required:
      - id
    - Returns 200 on successful comment deletion.
    - Returns 404 if the comment is not found.
    - Returns 403 if the user is not the owner of the comment.

41. **DELETE /:id/likes** - Delete a user's like or dislike for a specific comment by ID. Requires Authentication.
    - Required:
      - id
    - Returns 200 on successful like or dislike deletion.
    - Returns 404 if the like is not found.
   
### /api/comment-answers...

42. **GET /:id** - Get comment answer by ID.
    - Required:
      - id
    - Returns comment answer data by ID.
    - Returns 404 if the comment answer is not found.

43. **PATCH /:id** - Update content of a comment answer by ID. Requires Authentication.
    - Required:
      - content
    - Returns 200 on successful comment answer update with updated data.
    - Returns 404 if the comment answer is not found.

44. **DELETE /:id** - Delete a comment answer by ID. Requires Authentication.
    - Required:
      - id
    - Returns 200 on successful comment answer deletion.
    - Returns 404 if the comment answer is not found.
    - Returns 403 if the user is not the owner of the comment answer.
