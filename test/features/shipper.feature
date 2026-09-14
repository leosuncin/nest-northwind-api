Feature: CRUD of the shipper

  In order to add, edit and list shippers
  As a tester
  I want to make sure that everything works as expected

  Scenario: Create a new shipper
    Given I make a POST request to /shipper
    And   I set the company name to "Northwind Logistics"
    And   I set the phone to "(503) 5555-5555"
    When  I receive the created shipper response
    Then  I expect the response status should be 201
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the new shipper should be a JSON like
    """
    {
      "companyName": "Northwind Logistics",
      "phone": "(503) 5555-5555"
    }
    """

  Scenario: Update a shipper
    Given I make a PATCH request to /shipper/:id
    And   I set the new phone to "(503) 2222-1234"
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the shipper phone should be: "(503) 2222-1234"

  Scenario: List the shippers
    Given I make a GET request to /shipper
    And   I set the limit to 10
    When  I receive the response with a list of shippers
    Then  I expect the response should be valid
    And   I expect the list should match the schema
    ```
    {
      "$schema": "http://json-schema.org/draft-06/schema#",
      "$ref": "#/definitions/Shippers",
      "definitions": {
        "Shippers": {
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
          "title": "Shippers"
        },
        "Item": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": {
              "type": "string",
              "format": "integer"
            },
            "companyName": {
              "type": "string"
            },
            "phone": {
              "type": [
                "string",
                "null"
              ]
            }
          },
          "required": [
            "companyName",
            "id",
            "phone"
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

  Scenario Outline: Get a shipper by id
    Given I make a GET request to /shipper/<id>
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the company name of the shipper should be: <companyName>
    And   I expect the phone of the shipper should be: <phone>

  Examples:
    | id | companyName       | phone             |
    |----|-------------------|-------------------|
    | 1  | Speedy Express    | (503) 555-9831    |
    | 2  | United Package    | (503) 555-3199    |
    | 3  | Federal Shipping  | (503) 555-9931    |