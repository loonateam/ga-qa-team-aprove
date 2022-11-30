import { info } from '@actions/core';
import { getOctokit, context } from '@actions/github';

import type { Input } from './types';

const run = async (input: Input) => {
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

    const approvesFromRequiredUser = reviews.data.filter((review) => {
      const isApprovedState = review.state.toLowerCase() === 'approved';
      const isRequiredUser = users.includes(review.user.login);
      info(`Is approved state: ${review.state.toLowerCase()} === 'approved': ${isApprovedState}`);
      info(`Is requiredUser: ${review.user.login} includes: ${isRequiredUser}`);

      return isApprovedState && isRequiredUser;
    });

    info(`ApprovesFromRequiredUser: ${JSON.stringify(approvesFromRequiredUser, null, 2)}`);

    if (approvesFromRequiredUser.length) {
      const usersWhoApproved = approvesFromRequiredUser.map((reivew) => reivew.user.login).join(', ');

      info(`Users from ${requiredUsers} who approved pr: ${usersWhoApproved}`);

      return usersWhoApproved;
    } else {
      return '';
    }
  } catch (err) {
    info(`Error: ${err.message}`);
    return '';
  }
};

const Main = {
  run,
};

export default Main;
