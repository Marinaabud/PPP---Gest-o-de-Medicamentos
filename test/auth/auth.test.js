const request = require('supertest');
const { expect } = require('chai');

const app = require('../../src/app');

describe('Auth endpoints', () => {
  it('deve registrar um usuario e retornar JWT', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'Marina Paiva',
        email: 'marina@email.com',
        password: '123456'
      });

    expect(response.status).to.equal(201);
    expect(response.body.data.user.email).to.equal('marina@email.com');
    expect(response.body.data.token).to.be.a('string');
  });

  it('deve impedir registro com e-mail duplicado', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Marina Paiva',
        email: 'marina@email.com',
        password: '123456'
      });

    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'Marina Paiva',
        email: 'marina@email.com',
        password: '123456'
      });

    expect(response.status).to.equal(409);
    expect(response.body.message).to.equal('Ja existe um usuario cadastrado com este e-mail');
  });

  it('deve realizar login com credenciais validas', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Marina Paiva',
        email: 'marina@email.com',
        password: '123456'
      });

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'marina@email.com',
        password: '123456'
      });

    expect(response.status).to.equal(200);
    expect(response.body.data.token).to.be.a('string');
  });

  it('deve rejeitar login com senha invalida', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Marina Paiva',
        email: 'marina@email.com',
        password: '123456'
      });

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'marina@email.com',
        password: '000000'
      });

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Credenciais invalidas');
  });
});
