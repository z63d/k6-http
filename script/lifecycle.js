import { sleep, group, check } from 'k6';
import http from 'k6/http';

const conf = {
  baseURL: __ENV.BASE_URL || 'https://test-api.k6.io',
};

export const options = {
  vus: 2,
  duration: '2s',
  discardResponseBodies: true,
};

console.log('lifecycle: init');

export function setup() {
  console.log('lifecycle: setup');
}

export default function () {
  console.log('lifecycle: vu code');

  const { baseURL } = conf;

  let res;

  group('group1', function () {
    res = http.get(`${baseURL}/public/crocodiles/`);

    check(res, {
      'get /my/crocodiles/': (r) => r.status === 200,
    });
  });

  sleep(1);
}

export function teardown() {
  console.log('lifecycle: teardown');
}
