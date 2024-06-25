"use strict";

module.exports = {
  exampleAction: async (ctx) => {
    try {
      const response = await strapi
        .service("api::transcribe-insight-gpt.transcribe-insight-gpt")
        .insightService(ctx);

      ctx.body = { data: response };
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }
  },
};
