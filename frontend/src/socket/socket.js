import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
  {
    transports: ["websocket", "polling"],
  }
);

function Tracking() {
  useEffect(() => {
    socket.on("receiveLocation", (data) => {
      console.log("Truck location:", data);
    });

    return () => {
      socket.off("receiveLocation");
    };
  }, []);

  return <h2>Live Truck Tracking</h2>;
}

export default Tracking;