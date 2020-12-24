const config = {
  ANNOTATIONS: [
    {
      tool: "Pencil",
      fields: ["height", "width", "left", "top", "path"],
    },
    {
      tool: "Line",
      fields: ["height", "width", "left", "top", "x1", "x2", "y1", "y2"],
    },
    {
      tool: "Rectangle",
      fields: ["height", "width", "left", "top"],
    },
    {
      tool: "Circle",
      fields: ["height", "width", "left", "top", "radius", "angle"],
    },
  ],
  PEER_CONFIG: {
    iceServers: [
      {
        urls: "stun:ec2-18-221-102-19.us-east-2.compute.amazonaws.com:3478",
        username: "arimaglobal",
        credential: "arimaglobal",
      },
      {
        urls: "turn:ec2-18-221-102-19.us-east-2.compute.amazonaws.com:3478",
        username: "arimaglobal",
        credential: "arimaglobal",
      },
    ],
  },
  SIGNALING_SERVER: "https://vast-headland-11741.herokuapp.com/",
  SOCKET_ROOM: "foo",
  SOCKET_TOPICS: {
    CREATE_JOIN_ROOM: "create or join",
    ROOM_CREATED: "created",
    ROOM_FULL: "full",
    JOIN_ROOM: "join",
    JOINED_ROOM: "joined",
    LOG: "log",
    MESSAGE: "message",
  },
};

export default config;
