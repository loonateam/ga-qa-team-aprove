# Jenkins job trigger action

Github Action to trigger jenkins job

### Inputs
| name | required | default |
| ---- | -------- | ----------- |
| githubToken  | `false`   | `${{ github.token }}` |
| jenkinsJob | `false` | `github-loona-build-feature` |
| jenkinsUser | `true` | - |
| jenkinsToken | `true` | - |
| jenkinsUrl | `true` | -  |
| defaultBranch | `false` | `trunk` |

### Example
```yaml
- name: Trigger Jenkins Build Job ⏰
  uses: loonateam/trigger-jenkins-job@main
    with:
      jenkinsUser: ${{ secrets.JENKINS_USER }}
      jenkinsToken: ${{ secrets.JENKINS_SECRET }}
      jenkinsUrl: ${{ secrets.JENKINS_URL }}
```
