const medicationService = require('../services/medicationService');

async function list(req, res, next) {
  try {
    const medications = medicationService.list(req.user.id, req.query.status);
    return res.status(200).json({
      message: 'Medicamentos listados com sucesso',
      data: medications
    });
  } catch (error) {
    return next(error);
  }
}

async function getById(req, res, next) {
  try {
    const medication = medicationService.getById(req.user.id, req.params.id);
    return res.status(200).json({
      message: 'Medicamento encontrado com sucesso',
      data: medication
    });
  } catch (error) {
    return next(error);
  }
}

async function create(req, res, next) {
  try {
    const medication = medicationService.create(req.user.id, req.body);
    return res.status(201).json({
      message: 'Medicamento cadastrado com sucesso',
      data: medication
    });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  try {
    const medication = medicationService.update(req.user.id, req.params.id, req.body);
    return res.status(200).json({
      message: 'Medicamento atualizado com sucesso',
      data: medication
    });
  } catch (error) {
    return next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const medication = medicationService.updateStatus(req.user.id, req.params.id, req.body.status);
    return res.status(200).json({
      message: 'Status do medicamento atualizado com sucesso',
      data: medication
    });
  } catch (error) {
    return next(error);
  }
}

async function remove(req, res, next) {
  try {
    medicationService.remove(req.user.id, req.params.id);
    return res.status(200).json({
      message: 'Medicamento removido com sucesso',
      data: null
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  updateStatus,
  remove
};
