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

## User Login Endpoint

### Endpoint

`POST /users/login`

### Description

This endpoint is used to authenticate an existing user. It verifies the email and password and returns an authentication token along with the user details.

### Request Body

The request body must be a JSON object containing the following fields:

| Field      | Type   | Required | Description          | Validation Rules             |
| ---------- | ------ | -------- | -------------------- | ---------------------------- |
| `email`    | String | Yes      | User's email address | Must be a valid email format |
| `password` | String | Yes      | User's password      | Minimum 6 characters         |

**Example Request:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Responses

#### 200 OK

The user was successfully authenticated.

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

The request failed due to validation errors (e.g., invalid email, password too short).

**Example Response:**

```json
{
  "errors": [
    {
      "value": "inv",
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### 401 Unauthorized

Invalid email or password.

**Example Response:**

```json
{
  "message": "Invalid email or password"
}
```

## User Profile Endpoint

### Endpoint

`GET /users/profile`

### Description

This endpoint retrieves the profile information of the authenticated user.

### Authorization

Requires a valid JWT token in the `Authorization` header (Bearer token) or as a cookie named `token`.

### Responses

#### 200 OK

Returns the user's profile information.

**Example Response:**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "_id": "657a1b2c3d4e5f6g7h8i9j0k",
  "__v": 0
}
```

#### 401 Unauthorized

Authentication failed (missing or invalid token).

**Example Response:**

```json
{
  "message": "Unauthorized"
}
```

## User Logout Endpoint

### Endpoint

`GET /users/logout`

### Description

This endpoint logs out the current user by blacklisting the provided token and clearing the cookie.

### Authorization

Requires a valid JWT token in the `Authorization` header (Bearer token) or as a cookie named `token`.

### Responses

#### 200 OK

User successfully logged out.

**Example Response:**

```json
{
  "message": "Logged Out"
}
```

#### 401 Unauthorized

Authentication failed (missing or invalid token).

**Example Response:**

```json
{
  "message": "Unauthorized"
}
```

## Captain Registration Endpoint

### Endpoint

`POST /captains/register`

### Description

This endpoint is used to register a new captain in the system. It creates a new captain record in the database and returns an authentication token along with the captain details.

### Request Body

The request body must be a JSON object containing the following fields:

| Field                 | Type   | Required | Description                | Validation Rules                            |
| --------------------- | ------ | -------- | -------------------------- | ------------------------------------------- |
| `fullname.firstname`  | String | Yes      | Captain's first name       | Minimum 3 characters                        |
| `fullname.lastname`   | String | Yes      | Captain's last name        | Minimum 3 characters                        |
| `email`               | String | Yes      | Captain's email address    | Must be a valid email format                |
| `password`            | String | Yes      | Captain's password         | Minimum 6 characters                        |
| `vehicle.color`       | String | Yes      | Vehicle color              | Minimum 3 characters                        |
| `vehicle.plate`       | String | Yes      | Vehicle plate number       | Minimum 3 characters                        |
| `vehicle.capacity`    | Number | Yes      | Vehicle passenger capacity | Minimum 1                                   |
| `vehicle.vehicleType` | String | Yes      | Type of vehicle            | Must be one of: 'car', 'motorcycle', 'auto' |

**Example Request:**

```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Doe"
  },
  "email": "jane.captain@example.com",
  "password": "securePassword123",
  "vehicle": {
    "color": "Red",
    "plate": "KA-01-AB-1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Responses

#### 201 Created

The captain was successfully registered.

**Example Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "captain": {
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.captain@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "KA-01-AB-1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "_id": "657a1b2c3d4e5f6g7h8i9j0k"
  }
}
```

#### 400 Bad Request

The request failed due to validation errors or if the captain already exists.

**Example Response:**

```json
{
    "message": "Captain already exist"
}
```
