# API Documentation

## User Registration Endpoint

### Endpoint

`POST /users/register`

### Description

This endpoint is used to register a new user in the system. It creates a new user record in the database and returns an authentication token along with the user details.

### Request Body

The request body must be a JSON object containing the following fields:

| Field                | Type   | Required | Description          | Validation Rules             |
| -------------------- | ------ | -------- | -------------------- | ---------------------------- |
| `fullname.firstname` | String | Yes      | User's first name    | Minimum 3 characters         |
| `fullname.lastname`  | String | Yes      | User's last name     | Minimum 3 characters         |
| `email`              | String | Yes      | User's email address | Must be a valid email format |
| `password`           | String | Yes      | User's password      | Minimum 6 characters         |

**Example Request:**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Responses

#### 201 Created

The user was successfully registered.

**Example Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com",
    "_id": "657a1b2c3d4e5f6g7h8i9j0k"
  }
}
```

#### 400 Bad Request

The request failed due to validation errors (e.g., invalid email, password too short, missing fields).

**Example Response:**

```json
{
  "errors": [
    {
      "value": "inv",
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "First name must be atleast 3 characters",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```
