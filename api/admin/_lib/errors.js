function methodNotAllowed(res) {
  return res.status(405).json({ error: 'Method not allowed' });
}

function badRequest(res, message, details) {
  const body = { error: message || 'Bad request' };
  if (details) body.details = details;
  return res.status(400).json(body);
}

function notFound(res, entity = 'Resource') {
  return res.status(404).json({ error: `${entity} not found` });
}

function serverError(res, err) {
  console.error('Server error:', err);
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = { methodNotAllowed, badRequest, notFound, serverError };
