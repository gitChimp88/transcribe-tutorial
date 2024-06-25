"use strict";
const { OpenAI } = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI,
});

/**
 * transcribe-insight-gpt service
 */

module.exports = ({ strapi }) => ({
  insightService: async (ctx) => {
    try {
      const input = ctx.request.body.data?.input;
      const operation = ctx.request.body.data?.operation;

      if (operation === "analysis") {
        const analysisResult = await gptAnalysis(input);

        return {
          message: analysisResult,
        };
      } else if (operation === "answer") {
        const answerResult = await gptAnswer(input);

        return {
          message: answerResult,
        };
      } else {
        return { error: "Invalid operation specified" };
      }
    } catch (err) {
      console.log("Error with chatGPT analysis - ", err);
    }
  },
});

async function gptAnalysis(input) {
  const analysisPrompt =
    "Analyse the following text and give me an in depth analysis of what it means:";
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: `${analysisPrompt} ${input}` }],
    model: "gpt-3.5-turbo",
  });

  const analysis = completion.choices[0].message.content;

  return analysis;
}

async function gptAnswer(input) {
  const answerPrompt =
    "Analyse the following text and give me an answer to the question posed: ";
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: `${answerPrompt} ${input}` }],
    model: "gpt-3.5-turbo",
  });

  const answer = completion.choices[0].message.content;

  return answer;
}
