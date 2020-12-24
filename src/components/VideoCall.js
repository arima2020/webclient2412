import React, { useContext, useRef } from "react";

import { SocketContext } from "./Context";
import config from "../config";

const VideoCall = () => {
  const { socket, peer } = useContext(SocketContext);
  const {
    SOCKET_ROOM,
    SOCKET_TOPICS: {
      CREATE_JOIN_ROOM,
      ROOM_CREATED,
      ROOM_FULL,
      JOIN_ROOM,
      JOINED_ROOM,
      LOG,
      MESSAGE,
    },
  } = config;
  const localStream = useRef();
  const localVideo = useRef({});
  const remoteStream = useRef();
  const remoteVideo = useRef({});

  console.log("peer =======>");
  console.log(peer);

  var isInitiator = false;
  var isStarted = false;

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then(gotStream)
    .catch((e) => {
      alert("getUserMedia() error: " + e.name);
    });

  socket.emit(CREATE_JOIN_ROOM, SOCKET_ROOM);
  console.log("Attempted to create or  join room", SOCKET_ROOM);
  isInitiator = true;

  socket.on(ROOM_CREATED, (room) => {
    console.log("Created room " + room);
    isInitiator = true;
  });

  socket.on(ROOM_FULL, (room) => {
    console.log("Room " + room + " is full");
  });

  socket.on(JOIN_ROOM, (room) => {
    console.log("Another peer made a request to join room " + room);
    console.log("This peer is the initiator of room " + room + "!");
    isInitiator = true;
  });

  socket.on(JOINED_ROOM, (room) => {
    console.log("joined: " + room);
  });

  socket.on(LOG, (array) => {
    console.log.apply(console, array);
  });

  socket.on(MESSAGE, (message) => {
    console.log("Client received message:", message);
    if (message === "got user media") {
      console.log("into the got user media");
      console.log("isstarted : " + isStarted);
      maybeStart();
    } else if (message.type === "offer") {
      if (!isInitiator && !isStarted) {
        maybeStart();
      }
      peer.setRemoteDescription(new RTCSessionDescription(message));
      doAnswer();
    } else if (message.type === "answer" && isStarted) {
      peer.setRemoteDescription(new RTCSessionDescription(message));
    } else if (message.type === "candidate" && isStarted) {
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate,
      });
      peer.addIceCandidate(candidate);
    } else if (message === "bye" && isStarted) {
      handleRemoteHangup();
    }
  });

  function sendMessage(message) {
    console.log("Client sending message: ", message);
    socket.emit(MESSAGE, message);
  }

  function gotStream(stream) {
    console.log("Adding local stream.");

    localStream.current = stream;
    localVideo.current = {};
    localVideo.current.srcObject = stream;
    sendMessage("got user media");
    if (isInitiator) {
      maybeStart();
    }
  }

  function maybeStart() {
    console.log(">>>>>> creating peer connection");
    createPeerConnection();
    peer.addStream(localStream.current);
    isStarted = true;
    console.log("isInitiator", isInitiator);
    if (isInitiator) {
      doCall();
    }
  }

  window.onbeforeunload = function () {
    sendMessage("bye");
  };

  function createPeerConnection() {
    try {
      peer.onaddstream = handleRemoteStreamAdded;
      peer.onicecandidate = handleIceCandidate;
      peer.onremovestream = handleRemoteStreamRemoved;
      var connectionState = peer.connectionState;
      console.log("Created RTCPeerConnnection" + connectionState);
    } catch (e) {
      console.log("Failed to create PeerConnection, exception: " + e.message);
      alert("Cannot create RTCPeerConnection object.");
      return;
    }
  }

  function handleIceCandidate(event) {
    console.log("icecandidate event: ", event);
    if (event.candidate) {
      sendMessage({
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      });
    } else {
      console.log("End of candidates.");
    }
  }

  function handleCreateOfferError(event) {
    console.log("createOffer() error: ", event);
  }

  function doCall() {
    console.log("Sending offer to peer");
    peer.createOffer(setLocalAndSendMessage, handleCreateOfferError);
  }

  function doAnswer() {
    console.log("Sending answer to peer.");
    peer
      .createAnswer()
      .then(setLocalAndSendMessage, onCreateSessionDescriptionError);
  }

  function setLocalAndSendMessage(sessionDescription) {
    peer.setLocalDescription(sessionDescription);
    console.log("setLocalAndSendMessage sending message", sessionDescription);
    sendMessage(sessionDescription);
  }

  function onCreateSessionDescriptionError(error) {
    console.error("Failed to create session description: " + error.toString());
  }

  function handleRemoteStreamAdded(event) {
    var connectionState = peer.connectionState;

    console.log("Remote stream added." + connectionState);
    remoteStream.current = event.stream;
    console.log("Remote stream " + event.stream.id);
    remoteVideo.current.srcObject = event.stream;

    peer.addEventListener("track", async (event) => {
      remoteStream.current.addTrack(event.track, remoteStream.current);
    });
  }

  function handleRemoteStreamRemoved(event) {
    console.log("Remote stream removed. Event: ", event);
  }

  function handleRemoteHangup() {
    console.log("Session terminated.");
    stop();
    isInitiator = false;
  }

  function stop() {
    isStarted = false;
    peer.close();
    window.location.reload();
  }

  return (
    <>
      <video
        height="700"
        width="350"
        style={{ float: "left" }}
        autoPlay
        ref={remoteVideo}
      />
    </>
  );
};

export default VideoCall;
