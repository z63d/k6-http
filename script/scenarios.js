import { sleep, group, check } from 'k6';
import http from 'k6/http';

const conf = {
  baseURL: __ENV.BASE_URL || 'https://test-api.k6.io',
};

export const options = {
  // sample1, sample2 → sample3
  scenarios: {
    sample1: {
      executor: 'constant-vus',
      vus: 2,
      duration: '5s',
      exec: 'func1',
      tags: { test_tag: 'type1' },
    },
    sample2: {
      executor: 'shared-iterations',
      vus: 2,
      iterations: 4,
      maxDuration: '5s',
      exec: 'func2',
      tags: { test_tag: 'type2' },
      env: { TEST_ENV: 'test_env' },
    },
    sample3: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 3 },
        { duration: '5s', target: 0 },
      ],
      exec: 'func3',
      startTime: '5s',
      tags: { test_tag: 'type3' },
    },
  },
  thresholds: {
    checks: ['rate>0.9'],
    'http_req_failed{test_tag:type1}': ['rate<0.1'],
    'http_req_duration{test_tag:type2}': ['p(95)<1000', 'p(99)<2000'],
    'http_req_duration{scenario:sample3}': ['avg<500'],
    'group_duration{group:::group1}': ['avg < 500'],
  },
};

export function func1() {
  const { baseURL } = conf;

  let res;

  group('group1', function () {
    res = http.get(`${baseURL}/public/crocodiles/`);

    check(res, {
      'get /public/crocodiles/': (r) => r.status === 200,
    });
  });

  group('group2', function () {
    res = http.get(`${baseURL}/public/crocodiles/`);

    check(res, {
      'get /public/crocodiles/': (r) => r.status === 200,
    });
  });

  sleep(1);
}

export function func2() {
  console.log(__ENV.TEST_ENV);

  const { baseURL } = conf;

  let res;

  group('group1', function () {
    res = http.get(`${baseURL}/public/crocodiles/`);

    check(res, {
      'get /public/crocodiles/': (r) => r.status === 200,
    });
  });

  sleep(1);
}

export function func3() {
  const { baseURL } = conf;

  let res;

  group('group2', function () {
    res = http.get(`${baseURL}/public/crocodiles/`);

    check(res, {
      'get /public/crocodiles/': (r) => r.status === 200,
    });
  });

  sleep(1);
}
