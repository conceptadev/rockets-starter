function filterStringEnvVars(env) {
  return Object.fromEntries(
    Object.entries(env).filter(([, value]) => typeof value === 'string'),
  );
}

module.exports = {
  filterStringEnvVars,
};
