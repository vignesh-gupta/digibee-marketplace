import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhook";

const app = express();

const PORT = process.env.PORT || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

export type WebHookRequest = IncomingMessage & { rawBody: Buffer };

const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebHookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.use("/api/webhook/stripe", webhookMiddleware , stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info("Payload CMS is ready!");
        cms.logger.info(`Admin URL is: ${cms.getAdminURL()}`);
      },
    },
  });

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next JS Started!");

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next JS URL : ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
