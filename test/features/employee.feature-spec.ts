import { describeFeature, loadFeature } from '@amiceli/vitest-cucumber';
import { createURLCodec } from '@rapiq/codec-url';
import { defineQuery, gt, lt, and } from '@rapiq/core';
import { e2e } from 'pactum';

const feature = await loadFeature('./employee.feature');
const codec = createURLCodec();

describeFeature(feature, ({ Scenario, ScenarioOutline, AfterAllScenarios }) => {
  const testFeature = e2e(feature.name);

  AfterAllScenarios(async () => {
    await testFeature.cleanup();
  });

  Scenario('Create a new employee', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Create a new employee');
    const step = testScenario.spec();

    Given('I make a POST request to /employee', () => {
      step
        .post('/employee')
        .stores('employeeId', '.id')
        .clean()
        .delete('/employee/$S{employeeId}');
    });

    And('I set the first name to {string}', (_, firstName: string) => {
      step.withForm('firstName', firstName);
    });

    And('I set the last name to {string}', (_, lastName: string) => {
      step.withForm('lastName', lastName);
    });

    And('I set the title to {string}', (_, title: string) => {
      step.withForm('title', title);
    });

    And(
      'I set the title of courtesy to {string}',
      (_, titleOfCourtesy: string) => {
        step.withForm('titleOfCourtesy', titleOfCourtesy);
      },
    );

    And('I set the address to {string}', (_, address: string) => {
      step.withForm('address', address);
    });

    And('I set the city to {string}', (_, city: string) => {
      step.withForm('city', city);
    });

    And('I set the country to {string}', (_, country: string) => {
      step.withForm('country', country);
    });

    When('I receive the created employee response', async () => {
      await step.toss();
    });

    Then(
      'I expect the response status should be {number}',
      (_, code: number) => {
        step.expectStatus(code);
      },
    );

    And(
      'I expect the response should have a {header} header with {string}',
      (_, header: string, value: string) => {
        step.expectHeaderContains(header, value);
      },
    );

    And(
      'I expect the new employee should be a JSON like',
      async (_, jsonLike: string) => {
        step.expectJsonLike(JSON.parse(jsonLike));
      },
    );
  });

  Scenario('Update an employee', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('Update an employee');
    const step = testScenario.spec();

    Given('I make a PATCH request to /employee/:id', () => {
      step
        .patch('/employee/{employeeId}')
        .withPathParams('employeeId', '$S{employeeId}');
    });

    And('I set the new extension to {number}', (_, extension: number) => {
      step.withForm('extension', extension.toString());
    });

    When('I receive the response', async () => {
      await step.toss();
    });

    Then('I expect the response status should be {number}', (_, code) => {
      step.expectStatus(code);
    });

    And(
      'I expect the response should have a {header} header with {string}',
      (_, header: string, value: string) => {
        step.expectHeaderContains(header, value);
      },
    );

    And(
      'I expect the employee extension should be: {number}',
      (_, extension: number) => {
        step.expectJson('extension', extension.toString());
      },
    );
  });

  Scenario('List the employees', ({ And, Given, Then, When }) => {
    const testScenario = testFeature.step('List the employees');
    const step = testScenario.spec();

    Given('I make a GET request to /employee', () => {
      step.get('/employee');
    });

    And('I set the limit to {number}', (_, limit: number) => {
      const query = defineQuery({ pagination: { limit } });

      step.withQueryParams(codec.encode(query)!);
    });

    When('I receive the response with a list of employees', async () => {
      await step.toss();
    });

    Then('I expect the response should be valid', () => {
      step
        .expectStatus(200)
        .expectHeaderContains('content-type', 'application/json');
    });

    And('I expect the list should match the schema', (_, schema: string) => {
      step.expectJsonSchema(JSON.parse(schema));
    });
  });

  Scenario(
    'Filter the employees hired between January 1st, 1993 and December 31th, 1993',
    ({ And, Given, Then, When }) => {
      const testScenario = testFeature.step('Filter the employees');
      const step = testScenario.spec();

      Given('I make a GET request to /employee', () => {
        step.get('/employee');
      });

      And(
        'I filter the hire date to be greater than 1993-01-01 and lower than 1993-12-31',
        () => {
          const query = defineQuery({
            filters: and(
              gt('hireDate', '1993-01-01'),
              lt('hireDate', '1993-12-31'),
            ),
          });

          step.withQueryParams(codec.encode(query)!);
        },
      );

      When('I receive the response', async () => {
        await step.toss();
      });

      Then('I expect the response should be valid', () => {
        step
          .expectStatus(200)
          .expectHeaderContains('content-type', 'application/json');
      });

      And(
        'I expect the number of employees matched should be {number}',
        (_, itemCount: number) => {
          step.expectJson('meta.itemCount', itemCount);
        },
      );
    },
  );

  ScenarioOutline(
    'Get an employee by id',
    ({ And, Given, Then, When }, variables) => {
      const testScenario = testFeature.step('Get an employee by id');
      const step = testScenario.spec();

      Given('I make a GET request to /employee/<id>', () => {
        step
          .get('/employee/{employeeId}')
          .withPathParams('employeeId', variables.id);
      });

      When('I receive the response', async () => {
        await step.toss();
      });

      Then(
        'I expect the response status should be {number}',
        (_, code: number) => {
          step.expectStatus(code);
        },
      );

      And(
        'I expect the response should have a {header} header with {string}',
        (_, header: string, value: string) => {
          step.expectHeaderContains(header, value);
        },
      );

      And(
        'I expect the firstName of the employee should be: <firstName>',
        () => {
          step.expectJson('firstName', variables.firstName);
        },
      );

      And('I expect the lastName of the employee should be: <lastName>', () => {
        step.expectJson('lastName', variables.lastName);
      });

      And('I expect the title of the employee should be: <title>', () => {
        step.expectJson('title', variables.title);
      });

      And(
        'I expect the title of courtesy of the employee should be: <titleOfCourtesy>',
        () => {
          step.expectJson('titleOfCourtesy', variables.titleOfCourtesy);
        },
      );

      And(
        'I expect the birth date of the employee should be: <birthDate>',
        () => {
          step.expectJson('birthDate', variables.birthDate);
        },
      );

      And(
        'I expect the hire date of the employee should be: <hireDate>',
        () => {
          step.expectJson('hireDate', variables.hireDate);
        },
      );

      And('I expect the address of the employee should be: <address>', () => {
        step.expectJson('address', variables.address);
      });

      And('I expect the city of the employee should be: <city>', () => {
        step.expectJson('city', variables.city);
      });

      And('I expect the region of the employee should be: <region>', () => {
        step.expectJson('region', variables.region);
      });

      And(
        'I expect the postal code of the employee should be: <postalCode>',
        () => {
          step.expectJson('postalCode', variables.postalCode);
        },
      );

      And('I expect the country of the employee should be: <country>', () => {
        step.expectJson('country', variables.country);
      });

      And(
        'I expect the home phone of the employee should be: <homePhone>',
        () => {
          step.expectJson('homePhone', variables.homePhone);
        },
      );

      And(
        'I expect the extension of the employee should be: <extension>',
        () => {
          step.expectJson('extension', variables.extension);
        },
      );

      And('I expect the photo of the employee should be: <photo>', () => {
        step.expectJson('photo', variables.photo);
      });

      And('I expect the notes of the employee should be: <notes>', () => {
        step.expectJson('notes', variables.notes);
      });

      And('I expect the employee reports to should be: <reportsTo>', () => {
        step.expectJson('reportsTo', variables.reportsTo);
      });

      And('I expect the list should match the schema', (_, schema: string) => {
        step.expectJsonSchema(JSON.parse(schema));
      });
    },
  );
});
