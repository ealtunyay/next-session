import request from 'supertest';
import {
  nextBuild,
  startApp
} from '../next-test-utils';

const appDir = __dirname;
let server;
let app;
let agent;

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 30;

beforeAll(async () => {
  await nextBuild(appDir);
  app = {
    dir: appDir,
    dev: false,
    quiet: true
  };
  server = await startApp(app);
});

afterAll(() => server.close());

describe('Using API Routes', () => {
  beforeEach(() => {
    agent = request.agent(server);
  });

  it('withSession should create, persist, and remove session', async () => {
    let res;
    res = await agent.get('/api/with-session');
    expect(res.header).toHaveProperty('set-cookie');
    expect(res.text).toContain('1');
    res = await agent.get('/api/with-session');
    expect(res.header).not.toHaveProperty('set-cookie')
    expect(res.text).toContain('2');
    await agent.delete('/api/with-session');
    res = await agent.get('/api/apply-session');
    expect(res.text).toContain('1');
    expect(res.header).toHaveProperty('set-cookie');
  });

  it('applySession should create, persist, and remove session', async () => {
    let res;
    res = await agent.get('/api/apply-session');
    expect(res.header).toHaveProperty('set-cookie');
    expect(res.text).toContain('1');
    res = await agent.get('/api/apply-session');
    expect(res.header).not.toHaveProperty('set-cookie')
    expect(res.text).toContain('2');
    await agent.delete('/api/apply-session');
    res = await agent.get('/api/apply-session');
    expect(res.text).toBe('1');
    expect(res.header).toHaveProperty('set-cookie');
  });
});
