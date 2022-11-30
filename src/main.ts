import { info } from '@actions/core';
import { getOctokit, context } from '@actions/github';

import type { Input } from './types';

const run = async (input: Input) => {
  // info(`context: ${JSON.stringify(context)}`);
  const { githubToken, requiredUsers } = input;
  const users = requiredUsers.split(',');

  if (!users.length) return '';

  const client = getOctokit(githubToken);

  try {
    const reviews = await client.rest.pulls.listReviews({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number,
    });

    const approvesFromRequiredTeams = reviews.data.filter((review) => review.state.toLowerCase() === 'approved' && users.includes(review.user.login));

    if (!approvesFromRequiredTeams.length) {
      const usersWhoApproved = approvesFromRequiredTeams.map((reivew) => reivew.user.login).join(', ');

      info(`Users from ${requiredUsers} who approved pr: ${usersWhoApproved}`);

      return usersWhoApproved;
    } else {
      return '';
    }
  } catch (err) {
    info(err.message);
    return '';
  }
};

const Main = {
  run,
};

export default Main;
