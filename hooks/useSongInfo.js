import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState } from "../atoms/songAtoms";
import useSpotify from "./useSpotify";
function useSongInfo() {
  const spotifyApi = useSpotify();

  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);

  console.log("track id",currentTrackId);
  
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchsonginfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              "Authorization": `Bearer ${spotifyApi.getAccessToken()}`,
            },
            mode: "no-cors",
          }
        ).then((res) => res.json());
        setSongInfo(trackInfo);
      }
    };

    fetchsonginfo();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
}

export default useSongInfo;
