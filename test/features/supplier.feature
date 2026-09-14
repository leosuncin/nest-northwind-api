Feature: CRUD of the supplier

  In order to add, edit and list suppliers
  As a tester
  I want to make sure that everything works as expected

  Scenario: Create a new supplier
    Given I make a POST request to /supplier
    And   I set the company name to "Northwind Traders"
    And   I set the contact name to "John Doe"
    And   I set the contact title to "Sales Manager"
    And   I set the address to "711 12th Ave"
    And   I set the city to "New York"
    And   I set the region to "NE"
    And   I set the postal code to "10019"
    And   I set the country to "USA"
    And   I set the phone to "(123) 555-0000"
    And   I set the fax to "(123) 222-0000"
    And   I set the home page to "https://northwind.trade"
    When  I receive the created supplier response
    Then  I expect the response status should be 201
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the new supplier should be a JSON like
    """
    {
      "companyName": "Northwind Traders",
      "contactName": "John Doe",
      "contactTitle": "Sales Manager",
      "address": "711 12th Ave",
      "city": "New York",
      "region": "NE",
      "country": "USA",
      "phone": "(123) 555-0000",
      "fax": "(123) 222-0000",
      "homePage": "https://northwind.trade"
    }
    """

  Scenario: Update a supplier
    Given I make a PATCH request to /supplier/:id
    And   I set the new contact title to "Procurement Manager"
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the supplier contact title should be: "Procurement Manager"

  Scenario: List the suppliers
    Given I make a GET request to /supplier
    And   I set the limit to 10
    When  I receive the response with a list of suppliers
    Then  I expect the response should be valid
    And   I expect the list should match the schema
    ```
    {
      "$schema": "http://json-schema.org/draft-06/schema#",
      "$ref": "#/definitions/Suppliers",
      "definitions": {
        "Suppliers": {
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
          "title": "Suppliers"
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
            },
            "homePage": {
              "type": [
                "string",
                "null"
              ]
            }
          },
          "required": [
            "address",
            "city",
            "companyName",
            "contactName",
            "contactTitle",
            "country",
            "fax",
            "homePage",
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

  Scenario: Filter the suppliers which contact title contains "sales" in it
    Given I make a GET request to /supplier
    And   I filter the contact title to contain "sales"
    When  I receive the response
    Then  I expect the response should be valid
    And   I expect the number of suppliers matched should be 11

  Scenario Outline: Get a supplier by id
    Given I make a GET request to /supplier/<id>
    When  I receive the response
    Then  I expect the response status should be 200
    And   I expect the response should have a content-type header with "application/json"
    And   I expect the company name of the supplier should be: <companyName>
    And   I expect the contact name of the supplier should be: <contactName>
    And   I expect the contact title of the supplier should be: <contactTitle>
    And   I expect the address of the supplier should be: <address>
    And   I expect the city of the supplier should be: <city>
    And   I expect the region of the supplier should be: <region>
    And   I expect the postal code of the supplier should be: <postalCode>
    And   I expect the country of the supplier should be: <country>
    And   I expect the phone of the supplier should be: <phone>
    And   I expect the fax of the supplier should be: <fax>
    And   I expect the home page of the supplier should be: <homePage>

  Examples:
    |  id | companyName                            | contactName                | contactTitle                 | address                                       | city          |  region  | postalCode |   country   |           phone |             fax |                                            homePage                                            |
    |   1 | Exotic Liquids                         | Charlotte Cooper           | Purchasing Manager           | 49 Gilbert St.                                | London        |          |    EC1 4SD |     UK      |  (171) 555-2222 |                 |                                                                                                |
    |   2 | New Orleans Cajun Delights             | Shelley Burke              | Order Administrator          | P.O. Box 78934                                | New Orleans   |    LA    |      70117 |     USA     |  (100) 555-4822 |                 |                                          #CAJUN.HTM#                                           |
    |   3 | Grandma Kelly's Homestead              | Regina Murphy              | Sales Representative         | 707 Oxford Rd.                                | Ann Arbor     |    MI    |      48104 |     USA     |  (313) 555-5735 |  (313) 555-3349 |                                                                                                |
    |   4 | Tokyo Traders                          | Yoshi Nagase               | Marketing Manager            | 9-8 Sekimai Musashino-shi                     | Tokyo         |          |        100 |    Japan    |  (03) 3555-5011 |                 |                                                                                                |
    |   5 | Cooperativa de Quesos 'Las Cabras'     | Antonio del Valle Saavedra | Export Administrator         | Calle del Rosal 4                             | Oviedo        | Asturias |      33007 |    Spain    |  (98) 598 76 54 |                 |                                                                                                |
    |   6 | Mayumi's                               | Mayumi Ohno                | Marketing Representative     | 92 Setsuko Chuo-ku                            | Osaka         |          |        545 |    Japan    |   (06) 431-7877 |                 |   Mayumi's (on the World Wide Web)#http://www.microsoft.com/accessdev/sampleapps/mayumi.htm#   |
    |   7 | Pavlova, Ltd.                          | Ian Devling                | Marketing Manager            | 74 Rose St. Moonie Ponds                      | Melbourne     | Victoria |       3058 |  Australia  |   (03) 444-2343 |   (03) 444-6588 |                                                                                                |
    |   8 | Specialty Biscuits, Ltd.               | Peter Wilson               | Sales Representative         | 29 King's Way                                 | Manchester    |          |    M14 GSD |     UK      |  (161) 555-4448 |                 |                                                                                                |
    |   9 | PB Knäckebröd AB                       | Lars Peterson              | Sales Agent                  | Kaloadagatan 13                               | Göteborg      |          |   S-345 67 |   Sweden    |   031-987 65 43 |   031-987 65 91 |                                                                                                |
    |  10 | Refrescos Americanas LTDA              | Carlos Diaz                | Marketing Manager            | Av. das Americanas 12.890                     | Sao Paulo     |          |       5442 |   Brazil    |   (11) 555 4640 |                 |                                                                                                |
    |  11 | Heli Süßwaren GmbH & Co. KG            | Petra Winkler              | Sales Manager                | Tiergartenstraße 5                            | Berlin        |          |      10785 |   Germany   |   (010) 9984510 |                 |                                                                                                |
    |  12 | Plutzer Lebensmittelgroßmärkte AG      | Martin Bein                | International Marketing Mgr. | Bogenallee 51                                 | Frankfurt     |          |      60439 |   Germany   |    (069) 992755 |                 |   Plutzer (on the World Wide Web)#http://www.microsoft.com/accessdev/sampleapps/plutzer.htm#   |
    |  13 | Nord-Ost-Fisch Handelsgesellschaft mbH | Sven Petersen              | Coordinator Foreign Markets  | Frahmredder 112a                              | Cuxhaven      |          |      27478 |   Germany   |    (04721) 8713 |    (04721) 8714 |                                                                                                |
    |  14 | Formaggi Fortini s.r.l.                | Elio Rossi                 | Sales Representative         | Viale Dante, 75                               | Ravenna       |          |      48100 |    Italy    |    (0544) 60323 |    (0544) 60603 |                                         #FORMAGGI.HTM#                                         |
    |  15 | Norske Meierier                        | Beate Vileid               | Marketing Manager            | Hatlevegen 5                                  | Sandvika      |          |       1320 |   Norway    |     (0)2-953010 |                 |                                                                                                |
    |  16 | Bigfoot Breweries                      | Cheryl Saylor              | regional Account Rep.        | 3400 - 8th Avenue Suite 210                   | Bend          |    OR    |      97101 |     USA     |  (503) 555-9931 |                 |                                                                                                |
    |  17 | Svensk Sjöföda AB                      | Michael Björn              | Sales Representative         | Brovallavägen 231                             | Stockholm     |          |   S-123 45 |   Sweden    |    08-123 45 67 |                 |                                                                                                |
    |  18 | Aux joyeux ecclésiastiques             | Guylène Nodier             | Sales Manager                | 203, Rue des Francs-Bourgeois                 | Paris         |          |      75004 |   France    | (1) 03.83.00.68 | (1) 03.83.00.62 |                                                                                                |
    |  19 | New England Seafood Cannery            | Robb Merchant              | Wholesale Account Agent      | Order Processing Dept. 2100 Paul Revere Blvd. | Boston        |    MA    |      02134 |     USA     |  (617) 555-3267 |  (617) 555-3389 |                                                                                                |
    |  20 | Leka Trading                           | Chandra Leka               | Owner                        | 471 Serangoon Loop, Suite #402              | Singapore     |          |       0512 |  Singapore  |        555-8787 |                 |                                                                                                |
    |  21 | Lyngbysild                             | Niels Petersen             | Sales Manager                | Lyngbysild Fiskebakken 10                     | Lyngby        |          |       2800 |   Denmark   |        43844108 |        43844115 |                                                                                                |
    |  22 | Zaanse Snoepfabriek                    | Dirk Luchte                | Accounting Manager           | Verkoop Rijnweg 22                            | Zaandam       |          |    9999 ZZ | Netherlands |    (12345) 1212 |    (12345) 1210 |                                                                                                |
    |  23 | Karkki Oy                              | Anne Heikkonen             | Product Manager              | Valtakatu 12                                  | Lappeenranta  |          |      53120 |   Finland   |     (953) 10956 |                 |                                                                                                |
    |  24 | G'day, Mate                            | Wendy Mackenzie            | Sales Representative         | 170 Prince Edward Parade Hunter's Hill        | Sydney        |   NSW    |       2042 |  Australia  |   (02) 555-5914 |   (02) 555-4873 | G'day Mate (on the World Wide Web)#http://www.microsoft.com/accessdev/sampleapps/gdaymate.htm# |
    |  25 | Ma Maison                              | Jean-Guy Lauzon            | Marketing Manager            | 2960 Rue St. Laurent                          | Montréal      |  Québec  |    H1J 1C3 |   Canada    |  (514) 555-9022 |                 |                                                                                                |
    |  26 | Pasta Buttini s.r.l.                   | Giovanni Giudici           | Order Administrator          | Via dei Gelsomini, 153                        | Salerno       |          |      84100 |    Italy    |   (089) 6547665 |   (089) 6547667 |                                                                                                |
    |  27 | Escargots Nouveaux                     | Marie Delamare             | Sales Manager                | 22, rue H. Voiron                             | Montceau      |          |      71300 |   France    |     85.57.00.07 |                 |                                                                                                |
    |  28 | Gai pâturage                           | Eliane Noz                 | Sales Representative         | Bat. B 3, rue des Alpes                       | Annecy        |          |      74000 |   France    |     38.76.98.06 |     38.76.98.58 |                                                                                                |
    |  29 | Forêts d'érables                       | Chantal Goulet             | Accounting Manager           | 148 rue Chasseur                              | Ste-Hyacinthe |  Québec  |    J2S 7S8 |   Canada    |  (514) 555-2955 |  (514) 555-2921 |                                                                                                |
