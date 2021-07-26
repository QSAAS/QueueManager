import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import MongooseQueueServerRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueServerRepository";
import SaveQueueServerService from "@app/Command/Application/EventListener/SaveQueueServerService";
import {getDependencyContainer} from "@app/Command/Presentation/Api/Routes/Router";
import QueueServerSaved from "@app/Command/Domain/Event/QueueServerSaved";
import QueueServer from "@app/Command/Domain/Entity/QueueServer";
import QueueServerId from "@app/Command/Domain/ValueObject/QueueServerId";

let service: SaveQueueServerService;
let container: DependencyInjectionContainer<DiEntry>;
let queueServerRepository: MongooseQueueServerRepository;

beforeAll(async () => {
  container = await getDependencyContainer();
  service = container.resolve<SaveQueueServerService>(DiEntry.SaveQueueServerService);
});

beforeEach(async () => {
  queueServerRepository = container.resolve<MongooseQueueServerRepository>(DiEntry.QueueServerRepository);
  await queueServerRepository.getModel().deleteMany({});
});

describe("Save queue server listener", () => {
  it("Should save a queue server", async () => {
    const server = new QueueServer(
      QueueServerId.create(),
      [],
    )
    const event = new QueueServerSaved(server);

    await service.execute(event);

    const object = await queueServerRepository.getById(server.getId());
    expect(object).toBeDefined();
    expect(object).toEqual(server);
  });
});
