import { info } from '@actions/core';
import { getOctokit, context } from '@actions/github';

import type { Input, IsOnTeamParams } from './types';

const isOnTeam = async ({ client, author, teams }: IsOnTeamParams) => {
  for (const team of teams) {
    try {
      const response = await client.rest.teams.getMembershipForUserInOrg({
        org: context.payload.organization.login,
        team_slug: `@${team}`,
        username: author,
      });

      if (response.status == 200 && response.data.state != "pending") {
        return true;
      }
    } catch (error) {
      info(`Error when checking memebership for ${author} in ${team} team. Message: ${error.message}`);
    }
  }

  return false;
}

const run = async (input: Input) => {
  // info(`context: ${JSON.stringify(context)}`);
  const { githubToken, requiredTeams } = input;
  const teams = requiredTeams.split(',');

  if (!teams.length) return '';

  const client = getOctokit(githubToken);

  try {
    const teams = await client.rest.teams.list({
      org: context.payload.organization.login,
    })

    info(`Teams: ${JSON.stringify(teams)}`);
  } catch (err) {
    info(`Teams err: ${err.message}`);
  }

  try {
    const reviews = await client.rest.pulls.listReviews({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: context.payload.pull_request.number,
    });

    const approvesFromRequiredTeams = reviews.data.filter((review) => review.state.toLowerCase() === 'approved' && isOnTeam({ 
      client, 
      author: review.user.login, 
      teams
    }));

    if (!approvesFromRequiredTeams.length) {
      const usersWhoApproved = approvesFromRequiredTeams.map((reivew) => reivew.user.login).join(', ');

      info(`Users from ${requiredTeams} who approved pr: ${usersWhoApproved}`);

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
