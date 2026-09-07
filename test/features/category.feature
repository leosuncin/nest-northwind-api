Feature: CRUD of the category

  In order to add, edit and list categories
  As a tester
  I want to make sure that everything works as expected

  Scenario: Create a new category
    Given I make a POST request to /category
    And I set the name to "Electronics"
    And I set the description to "Home appliances, entertaiment centers, etc."
    When  I receive the created category response
    Then  I expect the response status should be 201
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the new category should be a JSON like
    """
    {
      "name": "Electronics",
      "description": "Home appliances, entertaiment centers, etc.",
      "picture": null
    }
    """

  Scenario: Update a category
    Given I make a PATCH request to /category/:id
    And   I set the new name to "White goods"
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the category name should be: "White goods"

  Scenario: List the categories
    Given I make a GET request to /category
    And   I set the limit to 10
    When  I receive the response with a list of categories
    Then  I expect the response should be valid
    And   I expect the list should match the schema
    ```
    {
      "$schema": "http://json-schema.org/draft-06/schema#",
      "$ref": "#/definitions/Categories",
      "definitions": {
        "Categories": {
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
          "title": "Categories"
        },
        "Item": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": {
              "type": "string",
              "format": "integer"
            },
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "picture": {
              "type": [
                "string",
                "null"
              ]
            }
          },
          "required": [
            "description",
            "id",
            "name",
            "picture"
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

  Scenario Outline: Get a category by id
    Given I make a GET request to /category/<id>
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the name of the category should be: <name>
    And   I expect the description of the category should be: <description>

  Examples:
    | id | name           | description                                                |
    |----|----------------|------------------------------------------------------------|
    | 1  | Beverages      | Soft drinks, coffees, teas, beers, and ales                |
    | 2  | Condiments     | Sweet and savory sauces, relishes, spreads, and seasonings |
    | 3  | Confections    | Desserts, candies, and sweet breads                        |
    | 4  | Dairy Products | Cheeses                                                    |
    | 5  | Grains/Cereals | Breads, crackers, pasta, and cereal                        |
    | 6  | Meat/Poultry   | Prepared meats                                             |
    | 7  | Produce        | Dried fruit and bean curd                                  |
    | 8  | Seafood        | Seaweed and fish                                           |
