const isSignedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: "Not Signed In",
        });
    }

    next();
}


export { isSignedIn };