export default function socketHandler(io, productManager) {
    io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    socket.emit('updateProducts', await productManager.getProducts());
    });
}
