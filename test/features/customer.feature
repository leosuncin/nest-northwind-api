Feature: CRUD of the customer

  In order to add, edit and list customers
  As a tester
  I want to make sure that everything works as expected

  Scenario: Create a new customer
    Given I make a POST request to /customer
    And   I set the code to "NWFTR"
    And   I set the company name to "Northwind Traders"
    And   I set the contact name to "Jane Doe"
    And   I set the contact title to "Sales Manager"
    And   I set the address to "123 Main St"
    And   I set the city to "New York"
    And   I set the postal code to "10019"
    And   I set the country to "USA"
    And   I set the phone to "(212) 555-1234"
    And   I set the fax to "(212) 555-4321"
    When  I receive the created customer response
    Then  I expect the response status should be 201
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the new customer should be a JSON like
    """
    {
      "code": "NWFTR",
      "companyName": "Northwind Traders",
      "contactName": "Jane Doe",
      "contactTitle": "Sales Manager",
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10019",
      "country": "USA",
      "phone": "(212) 555-1234",
      "fax": "(212) 555-4321"
    }
    """

  Scenario: Update a customer
    Given I make a PATCH request to /customer/:id
    And   I set the new phone to "(212) 555-9999"
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the customer phone should be: "(212) 555-9999"

  Scenario: List the customers
    Given I make a GET request to /customer
    And   I set the limit to 10
    When  I receive the response with a list of customers
    Then  I expect the response should be valid
    And   I expect the list should match the schema
    ```
    {
      "$schema": "http://json-schema.org/draft-06/schema#",
      "$ref": "#/definitions/Customers",
      "definitions": {
        "Customers": {
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
          "title": "Customers"
        },
        "Item": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": {
              "type": "string",
              "format": "integer"
            },
            "code": {
              "type": "string"
            },
            "companyName": {
              "type": "string"
            },
            "contactName": {
              "type": [
                "string",
                "null"
              ]
            },
            "contactTitle": {
              "type": [
                "string",
                "null"
              ]
            },
            "address": {
              "type": [
                "string",
                "null"
              ]
            },
            "city": {
              "type": [
                "string",
                "null"
              ]
            },
            "region": {
              "type": [
                "string",
                "null"
              ]
            },
            "postalCode": {
              "type": [
                "string",
                "null"
              ]
            },
            "country": {
              "type": [
                "string",
                "null"
              ]
            },
            "phone": {
              "type": [
                "string",
                "null"
              ]
            },
            "fax": {
              "type": [
                "string",
                "null"
              ]
            }
          },
          "required": [
            "address",
            "city",
            "code",
            "companyName",
            "contactName",
            "contactTitle",
            "country",
            "fax",
            "id",
            "phone",
            "postalCode",
            "region"
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

  Scenario: Filter the customers located in Germany
    Given I make a GET request to /customer
    And   I filter the country to be equal to "Germany"
    When  I receive the response
    Then  I expect the response should be valid
    And   I expect the number of customers matched should be 11

  Scenario Outline: Get a customer by id
    Given I make a GET request to /customer/<id>
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the code of the customer should be: <code>
    And   I expect the company name of the customer should be: <companyName>
    And   I expect the contact name of the customer should be: <contactName>
    And   I expect the contact title of the customer should be: <contactTitle>
    And   I expect the address of the customer should be: <address>
    And   I expect the city of the customer should be: <city>
    And   I expect the region of the customer should be: <region>
    And   I expect the postal code of the customer should be: <postalCode>
    And   I expect the country of the customer should be: <country>
    And   I expect the phone of the customer should be: <phone>
    And   I expect the fax of the customer should be: <fax>

  Examples:
    | id  | code  | companyName                       | contactName        | contactTitle                   | address                        | city          | region | postalCode | country | phone          | fax            |
    | 32  | GREAL | Great Lakes Food Market           | Howard Snyder      | Marketing Manager              | 2732 Baker Blvd.               | Eugene        |   OR   |   97403    |   USA   | (503) 555-7555 |                |
    | 36  | HUNGC | Hungry Coyote Import Store        | Yoshi Latimer      | Sales Representative           | City Center Plaza 516 Main St. | Elgin         |   OR   |   97827    |   USA   | (503) 555-6874 | (503) 555-2376 |
    | 43  | LAZYK | Lazy K Kountry Store              | John Steel         | Marketing Manager              | 12 Orchestra Terrace           | Walla Walla   |   WA   |   99362    |   USA   | (509) 555-7969 | (509) 555-6221 |
    | 45  | LETSS | Let's Stop N Shop                 | Jaime Yorres       | Owner                          | 87 Polk St. Suite 5            | San Francisco |   CA   |   94117    |   USA   | (415) 555-5938 |                |
    | 48  | LONEP | Lonesome Pine Restaurant          | Fran Wilson        | Sales Manager                  | 89 Chiaroscuro Rd.             | Portland      |   OR   |   97219    |   USA   | (503) 555-9573 | (503) 555-9646 |
    | 55  | OLDWO | Old World Delicatessen            | Rene Phillips      | Sales Representative           | 2743 Bering St.                | Anchorage     |   AK   |   99508    |   USA   | (907) 555-7584 | (907) 555-2880 |
    | 65  | RATTC | Rattlesnake Canyon Grocery        | Paula Wilson       | Assistant Sales Representative | 2817 Milton Dr.                | Albuquerque   |   NM   |   87110    |   USA   | (505) 555-5939 | (505) 555-3620 |
    | 71  | SAVEA | Save-a-lot Markets                | Jose Pavarotti     | Sales Representative           | 187 Suffolk Ln.                | Boise         |   ID   |   83720    |   USA   | (208) 555-8097 |                |
    | 75  | SPLIR | Split Rail Beer & Ale             | Art Braunschweiger | Sales Manager                  | P.O. Box 555                   | Lander        |   WY   |   82520    |   USA   | (307) 555-4680 | (307) 555-6525 |
    | 77  | THEBI | The Big Cheese                    | Liz Nixon          | Marketing Manager              | 89 Jefferson Way Suite 2       | Portland      |   OR   |   97201    |   USA   | (503) 555-3612 |                |
    | 78  | THECR | The Cracker Box                   | Liu Wong           | Marketing Assistant            | 55 Grizzly Peak Rd.            | Butte         |   MT   |   59801    |   USA   | (406) 555-5834 | (406) 555-8083 |
    | 82  | TRAIH | Trail's Head Gourmet Provisioners | Helvetius Nagy     | Sales Associate                | 722 DaVinci Blvd.              | Kirkland      |   WA   |   98034    |   USA   | (206) 555-8257 | (206) 555-2174 |
    | 89  | WHITC | White Clover Markets              | Karl Jablonski     | Owner                          | 305 - 14th Ave. S. Suite 3B    | Seattle       |   WA   |   98128    |   USA   | (206) 555-4112 | (206) 555-4115 |
