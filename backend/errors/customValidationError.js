function urlValidator(value, helpers) {
  if (/^https?:\/\/(www\.)?(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,6}((\/|\?)[\w-.~:/?#[\]@!$&'()*+,;=]*)?$/.test(value)) {
    return value;
  }
  return helpers.error('any.invalid');
}

module.exports = {
  urlValidator,
};
