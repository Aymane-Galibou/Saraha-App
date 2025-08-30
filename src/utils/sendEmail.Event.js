import { EventEmitter } from "events";
import { sendEmail } from "../Services/sendEmail.js";
import { generateToken } from "./token/generateToken.js";

export const sentEmailEvent=new EventEmitter()


sentEmailEvent.on("sendEmail",async ({email})=>{

        const emailToken=await generateToken({payload:{email},signature:process.env.SIGNATUR_EMAIL})
        const link=`http://localhost:3000/users/confirmEmail/${emailToken}`
        const confirmedEmail= await sendEmail(
          email,
          "Email Confirmation",
          `<p>You have Registred in our WebSite so You should Verify Your Email</p><br><a href="${link}">ConfirmEmail</a>`)
    
        if(!confirmedEmail){
           next(new Error("Email Not Exist or Not confirmed",{cause:400}))
        }  
})




