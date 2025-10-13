/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */

/**
 * Converts a camelCase string to snake_case.
 * @param {string} str - The input camelCase string.
 * @returns {string} The converted snake_case string.
 */
const camelToSnake = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();

/**
 * Converts keys of an object (and nested objects) to snake_case.
 * @param {Object} obj - The object to convert.
 * @returns {Object} The object with converted keys.
 */
const convertKeysToSnakeCase = (obj) => {
  if (!obj) return undefined;
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [camelToSnake(key), convertKeysToSnakeCase(value)])
    );
  }
  return obj;
};

/**
 * Renames keys in an object based on a provided exceptions mapping.
 * @param {Object} obj - The object to modify.
 * @param {Object<string, string>} exceptions - Mapping of old keys to new keys.
 */
const convertExceptions = (obj, exceptions) => {
  for (const [oldKey, newKey] of Object.entries(exceptions)) {
    if (oldKey in obj) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
  }
};

module.exports = { convertKeysToSnakeCase, convertExceptions };
