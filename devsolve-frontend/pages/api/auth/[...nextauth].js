import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        await axios.post(`${process.env.BACKEND_URL}/api/auth/register`, {
          name: user.name,
          email: user.email,
          provider: account.provider,
          provider_id: user.id,
          profile_picture: user.image,
        });
        return true;
      } catch (error) {
        console.error("Error storing user in DB:", error);
        return false;
      }
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
