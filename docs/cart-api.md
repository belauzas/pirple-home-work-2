# Cart API

Endpoint: /cart (http://localhost:3000/cart)

Available request methods: POST, GET, PUT, DELETE

## [POST] http://localhost:3000/cart

**Requires:**

- authentication token in header
- JSON payload, representing a cart's object with user's email and an array of items to purchase (itemID and amount)

Example request payload

```json
{
  "email": "info@mail.com",
  "items": [
    {
      "id": 1,
      "amount": 1
    },
    {
      "id": 3,
      "amount": 2
    }
  ]
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

## [GET] http://localhost:3000/cart?email={userEmail}

**Requires:**

- authentication token in header
- url param _email_

Example request

```
Headers
token: kj4sexzzmzkkqp7ots0p

URL
http://localhost:3000/cart?email=info@mail.com
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

## [PUT] http://localhost:3000/cart

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

## [DELETE] http://localhost:3000/cart?email={userEmail}

**Requires:**

- authentication token in header
- url param _email_

Example request

```
Headers
token: kj4sexzzmzkkqp7ots0p

URL
http://localhost:3000/cart?email=info@mail.com
```

**Response:**

- JSON object, representing response message

Example response payload

```json
{
  "success": "User has been deleted"
}
```
