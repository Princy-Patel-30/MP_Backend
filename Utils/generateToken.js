import jwt from "jsonwebtoken";
const generatetoken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
};

export default generatetoken;
