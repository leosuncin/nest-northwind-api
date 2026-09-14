Feature: CRUD of the employee

  In order to add, edit and list employees
  As a tester
  I want to make sure that everything works as expected

  Scenario: Create a new employee
    Given I make a POST request to /employee
    And   I set the first name to "John"
    And   I set the last name to "Doe"
    And   I set the title to "Sales Manager"
    And   I set the title of courtesy to "Mr."
    And   I set the address to "Wall Street"
    And   I set the city to "New York"
    And   I set the country to "USA"
    When  I receive the created employee response
    Then  I expect the response status should be 201
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the new employee should be a JSON like
    """
    {
      "firstName": "John",
      "lastName": "Doe",
      "title": "Sales Manager",
      "titleOfCourtesy": "Mr.",
      "address": "Wall Street",
      "city": "New York",
      "country": "USA"
    }
    """

  Scenario: Update an employee
    Given I make a PATCH request to /employee/:id
    And   I set the new extension to 413
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the employee extension should be: 413

  Scenario: List the employees
    Given I make a GET request to /employee
    And   I set the limit to 10
    When  I receive the response with a list of employees
    Then  I expect the response should be valid
    And   I expect the list should match the schema
    ```
    {
      "$schema": "http://json-schema.org/draft-06/schema#",
      "$ref": "#/definitions/Employees",
      "definitions": {
        "Employees": {
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
          "title": "Employees"
        },
        "Item": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": {
              "type": "integer"
            },
            "firstName": {
              "type": "string"
            },
            "lastName": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "titleOfCourtesy": {
              "type": "string"
            },
            "birthDate": {
              "type": "string",
              "format": "date"
            },
            "hireDate": {
              "type": "string",
              "format": "date"
            },
            "address": {
              "type": "string"
            },
            "city": {
              "type": "string"
            },
            "region": {
              "type": ["string", "null"]
            },
            "postalCode": {
              "type": "string"
            },
            "country": {
              "type": "string"
            },
            "homePhone": {
              "type": "string"
            },
            "extension": {
              "type": "string",
              "format": "integer"
            },
            "photo": {
              "type": "string",
              "format": "uri",
              "qt-uri-protocols": [
                "http"
              ]
            },
            "notes": {
              "type": "string"
            },
            "reportsTo": {
              "type": ["integer", "null"]
            }
          },
          "required": [
            "firstName",
            "id",
            "lastName"
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

  Scenario: Filter the employees hired between January 1st, 1993 and December 31th, 1993
    Given I make a GET request to /employee
    And   I filter the hire date to be greater than 1993-01-01 and lower than 1993-12-31
    When  I receive the response
    Then  I expect the response should be valid
    And   I expect the number of employees matched should be 3

  Scenario Outline: Get an employee by id
    Given I make a GET request to /employee/<id>
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the firstName of the employee should be: <firstName>
    And   I expect the lastName of the employee should be: <lastName>
    And   I expect the title of the employee should be: <title>
    And   I expect the title of courtesy of the employee should be: <titleOfCourtesy>
    And   I expect the birth date of the employee should be: <birthDate>
    And   I expect the hire date of the employee should be: <hireDate>
    And   I expect the address of the employee should be: <address>
    And   I expect the city of the employee should be: <city>
    And   I expect the region of the employee should be: <region>
    And   I expect the postal code of the employee should be: <postalCode>
    And   I expect the country of the employee should be: <country>
    And   I expect the home phone of the employee should be: <homePhone>
    And   I expect the extension of the employee should be: <extension>
    And   I expect the photo of the employee should be: <photo>
    And   I expect the notes of the employee should be: <notes>
    And   I expect the employee reports to should be: <reportsTo>
    And   I expect the list should match the schema
    ```
    {
      "$schema": "http://json-schema.org/draft-06/schema#",
      "$ref": "#/definitions/Employee",
      "definitions": {
        "Employee": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "id": {
              "type": "integer"
            },
            "firstName": {
              "type": "string"
            },
            "lastName": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "titleOfCourtesy": {
              "type": "string"
            },
            "birthDate": {
              "type": "string",
              "format": "date"
            },
            "hireDate": {
              "type": "string",
              "format": "date"
            },
            "address": {
              "type": "string"
            },
            "city": {
              "type": "string"
            },
            "region": {
              "type": ["string", "null"]
            },
            "postalCode": {
              "type": "string"
            },
            "country": {
              "type": "string"
            },
            "homePhone": {
              "type": "string"
            },
            "extension": {
              "type": "string",
              "format": "integer"
            },
            "photo": {
              "type": "string",
              "format": "uri",
              "qt-uri-protocols": [
                "http"
              ]
            },
            "notes": {
              "type": "string"
            },
            "reportsTo": {
              "type": ["integer", "null"]
            }
          },
          "required": [
            "firstName",
            "id",
            "lastName"
          ],
          "title": "Item"
        }
      }
    }
    ```

  Examples:
    | id  | firstName | lastName  | title                    | titleOfCourtesy | birthDate  | hireDate   | address                       | city     | region | postalCode | country | homePhone      | extension | photo                                  | notes                                                                                                                                                                                                                                                                                                                                                                                                                                                         | reportsTo |
    | 1   | Nancy     | Davolio   | Sales Representative     | Ms.             | 1948-12-08 | 1992-05-01 | 507 - 20th Ave. E.Apt. 2A     | Seattle  | WA     | 98122      | USA     | (206) 555-9857 | 5467      | http://accweb/emmployees/davolio.bmp   | Education includes a BA in psychology from Colorado State University in 1970. She also completed «The Art of the Cold Call.» Nancy is a member of Toastmasters International.                                                                                                                                                                                                                                                                                 | 2         |
    | 2   | Andrew    | Fuller    | Vice President, Sales    | Dr.             | 1952-02-19 | 1992-08-14 | 908 W. Capital Way            | Tacoma   | WA     | 98401      | USA     | (206) 555-9482 | 3457      | http://accweb/emmployees/fuller.bmp    | Andrew received his BTS commercial in 1974 and a Ph.D. in international marketing from the University of Dallas in 1981. He is fluent in French and Italian and reads German. He joined the company as a sales representative, was promoted to sales manager in January 1992 and to vice president of sales in March 1993. Andrew is a member of the Sales Management Roundtable, the Seattle Chamber of Commerce, and the Pacific Rim Importers Association. |           |
    | 3   | Janet     | Leverling | Sales Representative     | Ms.             | 1963-08-30 | 1992-04-01 | 722 Moss Bay Blvd.            | Kirkland | WA     | 98033      | USA     | (206) 555-3412 | 3355      | http://accweb/emmployees/leverling.bmp | Janet has a BS degree in chemistry from Boston College (1984). She has also completed a certificate program in food retailing management. Janet was hired as a sales associate in 1991 and promoted to sales representative in February 1992.                                                                                                                                                                                                                 | 2         |
    | 4   | Margaret  | Peacock   | Sales Representative     | Mrs.            | 1937-09-19 | 1993-05-03 | 4110 Old Redmond Rd.          | Redmond  | WA     | 98052      | USA     | (206) 555-8122 | 5176      | http://accweb/emmployees/peacock.bmp   | Margaret holds a BA in English literature from Concordia College (1958) and an MA from the American Institute of Culinary Arts (1966). She was assigned to the London office temporarily from July through November 1992.                                                                                                                                                                                                                                     | 2         |
    | 5   | Steven    | Buchanan  | Sales Manager            | Mr.             | 1955-03-04 | 1993-10-17 | 14 Garrett Hill               | London   | null   | SW1 8JR    | UK      | (71) 555-4848  | 3453      | http://accweb/emmployees/buchanan.bmp  | Steven Buchanan graduated from St. Andrews University, Scotland, with a BSC degree in 1976. Upon joining the company as a sales representative in 1992, he spent 6 months in an orientation program at the Seattle office and then returned to his permanent post in London. He was promoted to sales manager in March 1993. Mr. Buchanan has completed the courses «Successful Telemarketing» and «International Sales Management.» He is fluent in French.  | 2         |
    | 6   | Michael   | Suyama    | Sales Representative     | Mr.             | 1963-07-02 | 1993-10-17 | Coventry House Miner Rd.      | London   | null   | EC2 7JR    | UK      | (71) 555-7773  | 428       | http://accweb/emmployees/davolio.bmp   | Michael is a graduate of Sussex University (MA, economics, 1983) and the University of California at Los Angeles (MBA, marketing, 1986). He has also taken the courses «Multi-Cultural Selling» and «Time Management for the Sales Professional.» He is fluent in Japanese and can read and write French, Portuguese, and Spanish.                                                                                                                            | 5         |
    | 7   | Robert    | King      | Sales Representative     | Mr.             | 1960-05-29 | 1994-01-02 | Edgeham Hollow Winchester Way | London   | null   | RG1 9SP    | UK      | (71) 555-5598  | 465       | http://accweb/emmployees/davolio.bmp   | Robert King served in the Peace Corps and traveled extensively before completing his degree in English at the University of Michigan in 1992, the year he joined the company. After completing a course entitled «Selling in Europe,» he was transferred to the London office in March 1993.                                                                                                                                                                  | 5         |
    | 8   | Laura     | Callahan  | Inside Sales Coordinator | Ms.             | 1958-01-09 | 1994-03-05 | 4726 - 11th Ave. N.E.         | Seattle  | WA     | 98105      | USA     | (206) 555-1189 | 2344      | http://accweb/emmployees/davolio.bmp   | Laura received a BA in psychology from the University of Washington. She has also completed a course in business French. She reads and writes French.                                                                                                                                                                                                                                                                                                         | 2         |
    | 9   | Anne      | Dodsworth | Sales Representative     | Ms.             | 1966-01-27 | 1994-11-15 | 7 Houndstooth Rd.             | London   |        | WG2 7LT    | UK      | (71) 555-4444  | 452       | http://accweb/emmployees/davolio.bmp   | Anne has a BA degree in English from St. Lawrence College. She is fluent in French and German.                                                                                                                                                                                                                                                                                                                                                                | 5         |
