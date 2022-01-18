import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyapi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyapi.setAccessToken(token.accessToken);
    spotifyapi.setRefreshToken(token.refreshToken);
    const { body: refreshedToken } = await spotifyapi.refreshAccessToken();
    console.log(refreshedToken);

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      resfreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAcessTokenError",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // initial signin
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accountTokenExpires: account.expires_at * 1000,
        };
      }
      // return the prev token if AT hasn't expired
      if (Date.now() < token.accountTokenExpires) {
        return token;
      }

      // expired
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      return session;
    },
  },
});
