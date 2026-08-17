/** Is User SignedIn */
const isSignedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: "Not Signed In",
        });
    }

    next();
}

/** wrapASync */
const wrapAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};


export { isSignedIn, wrapAsync };