import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";

const app = express();

const PORT = process.env.PORT || 3000;

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info("Payload CMS is ready!");
        cms.logger.info(`Admin URL is: ${cms.getAdminURL()}`);
      },
    },
  });
  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {

    // payload.logger.info("Next JS Started!");

    app.listen(PORT, async () => {
      // payload.logger.info(`Next JS URL : ${process.env.NEXT_PUBLIC_SERVER_URL}`);
    });
  });
};


start()