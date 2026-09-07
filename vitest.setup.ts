import { defineParameterExpression } from '@amiceli/vitest-cucumber';
import { request } from 'pactum';

defineParameterExpression({
  name: 'header',
  regexp: /(?:content-type)/iu,
  transformer: (value) => value,
});

request.setBaseUrl(
  process.env.PACTUM_REQUEST_BASE_URL ?? 'http://localhost:3000',
);
