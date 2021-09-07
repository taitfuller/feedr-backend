import { Example, IExample } from "../models";

export const addExample = async (name: string): Promise<IExample> => {
  const example = new Example();

  example.name = name;

  await example.save();

  return example;
};

export const getExamples = async (): Promise<IExample[]> => {
  return Example.find().exec();
};
