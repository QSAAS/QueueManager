import DependencyInjectionContainer from "@app/Command/Infrastructure/Config/DependencyInjectionContainer";
import {DiEntry} from "@app/Command/Infrastructure/Config/DependencyDefinitions";
import MongooseQueueServerOperatorRepository
  from "@app/Command/Infrastructure/Mongoose/Repository/MongooseQueueServerOperatorRepository";
import {getDependencyContainer} from "@app/Command/Presentation/Api/Routes/Router";
import SaveQueueServerOperatorService from "@app/Command/Application/Service/SaveQueueServerOperatorService";
import QueueServerOperator from "@app/Command/Domain/Entity/QueueServerOperator";
import QueueServerOperatorId from "@app/Command/Domain/ValueObject/QueueServerOperatorId";
import QueueServerOperatorSaved from "@app/Command/Domain/Event/QueueServerOperatorSaved";

let service: SaveQueueServerOperatorService;
let container: DependencyInjectionContainer<DiEntry>;
let queueServerOperatorRepository: MongooseQueueServerOperatorRepository;

beforeAll(async () => {
  container = await getDependencyContainer();
  service = container.resolve<SaveQueueServerOperatorService>(DiEntry.SaveQueueServerOperatorService);
});

beforeEach(async () => {
  queueServerOperatorRepository = container.resolve<MongooseQueueServerOperatorRepository>(DiEntry.QueueServerOperatorRepository);
  await queueServerOperatorRepository.getModel().deleteMany({});
});

describe("Save queue server listener", () => {
  it("Should save a queue server operator", async () => {
    const operator = new QueueServerOperator(
      QueueServerOperatorId.create(),
      [],
      [],
      [],
    );
    const event = new QueueServerOperatorSaved(operator);

    await service.execute(event);

    const object = await queueServerOperatorRepository.getById(operator.getId());
    expect(object).toBeDefined();
    expect(object).toEqual(operator);
  });
});
