import Controller from "@app/Command/Presentation/Api/Controller/Controller";
import Joi from "joi";
import ChangeQueueServerStatusService from "@app/Command/Application/Service/ChangeQueueServerStatusService";
import MarkQueueServerAsFreeService from "@app/Command/Application/Service/MarkQueueServerAsFreeService";
import { Request, Response } from "express";
import MarkQueueServerAsFreeRequest from "@app/Command/Application/DataTransferObject/Request/MarkQueueServerAsFreeRequest";
import ValidationError from "@app/Command/Application/Error/ValidationError";
import ChangeQueueServerStatusRequest from "@app/Command/Application/DataTransferObject/Request/ChangeQueueServerStatusRequest";

const changeStatusSchema = Joi.object({
  queueServerId: Joi.string().required(),
  queueServerOperatorId: Joi.string().required(),
  setAsActive: Joi.boolean().required(),
});

export default class QueueServerController extends Controller {
  constructor(
    private changeQueueServerStatusService: ChangeQueueServerStatusService,
    private markQueueServerAsFreeService: MarkQueueServerAsFreeService,
  ) {
    super();
  }

  public async markAsFree(request: Request, response: Response) {
    await this.validateRequest(request);
    const { queueServerId, queueServerOperatorId } = request.body;
    const dto = new MarkQueueServerAsFreeRequest(queueServerOperatorId, queueServerId);
    await this.markQueueServerAsFreeService.execute(dto);
    response.json({});
  }

  public async changeStatus(request: Request, response: Response) {
    try {
      await changeStatusSchema.validateAsync(request.body);
    } catch (error) {
      if (error instanceof Joi.ValidationError) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
    const { queueServerId, queueServerOperatorId, setAsActive } = request.body;
    const dto = new ChangeQueueServerStatusRequest(queueServerOperatorId, queueServerId, setAsActive);
    await this.changeQueueServerStatusService.execute(dto);
    response.json({});
  }

  protected createSchema(): Joi.Schema {
    return Joi.object({
      queueServerId: Joi.string().required(),
      queueServerOperatorId: Joi.string().required(),
    });
  }
}
