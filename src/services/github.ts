import superagent from "superagent";

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
