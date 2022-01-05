const { token, guild, user, port } = require("./config.json");
const WebSocket = require("ws");

let client;
let server;
let presence;
let sequence = 0;

function connect() {
  client = new WebSocket("wss://gateway.discord.gg/?v=9");

  client.on("close", () => {
    console.log("Disconnected, reconnecting...");
    setTimeout(() => connect, 60000);
  });

  client.on("message", packet => {
    packet = JSON.parse(packet);
    sequence = packet.s;

    switch (packet.op) {
      case 0:
        switch (packet.t) {
          case "READY":
            console.log("Connected, requesting presence...");
            client.send(
              JSON.stringify({
                op: 8,
                d: {
                  guild_id: guild,
                  user_ids: [user],
                  presences: true
                }
              })
            );
            break;

          case "PRESENCE_UPDATE":
            if (packet.d.user.id === user) {
              console.log("Presence updated");
              presence = packet.d;

              for (const ws of server.clients) ws.send(JSON.stringify(presence));
            }
            break;

          case "GUILD_MEMBERS_CHUNK":
            console.log("Received presence");
            presence = packet.d.presences.find(presence => presence.user.id === user);

            if (server) for (const ws of server.clients) ws.send(JSON.stringify(presence));
            else {
              console.log("Starting server...");
              server = new WebSocket.Server({ port });
              server.on("connection", ws => ws.send(JSON.stringify(presence)));
            }
            break;
        }
        break;

      case 10:
        console.log("Authenticating...");
        client.send(
          JSON.stringify({
            op: 2,
            d: {
              token,
              intents: 256,
              properties: {
                $os: "linux",
                $browser: "the",
                $device: "the the"
              }
            }
          })
        );

        setInterval(
          () => client.send(JSON.stringify({ op: 1, d: sequence })),
          packet.d.heartbeat_interval
        );
        break;
    }
  });
}

connect();