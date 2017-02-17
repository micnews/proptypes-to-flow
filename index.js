/* @flow */
const { readFileSync, writeFileSync } = require('fs');
const deglob = require('deglob');
const { join } = require('path');

deglob(process.argv.slice(2), (err, filenames) => {
  if (err) {
    throw err;
  }

  filenames.forEach(filename => {
    const file = readFileSync(filename, 'utf8');

    if (file.includes('@flow')) {
      return;
    }

    const changedFile = file
      .replace(/PropTypes\.object\.isRequired/g, 'Object')
      .replace(/: PropTypes\.object\.isRequired/g, '?: Object')
      .replace(/PropTypes\.string\.isRequired/g, 'string')
      .replace(/: PropTypes\.string\.isRequired/g, '?: string')
      .replace(/PropTypes\.bool\.isRequired/g, 'boolean')
      .replace(/: PropTypes\.bool\.isRequired/g, '?: boolean')
      .replace(/PropTypes\.number\.isRequired/g, 'number')
      .replace(/: PropTypes\.number\.isRequired/g, '?: number')
      .replace(', { PropTypes }', '')
      .replace('const propTypes', 'type Props')
      .replace(/.+propTypes \= propTypes;\n/, '')

    writeFileSync(
      filename,
      `/* @flow */\n${changedFile}`
    );
  });
});

