const baseConfig = require('../base.config');

module.exports = {
    ...baseConfig,
    eslintrc: {
        ...baseConfig.eslintrc,
        extends: ['plugin:unicorn/all'],
    },
};
