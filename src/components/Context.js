import React from "react";
import io from "socket.io-client";

import config from "../config";

export const SocketContext = React.createContext();

export const AppContext = ({ children }) => {
  const { PEER_CONFIG, SIGNALING_SERVER } = config;
  const socket = io.connect(SIGNALING_SERVER);
  const peer = new RTCPeerConnection(PEER_CONFIG);

  return (
    <SocketContext.Provider value={{ socket, peer }}>
      {children}
    </SocketContext.Provider>
  );
};
