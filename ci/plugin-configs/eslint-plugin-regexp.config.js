const baseConfig = require('../base.config');

module.exports = {
    ...baseConfig,
    eslintrc: {
        ...baseConfig.eslintrc,
        plugins: ['regexp'],
        rules: {
            'regexp/confusing-quantifier': 'error',
            'regexp/control-character-escape': 'error',
            'regexp/hexadecimal-escape': 'error',
            'regexp/letter-case': 'error',
            'regexp/match-any': 'error',
            'regexp/negation': 'error',
            'regexp/no-assertion-capturing-group': 'error',
            'regexp/no-dupe-characters-character-class': 'error',
            'regexp/no-dupe-disjunctions': 'error',
            'regexp/no-empty-alternative': 'error',
            'regexp/no-empty-group': 'error',
            'regexp/no-empty-lookarounds-assertion': 'error',
            'regexp/no-escape-backspace': 'error',
            'regexp/no-invisible-character': 'error',
            'regexp/no-lazy-ends': 'error',
            'regexp/no-legacy-features': 'error',
            'regexp/no-non-standard-flag': 'error',
            'regexp/no-obscure-range': 'error',
            'regexp/no-octal': 'error',
            'regexp/no-optional-assertion': 'error',
            'regexp/no-potentially-useless-backreference': 'error',
            'regexp/no-trivially-nested-assertion': 'error',
            'regexp/no-trivially-nested-quantifier': 'error',
            'regexp/no-unused-capturing-group': 'error',
            'regexp/no-useless-assertions': 'error',
            'regexp/no-useless-backreference': 'error',
            'regexp/no-useless-character-class': 'error',
            'regexp/no-useless-dollar-replacements': 'error',
            'regexp/no-useless-escape': 'error',
            'regexp/no-useless-exactly-quantifier': 'error',
            'regexp/no-useless-flag': 'error',
            'regexp/no-useless-non-capturing-group': 'error',
            'regexp/no-useless-non-greedy': 'error',
            'regexp/no-useless-range': 'error',
            'regexp/no-useless-two-nums-quantifier': 'error',
            'regexp/optimal-lookaround-quantifier': 'error',
            'regexp/order-in-character-class': 'error',
            'regexp/prefer-character-class': 'error',
            'regexp/prefer-d': 'error',
            'regexp/prefer-escape-replacement-dollar-char': 'error',
            'regexp/prefer-named-backreference': 'error',
            'regexp/prefer-plus-quantifier': 'error',
            'regexp/prefer-quantifier': 'error',
            'regexp/prefer-question-quantifier': 'error',
            'regexp/prefer-range': 'error',
            'regexp/prefer-regexp-exec': 'error',
            'regexp/prefer-regexp-test': 'error',
            'regexp/prefer-star-quantifier': 'error',
            'regexp/prefer-t': 'error',
            'regexp/prefer-unicode-codepoint-escapes': 'error',
            'regexp/prefer-w': 'error',
            'regexp/sort-flags': 'error',
            'regexp/unicode-escape': 'error',
        },
    },
};