function success(res, message, data) {
  return res.status(200).json({ success: true, message, data });
}

function error(res, message, status = 500, details) {
  const payload = { success: false, message };
  if (details !== undefined) payload.details = details;
  return res.status(status).json(payload);
}

module.exports = { success, error };

