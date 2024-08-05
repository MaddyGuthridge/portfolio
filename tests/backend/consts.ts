export const invalidGroupIds = [
  { id: ' /', case: 'Purely whitespace' },
  { id: 'hello=world', case: 'Non alphanumeric characters: "="' },
  { id: 'hello_world', case: 'Non alphanumeric characters: "_"' },
  { id: '.hello', case: 'Leading dot' },
  { id: 'hello.', case: 'Trailing dot' },
  { id: ' hello', case: 'Leading whitespace' },
  // Add a '/' at the end or fetch will trim it
  { id: 'hello /', case: 'Trailing whitespace' },
  { id: '-hello', case: 'Leading dash' },
  { id: 'hello-', case: 'Trailing dash' },
  { id: 'Hello', case: 'Capital letters' },
  { id: '🙃', case: 'Emoji' },
  { id: 'Español', case: 'Foreign characters' },
];

export const validGroupIds = [
  { id: 'hello', case: 'Basic' },
  { id: 'hello-world', case: 'Dashes' },
  { id: 'node.js', case: 'Dots in middle of string' },
];

export const invalidGroupNames = [
  { name: '', case: 'Empty string' },
  { name: 'Hello\tWorld', case: 'Illegal whitespace characters' },
  { name: ' ', case: 'Purely whitespace' },
  { name: ' Hello World', case: 'Leading whitespace characters' },
  { name: 'Hello World ', case: 'Trailing whitespace characters' },
];

export const validGroupNames = [
  { name: 'Hello World', case: 'Basic' },
  { name: 'OS/161', case: 'Slash' },
  { name: 'Wow! This is cool', case: 'Other punctuation' },
  { name: '🙃', case: 'Emoji' },
  { name: 'Español', case: 'Foreign characters' },
];
