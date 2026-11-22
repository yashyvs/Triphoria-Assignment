import { Client, Connection } from "@temporalio/client";

let clientPromise: Promise<Client> | undefined;

export function getTemporalClient(): Promise<Client> {
  if (!clientPromise) {
    const address = process.env.TEMPORAL_ADDRESS || "localhost:7233";

    clientPromise = Connection.connect({ address })
      .then((connection) => {
        console.log("Connected to Temporal Server");

        return new Client({ connection });
      })
      .catch((error) => {
        // Allow a future request to retry the connection
        clientPromise = undefined;
        throw error;
      });
  }

  return clientPromise;
}
