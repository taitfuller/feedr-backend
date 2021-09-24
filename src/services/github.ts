import superagent from "superagent";

export const getRepositories = async (token: string): Promise<string[]> => {
  try {
    const response = await superagent
      .get(`https://api.github.com/user/repos`)
      .set("Authorization", `token ${token}`)
      .set("User-Agent", "FEEDR")
      .send();
    return response.body.map((repo: { name: string }) => repo.name) ?? [];
  } catch (error) {
    return error.status;
  }
};

export const createIssue = async (
  token: string,
  owner: string,
  repo: string,
  title: string,
  body: string
): Promise<number> => {
  try {
    const response = await superagent
      .post(`https://api.github.com/repos/${owner}/${repo}/issues`)
      .set("Authorization", `token ${token}`)
      .set("User-Agent", "FEEDR")
      .send({
        title,
        body,
      });
    return response.status;
  } catch (error) {
    return error.status;
  }
};
