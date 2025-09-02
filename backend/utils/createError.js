const createError = (error) => {
    const message = error.message || "Internal Server Error";
    const status = error.status || 500;
    const err = new Error(message);

    err.status = status;
    err.data = {
        success: false,
        status,
        message
    };

    return err;
}

export default createError;