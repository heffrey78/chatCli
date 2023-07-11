import axios from 'axios';

export class JiraHandler {
    private baseUrl: string = 'https://nuvalence-dmv.atlassian.net/rest/api/3/search';

    public async queryIssues(jql: string): Promise<any | null>{
        try {
            const response = await axios({
              method: 'get',
              url: this.baseUrl,
              headers: { 
                'Authorization': `Basic $jwikstrom@nuvalence.io:${Buffer.from(process.env.JIRA_TOKEN || '').toString('base64')}`,
                'Accept': 'application/json',
              },
              params: {
                jql: jql
              },
            });
            
            return response.data;
            
          } catch (error) {
            console.error(error);
            return null;
          }
        }
    }
