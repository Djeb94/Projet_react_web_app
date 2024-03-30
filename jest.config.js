module.exports = {
    transform: {
      '^.+\\.jsx?$': 'babel-jest'
    },
    transformIgnorePatterns: [
      '/node_modules/',
      '\\.(css|less|scss|sass)$'  // Ignore les fichiers CSS lors des tests
    ],
  };
  