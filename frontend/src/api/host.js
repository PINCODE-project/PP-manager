let HOST;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
    HOST = 'http://localhost:5000/api';
else
    HOST = 'https://pincode-dev.ru/pp-manager/api';

export default HOST;
