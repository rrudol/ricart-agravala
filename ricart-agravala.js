const { DistributedEventEmmiter } = require("@rudol/distributed-event-emitter");
const delay = require('delay');

async function start() {
  const app = await DistributedEventEmmiter.create();

  app.state = {
    requesting: false,
    timestamp: 0,
    exectuing: false,
    approvals: 0,
    deferred: []
  };

  await app.on("REQUEST", (id, ts) => {
    with (app.state) {
      if (id === app.getId()) return (requesting = true);

      if (
        exectuing ||
        (requesting && timestamp > ts) ||
        (requesting && timestamp === ts && app.getId > id)
      ) {
        return deferred.push(id);
      }

      app.send(id, "REPLY");
    }
  });

  await app.on("REPLY", async () => {
    with (app.state) {
      approvals += 1;
      if (approvals === app.getNodesCount() - 1) {
        requesting = false;
        exectuing = true;

        console.log("Entering Critical Section");
        console.log("Starting...")
        await delay(1000);
        console.log("Working...")
        await delay(2000);
        console.log("Finishing...")
        await delay(1000);
        console.log("Leaving Critical Section");

        exectuing = false;
        approvals = 0;

        deferred.forEach(id => app.send(id, "REPLY"));
      }
    }
  });

  await app.sync();

  setInterval(() => {
    if (!app.state.requesting && !app.state.exectuing)
      app.emit("REQUEST", app.getId(), Date.now());
  }, 4000 + Math.random() * 4000);
}

start();
