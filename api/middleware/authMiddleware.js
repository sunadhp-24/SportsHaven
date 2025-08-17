// import jwt from 'jsonwebtoken';
// // const secretKey = 'your_secret_key'; // Replace with your actual secret key

// // Middleware to verify JWT token and attach user information to req.user
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Assuming token is sent in Authorization header

//   if (token) {
//     jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: 'Invalid token' });
//       }
//       req.user = decoded; // Attach decoded user information to req.user
//       next();
//     });
//   } else {
//     res.status(401).json({ message: 'Token not found' });
//   }
// };

// export default authenticateJWT;
