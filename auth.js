import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET
   }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        twoFactorToken: { label: "2FA Code", type: "text" },
        isBiometric: { label: "Use Biometric", type: "boolean" },
        biometricData: { label: "Biometric Data", type: "text" },
      },

      async authorize(credentials, req) {
        const userAgent = req.headers.get("user-agent");

        if(credentials.isBiometric==="true") {
          const res=await fetch(`${process.env.BACKEND_URL}/api/auth/biometric/login`, {
            method: "POST",
            headers: { 
              "Content-type": "application/json",
              "User-Agent": userAgent
           },
            body: JSON.stringify({
                email: credentials.email,
                data: JSON.parse(credentials.biometricData)
            })
          });
          const result = await res.json();
          console.log(result);
          if(!res.ok) throw new Error(result.error);
          return result;
        }

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

      if(account?.provider==="google") {
        try {
            const { email, name, picture, sub } = profile;
            console.log("profile:", { email, name, picture, sub });
            
            const res = await fetch(`${process.env.BACKEND_URL}/api/oauth/google`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              email,
              name,
              image: picture,
              providerId: sub,
              provider: "google",
            }),
          });

          const result = await res.json();
          if (!res.ok) {
            console.error("Backend OAuth Error:", result.error);
            return false;
          }

          user.userId = result.userId;
          user.name=result.name;
          user.email=result.email;
          user.image=result.image;
          user.hasTwoFactor = result.hasTwoFactor;

          return true;
        } catch (err) {
          console.log("Error signing in with Google", err);
          return false;
        }
      }

      if (account?.provider === "github") {
        try {
          const { email, name, login, avatar_url, id } = profile;

          const res = await fetch(`${process.env.BACKEND_URL}/api/oauth/google`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              email,
              name,
              image: avatar_url,
              providerId: id.toString(), 
              provider: "github",
            }),
          });

          const result = await res.json();
          if (!res.ok) {
            console.error("Backend OAuth Error (GitHub):", result.error);
            return false; 
          }

          user.userId = result.userId;
          user.name = result.name;
          user.email = result.email;
          user.image = result.image;
          user.hasTwoFactor = result.hasTwoFactor;

          return true;
        } catch (err) {
          console.log("Error signing in with Github", err);
          return false;
        }
      }

      if (account?.provider === "credentials") return true;
      
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
