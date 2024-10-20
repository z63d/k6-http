import { sleep, group, check, fail } from 'k6';
import http from 'k6/http';
import execution from 'k6/execution';

const conf = {
  baseURL: __ENV.BASE_URL || 'https://test-api.k6.io',
  username: 'user',
  password: 'test123!',
  // username: 'test_case',
  // password: '1234',
};

export const options = {
  scenarios: {
    scenario: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
    },
  },
};

export function setup() {
  const { baseURL, username, password } = conf;

  const res = http.post(`${baseURL}/auth/token/login/`, {
    username,
    password,
  });

  const checkOutput = check(res, {
    'login successful': (r) => r.status === 200,
    'access token is present': (r) => r.json('access') !== '',
  });

  if (!checkOutput) {
    fail('status code was not 200');
  }

  return {
    token: res.json('access'),
  };
}

export default function (data) {
  const { baseURL } = conf;

  let res, json;

  group('group1', function () {
    res = http.get(`${baseURL}/my/crocodiles/`, {
      headers: {
        authorization: `Bearer ${data.token}`,
      },
    });

    check(res, {
      'get /my/crocodiles/': (r) => r.status === 200,
    });

    json = res.json();
    const crocodileId = json[execution.scenario.iterationInTest].id;

    res = http.get(`${baseURL}/my/crocodiles/${crocodileId}/`, {
      headers: {
        authorization: `Bearer ${data.token}`,
      },
    });

    check(res, {
      'get /my/crocodiles/{id}/': (r) => r.status === 200,
    });

    res = http.put(
      `${baseURL}/my/crocodiles/${crocodileId}/`,
      {
        name: 'MK',
        sex: 'F',
        date_of_birth: '2002-12-19',
      },
      {
        headers: {
          authorization: `Bearer ${data.token}`,
        },
      }
    );

    check(res, {
      'put /my/crocodiles/{id}/': (r) => r.status === 200,
    });
  });

  sleep(1);
}
