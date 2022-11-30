# Manage QA approves

Github Action to manage QA approves

### Inputs
| name | required | default |
| ---- | -------- | ----------- |
| githubToken  | `false`   | `${{ github.token }}` |
| requiredTeams | `false` | `''` |

### Example
```yaml
- name: Check QA Approves
  uses: loonateam/ga-qa-team-aprove@v1.0
    with:
      requiredTeams: 'team-qa'
```
