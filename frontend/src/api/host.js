let HOST;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development")
    HOST = 'http://localhost:9002/api';
else
    HOST = 'https://backend-ppmanager.pincode-infra.ru/api';

export default HOST;
