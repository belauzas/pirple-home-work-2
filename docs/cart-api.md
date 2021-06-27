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
    { "id": 1, "amount": 1 },
    { "id": 3, "amount": 2 }
  ]
}
```

**Response:**

- JSON, representing cart object

Example response payload

```json
{
  "id": "pmgm77y65fbw9bj9tg6j",
  "email": "info@mail.com",
  "items": [
    { "id": 1, "amount": 1 },
    { "id": 3, "amount": 2 }
  ]
}
```

## [GET] http://localhost:3000/cart?id={cartID}

**Requires:**

- authentication token in header
- url param _id_

Example request

```
Headers
token: kj4sexzzmzkkqp7ots0p

URL
http://localhost:3000/cart?id=pmgm77y65fbw9bj9tg6j
```

**Response:**

- JSON, representing a cart's object

Example response payload

```json
{
  "id": "pmgm77y65fbw9bj9tg6j",
  "email": "info@mail.com",
  "items": [
    { "id": 1, "amount": 1 },
    { "id": 3, "amount": 2 }
  ]
}
```

## [PUT] http://localhost:3000/cart

**Requires:**

- authentication token in header
- JSON payload, representing a cart's object with a fields to update

Example request payload

```
Headers
token: kj4sexzzmzkkqp7ots0p
```

```json
{
  "id": "pmgm77y65fbw9bj9tg6j",
  "items": [
    { "id": 1, "amount": 2 },
    { "id": 3, "amount": 2 },
    { "id": 4, "amount": 1 }
  ]
}
```

**Response:**

- JSON, representing updated cart object

Example response payload

```json
{
  "id": "pmgm77y65fbw9bj9tg6j",
  "email": "info@mail.com",
  "items": [
    { "id": 1, "amount": 2 },
    { "id": 3, "amount": 2 },
    { "id": 4, "amount": 1 }
  ]
}
```

## [DELETE] http://localhost:3000/cart?id={cartID}

**Requires:**

- authentication token in header
- url param _id_

Example request

```
Headers
token: kj4sexzzmzkkqp7ots0p

URL
http://localhost:3000/cart?id=pmgm77y65fbw9bj9tg6j
```

**Response:**

- JSON, representing response message

Example response payload

```json
{
  "success": "Cart has been deleted"
}
```
