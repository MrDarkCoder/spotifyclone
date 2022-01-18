import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
  "user-read-playback-position",
  "user-top-read",
  "user-read-recently-played",
  "streaming",
  "app-remote-control",
  "user-library-read",
  "user-read-private",
  "user-read-email",
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-modify-private",
  "playlist-read-collaborative",
  "playlist-read-private",
  "playlist-modify-public",
].join(",");

const params = {
  scope: scopes,
};

const queryparamastring = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryparamastring.toString()}`;

const spotifyapi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
});

export default spotifyapi;

export { LOGIN_URL };
