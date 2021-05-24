function urlValidator(value, helpers) {
  if (/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm.test(value)) {
    return value;
  }
  return helpers.error('any.invalid');
}

module.exports = {
  urlValidator,
};
