import { config } from './app.config.server';

describe('server app config', () => {
  it('merges server providers', () => {
    expect(config.providers.length).toBeGreaterThan(0);
  });
});
