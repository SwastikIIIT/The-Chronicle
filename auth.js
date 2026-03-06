import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        twoFactorToken: { label: "2FA Code", type: "text" },
      },

      async authorize(credentials, req) {
        const userAgent = req.headers.get("user-agent");
        const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "User-Agent": userAgent,
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            twoFactorToken: credentials?.twoFactorToken,
          }),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);

        return result;
      },
    }),
  ],
  pages: { signIn: "/login" },
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("User in signIn callback:", user);
      console.log("Account in signIn callback:", account);
      console.log("Profile in signIn callback:", profile);

      // if (account?.provider === "google") {
      //   try {
      //     await connectToMongo();
      //     const { email, name, picture, sub } = profile;
      //     console.log("Mongo connected");
      //     console.log("profile:", { email, name, picture, sub });
      //     const userExists = await User.findOne({ email: email });

      //     if (!userExists) {
      //       const response = await fetch("https://api.ipify.org?format=json");
      //       const ipAddress = await response.json();
      //       const user = await User.create({
      //         email: email,
      //         username: name,
      //         password: crypto.randomBytes(16).toString("hex").slice(0, 16),
      //         image: picture,
      //         googleId: sub,
      //         lastLogin: new Date(),
      //       });

      //       await recordLoginHistory(user, ipAddress?.ip, true);
      //       // await user.save();
      //       console.log("New user created:", user);
      //     } else {
      //       userExists.lastLogin = new Date();
      //       await userExists.save();
      //     }
      //     return true;
      //   } catch (err) {
      //     console.log("Error signing in with Google", err);
      //   }
      //   return true;
      // }
      if (account?.provider === "credentials") {
        return true;
      }
      if(account?.provider === "google"){
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user?.userId;
        token.hasTwoFactor = user?.hasTwoFactor;
        token.email = user?.email;
        token.name = user?.name;
        token.image = user?.image;
        token.lastLogin = user?.lastLogin;
        token.passwordLastChanged = user?.passwordLastChanged;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (token) {
        session.user.id = token?.id;
        session.user.hasTwoFactor = token?.hasTwoFactor;
        session.user.email = token?.email;
        session.user.name = token?.name;
        session.user.image = token?.image;
        session.user.lastLogin = token?.lastLogin;
        session.user.passwordLastChanged = token?.passwordLastChanged;
      }
      // if(user)
      // {
      //    session.user.id=user?.id;
      //    session.user.email=user?.email;
      //    session.user.name=user?.name;
      // }
      return session;
    },
  },
});
