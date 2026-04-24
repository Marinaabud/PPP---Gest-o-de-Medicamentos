const request = require('supertest');
const { expect } = require('chai');

const app = require('../../src/app');

async function createAuthenticatedUser() {
  const response = await request(app)
    .post('/auth/register')
    .send({
      name: 'Marina Paiva',
      email: 'marina@email.com',
      password: '123456'
    });

  return response.body.data.token;
}

describe('Medication endpoints', () => {
  it('deve bloquear acesso sem token', async () => {
    const response = await request(app).get('/medications');

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Token nao informado');
  });

  it('deve cadastrar e listar um medicamento em uso', async () => {
    const token = await createAuthenticatedUser();

    const createResponse = await request(app)
      .post('/medications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Amoxicilina',
        dosageAmount: 1,
        dosageUnit: 'capsula',
        scheduleTimes: ['08:00', '20:00'],
        durationValue: 7,
        durationUnit: 'dias',
        startDate: '2026-04-23',
        notes: 'Tomar apos refeicao'
      });

    expect(createResponse.status).to.equal(201);
    expect(createResponse.body.data.status).to.equal('em_uso');

    const listResponse = await request(app)
      .get('/medications?status=em_uso')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).to.equal(200);
    expect(listResponse.body.data).to.have.lengthOf(1);
    expect(listResponse.body.data[0].name).to.equal('Amoxicilina');
  });

  it('deve atualizar o status para finalizado', async () => {
    const token = await createAuthenticatedUser();

    const createResponse = await request(app)
      .post('/medications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Vitamina D',
        dosageAmount: 10,
        dosageUnit: 'gota',
        scheduleTimes: ['09:00'],
        durationValue: 3,
        durationUnit: 'meses',
        startDate: '2026-04-23'
      });

    const medicationId = createResponse.body.data.id;

    const response = await request(app)
      .patch(`/medications/${medicationId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'finalizado' });

    expect(response.status).to.equal(200);
    expect(response.body.data.status).to.equal('finalizado');
    expect(response.body.data.finishedAt).to.be.a('string');
  });

  it('deve editar um medicamento existente', async () => {
    const token = await createAuthenticatedUser();

    const createResponse = await request(app)
      .post('/medications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Alergimed',
        dosageAmount: 5,
        dosageUnit: 'ml',
        scheduleTimes: ['14:00'],
        durationValue: 10,
        durationUnit: 'dias',
        startDate: '2026-04-23'
      });

    const medicationId = createResponse.body.data.id;

    const response = await request(app)
      .put(`/medications/${medicationId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        scheduleTimes: ['14:00', '22:00'],
        notes: 'Agitar antes de usar'
      });

    expect(response.status).to.equal(200);
    expect(response.body.data.scheduleTimes).to.deep.equal(['14:00', '22:00']);
    expect(response.body.data.notes).to.equal('Agitar antes de usar');
  });

  it('deve remover um medicamento existente', async () => {
    const token = await createAuthenticatedUser();

    const createResponse = await request(app)
      .post('/medications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Paracetamol',
        dosageAmount: 1,
        dosageUnit: 'comprimido',
        scheduleTimes: ['10:00'],
        durationValue: 5,
        durationUnit: 'dias',
        startDate: '2026-04-23'
      });

    const medicationId = createResponse.body.data.id;

    const deleteResponse = await request(app)
      .delete(`/medications/${medicationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteResponse.status).to.equal(200);

    const getResponse = await request(app)
      .get(`/medications/${medicationId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getResponse.status).to.equal(404);
  });
});
