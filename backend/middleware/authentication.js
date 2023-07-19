import jwt from 'jsonwebtoken';



const isLogin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json('you must login');
  }
  try {
    const data = jwt.verify(token, "secret");
    req.userId = data.userId;
    return next();
  } catch(err) {
    return res.status(401).json('you must login');
  }
};

export {isLogin};