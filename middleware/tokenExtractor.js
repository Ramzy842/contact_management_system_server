const getTokenFrom = (request) => {
    const authorization = request.get("authorization");
    if (authorization && authorization.startsWith("Bearer "))
      return authorization.replace("Bearer ", "");
    return null;
};

const tokenExtractor = (req, res,next) => {
    req.token = getTokenFrom(req);
    next();
}

module.exports = tokenExtractor;