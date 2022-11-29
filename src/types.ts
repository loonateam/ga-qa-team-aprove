import type { getOctokit } from '@actions/github';

export type Input = {
  githubToken: string;
  requiredTeams: string;
}

export type Headers = {
  Authorization: string;
}

export type IsOnTeamParams = {
  client: ReturnType<typeof getOctokit>;
  author: string;
  teams: string[];
}