import { getInput, setOutput } from '@actions/core';
import Main from './main';
import type { Input } from './types';

const input: Input = {
  githubToken: getInput('githubToken'),
  requiredUsers: getInput('requiredUsers'),
};

Main.run(input)
  .then((users) => {
    setOutput('users', users);
  })
  .catch(() => {
    setOutput('users', '');
  });
