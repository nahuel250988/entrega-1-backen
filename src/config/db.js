import mongoose from 'mongoose';

const connectMongoDB = async () => {
    try {
        
        const MONGO_URI = 'mongodb+srv://nahuelrodriguez:nahuelvcp@cluster0.x9hrulj.mongodb.net/nahuel=true&w=majority&appName=Cluster0';
        
        

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.log("Error al conectar a MongoDB:", error);
    }
};

export default connectMongoDB;
