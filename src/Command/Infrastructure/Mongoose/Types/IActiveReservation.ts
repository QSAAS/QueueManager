import IMetadata from "@app/Command/Infrastructure/Mongoose/Types/IMetadata";

export default interface IActiveReservation {
  reservationId: string,
  clientId: string,
  queueNodeId: string,
  reservationTime: string,
  verificationNumber: string,
  numberInQueue: string,
  // TODO: metadata
  metadata: IMetadata
}
