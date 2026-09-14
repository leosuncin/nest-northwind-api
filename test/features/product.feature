Feature: CRUD of the product

  In order to add, edit and list products
  As a tester
  I want to make sure that everything works as expected

  Scenario: Create a new product
    Given I make a POST request to /product
    And   I set the name to "Test Brew"
    And   I set the supplier to 1
    And   I set the category to 1
    And   I set the quantity per unit to "10 boxes"
    And   I set the unit price to 9.99
    And   I set the units in stock to 13
    When  I receive the created product response
    Then  I expect the response status should be 201
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the new product should be a JSON like
    """
    {
      "name": "Test Brew",
      "quantityPerUnit": "10 boxes",
      "unitPrice": 9.99,
      "unitsInStock": 13
    }
    """

  Scenario: Update a product
    Given I make a PATCH request to /product/:id
    And   I set the new units in stock to 5
    And   I set the new units on order to 8
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the product units in stock should be: 5
    And   I expect the product units on order should be: 8

  Scenario: List the products
    Given I make a GET request to /product
    And   I set the limit to 10
    When  I receive the response with a list of products
    Then  I expect the response should be valid
    And   I expect the list should match the schema
    ```
    {
      "$schema": "http://json-schema.org/draft-06/schema#",
      "$ref": "#/definitions/Products",
      "definitions": {
        "Products": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "items": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/Item"
              }
            },
            "meta": {
              "$ref": "#/definitions/Meta"
            }
          },
          "required": [
            "items",
            "meta"
          ],
          "title": "Products"
        },
        "Item": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "name": {
              "type": "string"
            },
            "quantityPerUnit": {
              "type": [
                "string",
                "null"
              ]
            },
            "unitPrice": {
              "type": "number"
            },
            "unitsInStock": {
              "type": "number"
            },
            "unitsOnOrder": {
              "type": "number"
            },
            "reorderLevel": {
              "type": "number"
            },
            "discontinued": {
              "type": "boolean"
            }
          },
          "required": [
            "discontinued",
            "name",
            "quantityPerUnit",
            "reorderLevel",
            "unitPrice",
            "unitsInStock",
            "unitsOnOrder"
          ],
          "title": "Item"
        },
        "Meta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "itemCount": {
              "type": "integer",
              "min": 0
            },
            "totalItems": {
              "type": "integer",
              "min": 0
            },
            "itemsPerPage": {
              "type": "integer",
              "min": 0
            },
            "totalPages": {
              "type": "integer",
              "min": 0
            },
            "currentPage": {
              "type": "integer",
              "min": 1
            },
            "hasNextPage": {
              "type": "boolean"
            },
            "hasPreviousPage": {
              "type": "boolean"
            }
          },
          "required": [
            "currentPage",
            "hasNextPage",
            "hasPreviousPage",
            "itemCount",
            "itemsPerPage",
            "totalItems",
            "totalPages"
          ],
          "title": "Meta"
        }
      }
    }
    ```

  Scenario: Filter the products with a unit price greater than 30
    Given I make a GET request to /product
    And   I filter the unit price to be greater than 30
    When  I receive the response
    Then  I expect the response should be valid
    And   I expect the number of products matched should be 24

  Scenario Outline: Get a product by id
    Given I make a GET request to /product/<id>
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the name of the product should be: <name>
    And   I expect the quantity per unit of the product should be: <quantityPerUnit>
    And   I expect the unit price of the product should be: <unitPrice>
    And   I expect the units in stock of the product should be: <unitsInStock>
    And   I expect the units on order of the product should be: <unitsOnOrder>
    And   I expect the reorder level of the product should be: <reorderLevel>
    And   I expect the discontinued of the product should be: <discontinued>

  Examples:
    | id  | name                      | quantityPerUnit     | unitPrice | unitsInStock | unitsOnOrder | reorderLevel | discontinued |
    | 2   | Chang                     | 24 - 12 oz bottles  |     19.00 |           17 |           40 |           25 |    false     |
    | 3   | Aniseed Syrup             | 12 - 550 ml bottles |     10.00 |           13 |           70 |           25 |    false     |
    | 11  | Queso Cabrales            | 1 kg pkg.           |     21.00 |           22 |           30 |           30 |    false     |
    | 21  | Sir Rodney's Scones       | 24 pkgs. x 4 pieces |     10.00 |            3 |           40 |            5 |    false     |
    | 32  | Mascarpone Fabioli        | 24 - 200 g pkgs.    |     32.00 |            9 |           40 |           25 |    false     |
    | 37  | Gravad lax                | 12 - 500 g pkgs.    |     26.00 |           11 |           50 |           25 |    false     |
    | 43  | Ipoh Coffee               | 16 - 500 g tins     |     46.00 |           17 |           10 |           25 |    false     |
    | 45  | Rogede sild               | 1k pkg.             |      9.50 |            5 |           70 |           15 |    false     |
    | 48  | Chocolade                 | 10 pkgs.            |     12.75 |           15 |           70 |           25 |    false     |
    | 49  | Maxilaku                  | 24 - 50 g pkgs.     |     20.00 |           10 |           60 |           15 |    false     |
    | 56  | Gnocchi di nonna Alice    | 24 - 250 g pkgs.    |     38.00 |           21 |           10 |           30 |    false     |
    | 64  | Wimmers gute Semmelknödel | 20 bags x 4 pieces  |     33.25 |           22 |           80 |           30 |    false     |
    | 66  | Louisiana Hot Spiced Okra | 24 - 8 oz jars      |     17.00 |            4 |          100 |           20 |    false     |
    | 68  | Scottish Longbreads       | 10 boxes x 8 pieces |      12.5 |            6 |           10 |           15 |    false     |
    | 70  | Outback Lager             | 24 - 355 ml bottles |     15.00 |           15 |           10 |           30 |    false     |
    | 74  | Longlife Tofu             | 5 kg pkg.           |     10.00 |            4 |           20 |            5 |    false     |
