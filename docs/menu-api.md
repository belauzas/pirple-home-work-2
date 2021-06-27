# Menu API

Endpoint: /menu (http://localhost:3000/menu)

Available request methods: GET

## [GET] http://localhost:3000/menu?email={userEmail}

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
