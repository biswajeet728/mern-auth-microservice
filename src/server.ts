import app from "./app";
import { Config } from "./config";
import { connectToDatabase } from "./config/db";
import logger from "./config/logger";

const PORT = Config.PORT;

const startExpressServer = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    // console.log(`Server is running on port ${PORT}`);
    logger.info(`Server is running on port ${PORT}`);
  });
};

void startExpressServer();
