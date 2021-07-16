import Controller from "@app/Command/Presentation/Api/Controller/Controller";
import Joi from "joi";
import {Request, Response} from "express";
import CancelReservationRequest from "@app/Command/Application/DataTransferObject/Request/CancelReservationRequest";
import CancelReservationService from "@app/Command/Application/Service/CancelReservationService";

export default class ReservationController extends Controller {
  constructor(private cancelReservationService: CancelReservationService) {
    super();
  }

  public async cancel(request: Request, response: Response) {
    await this.validateRequest(request);
    const {clientId, reservationId} = request.body;
    const dto = new CancelReservationRequest(clientId, reservationId);
    await this.cancelReservationService.execute(dto);
    response.json({});
  }

  protected createSchema(): Joi.Schema {
    return Joi.object({
      clientId: Joi.string().required(),
      reservationId: Joi.string().required(),
    });
  }

}
