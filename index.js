/* @flow */
const { readFileSync, writeFileSync } = require('fs');
const glob = require('glob');
const { join } = require('path');

const filenames = glob.sync(join(process.cwd(), process.argv[2]));

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
