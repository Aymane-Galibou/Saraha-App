
import bcrypt from "bcryptjs";

export const hashPassword=async ({password,saltRound=process.env.SALT_ROUNDS})=>{
    return bcrypt.hashSync(password, +saltRound);
}