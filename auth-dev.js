import NextAuth, { AuthError, CredentialsSignin } from "next-auth"
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import User from "./models/User";
import { compare } from "bcryptjs";
import { connectToMongo } from "./utils/databse";
import speakeasy from 'speakeasy';
import recordLoginHistory from "./helper/eventHandler/recordLoginHistory";
import crypto from "crypto"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
  }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label:"Email", type: "text" },
        password: {  label: "Password", type: "password" },
        twoFactorToken: { label: "2FA Code", type: "text" }
      },

      async authorize(credentials) {
        const res=await fetch(`${process.env.BACKEND_URL}/api/auth/login`,{
            method:'POST',
            headers:{'Content-type':'application/json'},
            body:JSON.stringify({
                credentials
            })
        })

        if(!res.ok) return null;
        const result=await res.json();
        return result;
      }
    })],
  session:{strategy:"jwt"},
  callbacks: {
    async jwt({token,user})
    {
        if(user)
        {
           token.id=user?.id;
           token.hasTwoFactor=user?.hasTwoFactor;
           token.email = user?.email;  
           token.name = user?.name;
           token.image = user?.image;
           token.lastLogin=user?.lastLogin;
           token.passwordLastChanged=user?.passwordLastChanged;
        }
        return token;
    },
    async session({ session,token}) {
      if(token)
      {
        session.user.id = token?.id;
        session.user.hasTwoFactor=token?.hasTwoFactor;
        session.user.email=token?.email;
        session.user.name=token?.name;
        session.user.image=token?.image;
        session.user.lastLogin=token?.lastLogin;
        session.user.passwordLastChanged=token?.passwordLastChanged;
      }
      // if(user)
      // {
      //    session.user.id=user?.id;
      //    session.user.email=user?.email;
      //    session.user.name=user?.name;
      // }
      return session
    },
  },
})
