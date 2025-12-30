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

> After walking through the captain setup above, continue here for the map integration guidance below.

## Maps & Location Helpers

These `/maps/*` endpoints assume you already completed the captain auth flows and hold a valid JWT/cookie. They supply the Leaflet/OpenStreetMap-powered frontend with the data it needs.

### Get Coordinates

`GET /maps/get-coordinates`

**Description:** Turns a human address into latitude/longitude using Nominatim.

**Query Parameters:**

- `address` (string, required)

**Responses:**

#### 200 OK

```json
{
  "latitude": 12.9715987,
  "longitude": 77.5945627
}
```

#### 400 Bad Request

Missing or empty `address`.

### Get Distance & Time

`GET /maps/get-distance-time`

**Description:** Uses OSRM to compute driving distance and duration between two addresses.

**Query Parameters:**

- `origin` (string, required)
- `destination` (string, required)

**Responses:**

#### 200 OK

```json
{
  "distance": { "value": 20540, "text": "20.54 km" },
  "duration": { "value": 1800, "text": "0 h 30 min" },
  "status": "OK"
}
```

#### 400 Bad Request

Origin or destination missing.

### Autocomplete Suggestions

`GET /maps/get-suggestions`

**Description:** Returns search suggestions for Leaflet autocomplete boxes via Nominatim. Optional `lat`/`lng` tighten the viewbox.

**Query Parameters:**

- `query` (string, required)
- `lat` / `lng` (numbers, optional, must be valid coordinates)

**Responses:**

#### 200 OK

```json
[
  {
    "description": "Marina Bay Sands, Singapore",
    "location": { "lat": "1.2834", "lng": "103.8607" }
  },
  ...
]
```

#### 400 Bad Request

Missing `query` or invalid `lat`/`lng` ranges.

### Frontend Notes

- Use Leaflet with OpenStreetMap tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- Once a captain is logged in, start a short interval that sends `navigator.geolocation` updates to `/maps/location` to keep the dashboard markers fresh.
- The `/maps/get-coordinates` and `/maps/get-suggestions` endpoints power location search boxes before ride creation.
- `/maps/get-distance-time` drives ETA/distance widgets shown alongside Leaflet popups.

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

## Captain Login Endpoint

### Endpoint

`POST /captains/login`

### Description

This endpoint is used to authenticate an existing captain. It verifies the email and password and returns an authentication token along with the captain details.

### Request Body

The request body must be a JSON object containing the following fields:

| Field      | Type   | Required | Description             | Validation Rules             |
| ---------- | ------ | -------- | ----------------------- | ---------------------------- |
| `email`    | String | Yes      | Captain's email address | Must be a valid email format |
| `password` | String | Yes      | Captain's password      | Minimum 6 characters         |

**Example Request:**

```json
{
  "email": "jane.captain@example.com",
  "password": "securePassword123"
}
```

### Responses

#### 200 OK

The captain was successfully authenticated.

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

The request failed due to validation errors or invalid credentials.

**Example Response:**

```json
{
  "message": "Invalid email or password"
}
```

## Captain Profile Endpoint

### Endpoint

`GET /captains/profile`

### Description

This endpoint retrieves the profile information of the authenticated captain.

### Authorization

Requires a valid JWT token in the `Authorization` header (Bearer token) or as a cookie named `token`.

### Responses

#### 200 OK

Returns the captain's profile information.

**Example Response:**

```json
{
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

#### 401 Unauthorized

Authentication failed (missing or invalid token).

**Example Response:**

```json
{
  "message": "Unauthorized"
}
```

## Captain Logout Endpoint

### Endpoint

`GET /captains/logout`

### Description

This endpoint logs out the current captain by blacklisting the provided token and clearing the cookie.

### Authorization

Requires a valid JWT token in the `Authorization` header (Bearer token) or as a cookie named `token`.

### Responses

#### 200 OK

Captain successfully logged out.

**Example Response:**

```json
{
  "message": "Logged out successfully"
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

## Ride Endpoints

### Create Ride

#### Endpoint

`POST /rides/create`

#### Description

This endpoint is used to create a new ride request.

#### Authorization

Requires a valid JWT token in the `Authorization` header (Bearer token) or as a cookie named `token`.

#### Request Body

The request body must be a JSON object containing the following fields:

| Field            | Type   | Required | Description                                      | Validation Rules                                         |
| ---------------- | ------ | -------- | ------------------------------------------------ | -------------------------------------------------------- |
| `pickupLocation` | String | Yes      | Address of the pickup location                   | Minimum 3 characters                                     |
| `dropLocation`   | String | Yes      | Address of the drop location                     | Minimum 3 characters                                     |
| `vehicleType`    | String | Yes      | Type of vehicle requested                        | Must be one of: 'car', 'motorcycle', 'auto'              |

**Example Request:**

```json
{
  "pickupLocation": "123 Main St, City",
  "dropLocation": "456 Market St, City",
  "vehicleType": "car"
}
```

#### Responses

##### 201 Created

The ride was successfully created.

**Example Response:**

```json
{
  "user": "657a1b2c3d4e5f6g7h8i9j0k",
  "pickupLocation": "123 Main St, City",
  "dropLocation": "456 Market St, City",
  "fare": 150.50,
  "status": "pending",
  "otp": "1234",
  "_id": "657a1b2c3d4e5f6g7h8i9j0l",
  "__v": 0
}
```

##### 400 Bad Request

The request failed due to validation errors.

### Get Fare

#### Endpoint

`GET /rides/get-fare`

#### Description

This endpoint retrieves fare estimates for different vehicle types between two locations.

#### Authorization

Requires a valid JWT token in the `Authorization` header (Bearer token) or as a cookie named `token`.

#### Query Parameters

| Parameter        | Type   | Required | Description                    |
| ---------------- | ------ | -------- | ------------------------------ |
| `pickupLocation` | String | Yes      | Address of the pickup location |
| `dropLocation`   | String | Yes      | Address of the drop location   |

**Example Request:**

`GET /rides/get-fare?pickupLocation=123 Main St, City&dropLocation=456 Market St, City`

#### Responses

##### 200 OK

Returns fare estimates.

**Example Response:**

```json
{
  "car": {
    "currency": "INR",
    "fare": 150.50,
    "distanceKm": 10.5,
    "durationMin": 25
  },
  "auto": {
    "currency": "INR",
    "fare": 100.00,
    "distanceKm": 10.5,
    "durationMin": 25
  },
  "motorcycle": {
    "currency": "INR",
    "fare": 80.00,
    "distanceKm": 10.5,
    "durationMin": 25
  }
}
```

##### 400 Bad Request

Missing query parameters or calculation error.

## Socket.io Events

### Captain Location Update

**Event:** `captain-location-updated`

**Description:** Emitted to the client when a captain's location changes.

**Payload:**

```json
{
  "location": {
    "ltd": 28.7041,
    "lng": 77.1025
  }
}
```
