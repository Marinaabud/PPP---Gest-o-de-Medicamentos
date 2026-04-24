const medicationModel = require('../models/medicationModel');

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeUnit(value, allowed, fieldName) {
  if (!value) {
    throw createError(400, `O campo ${fieldName} e obrigatorio`);
  }

  if (!allowed.includes(value)) {
    throw createError(400, `Valor invalido para ${fieldName}`);
  }

  return value;
}

function validatePayload(payload, isPartial = false) {
  const {
    name,
    dosageAmount,
    dosageUnit,
    scheduleTimes,
    durationValue,
    durationUnit,
    startDate
  } = payload;

  if (!isPartial || name !== undefined) {
    if (!name || !String(name).trim()) {
      throw createError(400, 'O nome do medicamento e obrigatorio');
    }
  }

  if (!isPartial || dosageAmount !== undefined) {
    if (typeof dosageAmount !== 'number' || dosageAmount <= 0) {
      throw createError(400, 'A quantidade da dosagem deve ser um numero maior que zero');
    }
  }

  if (!isPartial || dosageUnit !== undefined) {
    normalizeUnit(dosageUnit, ['capsula', 'gota', 'ml', 'comprimido', 'outro'], 'dosageUnit');
  }

  if (!isPartial || scheduleTimes !== undefined) {
    if (!Array.isArray(scheduleTimes) || scheduleTimes.length === 0) {
      throw createError(400, 'Informe ao menos um horario para o medicamento');
    }

    const invalidTime = scheduleTimes.some((time) => !/^\d{2}:\d{2}$/.test(time));
    if (invalidTime) {
      throw createError(400, 'Os horarios devem seguir o formato HH:MM');
    }
  }

  if (!isPartial || durationValue !== undefined) {
    if (typeof durationValue !== 'number' || durationValue <= 0) {
      throw createError(400, 'A duracao deve ser um numero maior que zero');
    }
  }

  if (!isPartial || durationUnit !== undefined) {
    normalizeUnit(durationUnit, ['dias', 'meses'], 'durationUnit');
  }

  if (!isPartial || startDate !== undefined) {
    const parsed = new Date(startDate);
    if (!startDate || Number.isNaN(parsed.getTime())) {
      throw createError(400, 'A data de inicio deve ser valida');
    }
  }
}

function create(userId, payload) {
  validatePayload(payload);
  return medicationModel.create(userId, payload);
}

function list(userId, status) {
  if (status && !['em_uso', 'finalizado'].includes(status)) {
    throw createError(400, 'Filtro de status invalido');
  }

  return medicationModel.listByUser(userId, status);
}

function getById(userId, medicationId) {
  const medication = medicationModel.findById(userId, medicationId);

  if (!medication) {
    throw createError(404, 'Medicamento nao encontrado');
  }

  return medication;
}

function update(userId, medicationId, payload) {
  validatePayload(payload, true);

  const medication = medicationModel.update(userId, medicationId, payload);

  if (!medication) {
    throw createError(404, 'Medicamento nao encontrado');
  }

  return medication;
}

function updateStatus(userId, medicationId, status) {
  if (!status) {
    throw createError(400, 'O status e obrigatorio');
  }

  if (!['em_uso', 'finalizado'].includes(status)) {
    throw createError(400, 'Status invalido');
  }

  const medication = medicationModel.updateStatus(userId, medicationId, status);

  if (!medication) {
    throw createError(404, 'Medicamento nao encontrado');
  }

  return medication;
}

function remove(userId, medicationId) {
  const deleted = medicationModel.remove(userId, medicationId);

  if (!deleted) {
    throw createError(404, 'Medicamento nao encontrado');
  }
}

module.exports = {
  create,
  getById,
  list,
  remove,
  update,
  updateStatus
};
