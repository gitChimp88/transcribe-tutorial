module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transcribe-insight-gpt/exampleAction",
      handler: "transcribe-insight-gpt.exampleAction",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
