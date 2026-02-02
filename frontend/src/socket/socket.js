import React, { useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Tracking() {
  useEffect(() => {
    socket.on("receiveLocation", (data) => {
      console.log("Truck location:", data);
    });

    return () => socket.disconnect();
  }, []);

  return <h2>Live Truck Tracking</h2>;
}

export default Tracking;
