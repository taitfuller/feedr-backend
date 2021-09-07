export const addExample = jest.fn(async () => {
  return { name: "Bob" };
});

export const getExamples = jest.fn(async () => {
  return [{ name: "Bob" }, { name: "Fred" }, { name: "Jim" }];
});
