//errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.code || 500).send(err);
};

export default errorHandler;
