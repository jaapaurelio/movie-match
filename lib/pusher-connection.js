import Pusher from "pusher-js";

let pusher = null;

export const pusherConnection = () => {
  if (pusher) {
    return pusher;
  }

  pusher = new Pusher(process.env.PUSHER_APP_KEY, {
    cluster: process.env.PUSHER_APP_CLUSTER,
    encrypted: true
  });

  return pusher;
};
