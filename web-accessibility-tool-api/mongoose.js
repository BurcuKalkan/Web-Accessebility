const mongoose = require('mongoose');

// MongoDB bağlantısı
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://wat:wat12345@localhost:27017/pa11yDB?authSource=admin', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1); // Bağlantı hatasında uygulamayı sonlandır
    }
};

// Pa11y sonuçları için Schema ve Model
const pa11yResultSchema = new mongoose.Schema({
    url: { type: String, required: true },
    results: { type: Object, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Pa11yResult = mongoose.model('Pa11yResult', pa11yResultSchema);

module.exports = { connectDB, Pa11yResult };