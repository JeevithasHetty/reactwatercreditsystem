export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🔗 Transporter connected:", socket.id);

    socket.on("locationUpdate", (data) => {
      const { orderId, lat, lng } = data;
      io.emit(`location_${orderId}`, { lat, lng });
    });

    socket.on("disconnect", () => {
      console.log("❌ Transporter disconnected:", socket.id);
    });
  });
};
