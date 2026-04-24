const { database } = require('./database');

function calculateEndDate(startDate, durationValue, durationUnit) {
  const date = new Date(startDate);

  if (durationUnit === 'dias') {
    date.setDate(date.getDate() + durationValue);
  } else {
    date.setMonth(date.getMonth() + durationValue);
  }

  return date.toISOString();
}

function syncStatus(medication) {
  if (medication.status === 'finalizado') {
    return medication;
  }

  const now = new Date();
  const endDate = new Date(medication.endDate);

  if (now > endDate) {
    medication.status = 'finalizado';
    medication.finishedAt = medication.finishedAt || now.toISOString();
  }

  return medication;
}

function normalizeMedication(medication) {
  return syncStatus({ ...medication });
}

function create(userId, payload) {
  const medication = {
    id: String(database.counters.medications++),
    userId: String(userId),
    name: String(payload.name).trim(),
    dosageAmount: payload.dosageAmount,
    dosageUnit: payload.dosageUnit,
    scheduleTimes: payload.scheduleTimes,
    durationValue: payload.durationValue,
    durationUnit: payload.durationUnit,
    startDate: payload.startDate,
    endDate: calculateEndDate(payload.startDate, payload.durationValue, payload.durationUnit),
    notes: payload.notes || '',
    status: 'em_uso',
    finishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  database.medications.push(medication);
  return normalizeMedication(medication);
}

function listByUser(userId, status) {
  return database.medications
    .filter((medication) => medication.userId === String(userId))
    .map((medication) => syncStatus(medication))
    .filter((medication) => !status || medication.status === status)
    .map((medication) => ({ ...medication }));
}

function findInternal(userId, medicationId) {
  const medication = database.medications.find(
    (item) => item.userId === String(userId) && item.id === String(medicationId)
  );

  return medication ? syncStatus(medication) : null;
}

function findById(userId, medicationId) {
  const medication = findInternal(userId, medicationId);
  return medication ? { ...medication } : null;
}

function update(userId, medicationId, payload) {
  const medication = database.medications.find(
    (item) => item.userId === String(userId) && item.id === String(medicationId)
  );

  if (!medication) {
    return null;
  }

  Object.assign(medication, payload);

  if (payload.name !== undefined) {
    medication.name = String(payload.name).trim();
  }

  if (payload.startDate || payload.durationValue || payload.durationUnit) {
    medication.endDate = calculateEndDate(
      medication.startDate,
      medication.durationValue,
      medication.durationUnit
    );
    if (medication.status !== 'finalizado') {
      medication.finishedAt = null;
      medication.status = 'em_uso';
    }
  }

  medication.updatedAt = new Date().toISOString();
  return normalizeMedication(medication);
}

function updateStatus(userId, medicationId, status) {
  const medication = database.medications.find(
    (item) => item.userId === String(userId) && item.id === String(medicationId)
  );

  if (!medication) {
    return null;
  }

  medication.status = status;
  medication.finishedAt = status === 'finalizado' ? new Date().toISOString() : null;
  medication.updatedAt = new Date().toISOString();

  return normalizeMedication(medication);
}

function remove(userId, medicationId) {
  const index = database.medications.findIndex(
    (item) => item.userId === String(userId) && item.id === String(medicationId)
  );

  if (index === -1) {
    return false;
  }

  database.medications.splice(index, 1);
  return true;
}

module.exports = {
  create,
  findById,
  listByUser,
  remove,
  update,
  updateStatus
};
