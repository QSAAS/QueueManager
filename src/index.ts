import createApp from "@app/app";
import { getDependencyContainer } from "@app/Command/Presentation/Api/Routes/Router";
import EventHandler from "@app/Command/Infrastructure/Service/EventHandler";
import { DiEntry } from "@app/Command/Infrastructure/Config/DependencyDefinitions";

const PORT = process.env.SERVER_PORT || "N/A";

createApp().then(async (app) => {
  app.listen(80, () => {
    console.log(`Server started, forwarding host port ${PORT} to port 80`);
  });

  const container = await getDependencyContainer();
  const eventHandler = container.resolve<EventHandler>(DiEntry.EventHandler);
  eventHandler.run();
});
