import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyapi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
});

function useSpotify() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      if (session.error === "RefreshAcessTokenError") {
        signIn();
      }
    }
  }, [session]);

  spotifyapi.setAccessToken(session.user.accessToken);

  return spotifyapi;
}

export default useSpotify;
