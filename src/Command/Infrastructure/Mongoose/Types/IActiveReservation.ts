import IMetadata from "@app/Command/Infrastructure/Mongoose/Types/IMetadata";

export default interface IActiveReservation {
  reservationId: string;
  clientId: string;
  queueNodeId: string;
  reservationTime: number;
  verificationNumber: string;
  numberInQueue: string;
  metadata: IMetadata;
}
