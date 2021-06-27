![LICENSE](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)
![Security Status](https://img.shields.io/security-headers?label=Security&url=https%3A%2F%2Fgithub.com&style=flat-square)
![Gluten Status](https://img.shields.io/badge/Gluten-Free-green.svg)
![Eco Status](https://img.shields.io/badge/ECO-Friendly-green.svg)

# Node.js Pirple homeword assignment 2

_RESTful API project_

This project is for educational porpuses only. Learning to create a RESTful API.

Site published at: _not published_

Design: _no design_

## Project features

- Users API
- Tokens API
- Menu API
- Cart API

---

## Users API

Endpoint: /users (http://localhost:3000/users)

Available request methods: POST, GET, PUT, DELETE

### [POST] http://localhost:3000/users

**Requires:**

- JSON payload, representing a user's object

Example request payload

```json
{
  "firstName": "FirstName",
  "lastName": "LastName",
  "email": "info@mail.com",
  "password": "your_secret_password",
  "tosAgreement": true
}
```

**Response:**

- JSON object, representing response message

Example response payload

```json
{
  "success": "User created"
}
```

### [GET] http://localhost:3000/users?email={userEmail}

**Requires:**

- authentication token in header
- url param _email_

Example request

```
Headers
token: kj4sexzzmzkkqp7ots0p

URL
http://localhost:3000/users?email=info@mail.com
```

**Response:**

- JSON, representing a user's object

Example response payload

```json
{
  "firstName": "FirstName",
  "lastName": "LastName",
  "email": "info@mail.com",
  "tosAgreement": true
}
```

### [PUT] http://localhost:3000/users

**Requires:**

- authentication token in header
- JSON payload, representing a user's object with a fields to update

Example request payload

```
Headers
token: kj4sexzzmzkkqp7ots0p
```

```json
{
  "firstName": "FirstName",
  "lastName": "LastName",
  "email": "info@mail.com",
  "password": "your_secret_password",
  "tosAgreement": true
}
```

**Response:**

- JSON object, representing response message

Example response payload

```json
{
  "success": "User has been updated"
}
```

### [DELETE] http://localhost:3000/users?email={userEmail}

**Requires:**

- authentication token in header
- url param _email_

Example request

```
Headers
token: kj4sexzzmzkkqp7ots0p

URL
http://localhost:3000/users?email=info@mail.com
```

**Response:**

- JSON object, representing response message

Example response payload

```json
{
  "success": "User has been deleted"
}
```

---

## Tokens API

Endpoint: /tokens (http://localhost:3000/tokens)

Available request methods: POST, GET, PUT, DELETE

### [POST] http://localhost:3000/tokens

**Requires:**

- JSON payload, representing a object with user's email and password

Example request payload

```json
{
  "email": "info@mail.com",
  "password": "your_secret_password"
}
```

**Response:**

- JSON object, representing authentication object with tokenID and expiration date

Example response payload

```json
{
  "email": "info@mail.com",
  "id": "kj4sexzzmzkkqp7ots0p",
  "expires": 1624759792417
}
```

### [GET] http://localhost:3000/tokens?id={tokenID}

**Requires:**

- authentication token in header
- url param _id_

Example request

```
URL
http://localhost:3000/tokens?id=kj4sexzzmzkkqp7ots0p
```

**Response:**

- JSON, representing authentication object

Example response payload

```json
{
  "email": "info@mail.com",
  "id": "kj4sexzzmzkkqp7ots0p",
  "expires": 1624759792417
}
```

### [PUT] http://localhost:3000/tokens

**Requires:**

- JSON payload, representing authentication object

Example request payload

```json
{
  "id": "kj4sexzzmzkkqp7ots0p",
  "extend": true
}
```

**Response:**

- JSON object, representing authentication object

Example response payload

```json
{
  "email": "info@mail.com",
  "id": "kj4sexzzmzkkqp7ots0p",
  "expires": 1624760133506
}
```

### [DELETE] http://localhost:3000/tokens?id={tokenID}

**Requires:**

- authentication token in header
- url param _id_

Example request

```
URL
http://localhost:3000/tokens?id=kj4sexzzmzkkqp7ots0p
```

**Response:**

- JSON object, representing response message

Example response payload

```json
{
  "success": "Token has been deleted"
}
```

---

## Menu API

Endpoint: /menu (http://localhost:3000/menu)

Available request methods: GET

### [GET] http://localhost:3000/menu?email={userEmail}

**Requires:**

- authentication token in header
- url param _email_

Example request

```
Headers
token: kj4sexzzmzkkqp7ots0p

URL
http://localhost:3000/menu?email=info@mail.com
```

**Response:**

- JSON, representing a user's object

Example response payload

```json
[
  {
    "id": 1,
    "category": "pizza",
    "name": "Korrida",
    "price": 750,
    "currency": "Eur",
    "size": 35,
    "size-units": "cm",
    "composition": [
      "Branded Brothers Sauce",
      "Gouda Cheese",
      "Mozarella Cheese",
      "Red Onions",
      "Fresh Tomatoes",
      "Jamon Serrano Spanish Spicy Ham",
      "Green Olives with Anchovies",
      "Garlic Olive Seasoning",
      "Italian Spice Blend"
    ]
  }
]
```

---

## Author

Rimantas: [Github](https://github.com/belauzas), [Linkedin](https://www.linkedin.com/in/rimantasbelovas/)
