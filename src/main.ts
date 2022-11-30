import { info } from '@actions/core';
import { getOctokit, context } from '@actions/github';

import type { Input } from './types';

const run = async (input: Input) => {
  // info(`context: ${JSON.stringify(context)}`);
  const { githubToken, requiredUsers } = input;
  const users = requiredUsers.split(',');

  info(`RequiredUsers ${requiredUsers}`);
  info(`SplittedRequiredUsers ${JSON.stringify(users)}`);

  if (!users.length) return '';

  const client = getOctokit(githubToken);

  try {
    const reviews = await client.rest.pulls.listReviews({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number,
    });

    info(`Reviews ${JSON.stringify(reviews, null, 2)}`);

    const approvesFromRequiredTeams = reviews.data.filter((review) => {
      const isApprovedState = review.state.toLowerCase() === 'approved';
      const isRequiredUser = users.includes(review.user.login);
      info(`Is approved state: ${review.state.toLowerCase()} === 'approved': ${isApprovedState}`);
      info(`Is requiredUser: ${review.user.login} includes: ${isRequiredUser}`);

      return isApprovedState && isRequiredUser;
    });

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
