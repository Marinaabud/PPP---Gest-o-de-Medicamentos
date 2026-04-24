const request = require('supertest');
const { expect } = require('chai');

const app = require('../../src/app');

describe('Docs endpoints', () => {
  it('deve retornar o swagger em JSON', async () => {
    const response = await request(app).get('/docs/json');

    expect(response.status).to.equal(200);
    expect(response.body.openapi).to.equal('3.0.3');
    expect(response.body.paths['/auth/login']).to.be.an('object');
  });

  it('deve renderizar a interface do swagger', async () => {
    const response = await request(app).get('/docs');

    expect([301, 302, 200]).to.include(response.status);
  });
});
