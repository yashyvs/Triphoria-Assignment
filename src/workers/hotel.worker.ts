import "dotenv/config";

import { NativeConnection, Worker } from "@temporalio/worker";

import * as activities from "../activities/hotel.activities";

const TASK_QUEUE = "hotel-task-queue";

async function runWorker() {
  const address = process.env.TEMPORAL_ADDRESS || "localhost:7233";

  // Connect to Temporal Server
  const connection = await NativeConnection.connect({
    address,
  });

  // Create Temporal Worker
  const worker = await Worker.create({
    connection,

    taskQueue: TASK_QUEUE,

    workflowsPath: require.resolve("../workflows"),

    activities,
  });

  console.log("Temporal Worker started");
  console.log(`Connected to Temporal at ${address}`);
  console.log(`Listening on task queue: ${TASK_QUEUE}`);

  await worker.run();
}

runWorker().catch((error) => {
  console.error("Worker failed:", error);
  process.exitCode = 1;
});
