import IInServiceReservation from "@app/Command/Infrastructure/Mongoose/Types/IInServiceReservation";

export default interface IActiveQueueServer {
  id: string,
  reservation: IInServiceReservation | null,
}
