# Tokens API

Endpoint: /tokens (http://localhost:3000/tokens)

Available request methods: POST, GET, PUT, DELETE

## [POST] http://localhost:3000/tokens

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

## [GET] http://localhost:3000/tokens?id={tokenID}

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

## [PUT] http://localhost:3000/tokens

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

## [DELETE] http://localhost:3000/tokens?id={tokenID}

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
