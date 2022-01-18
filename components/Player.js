import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtoms";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

import {
  FastForwardIcon,
  ReplyIcon,
  SwitchHorizontalIcon,
  VolumeOffIcon,
} from "@heroicons/react/outline";
import {
  RewindIcon,
  PauseIcon,
  PlayIcon,
  VolumeUpIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();

  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackState);

  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchcurentsong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item.id);
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      // fetch song
      fetchcurentsong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  const handleplaypause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const debounceadjustvolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((error) => console.log(error));
    }, 3000),
    []
  );

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceadjustvolume(volume);
    }
  }, [volume]);

  return (
    <div className="grid grid-cols-3 md:text-base px-2 md:px-8 h-24 text-white bg-gradient-to-b from-black to-gray-900">
      {/* left */}
      <div className="flex items-center space-x-5 ">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* center */}
      <div className="flex items-center justify-between">
        <SwitchHorizontalIcon className="buttonn" />
        <RewindIcon
          onClick={() => spotifyApi.skipToPrevious()}
          className="buttonn"
        />

        {isPlaying ? (
          <PauseIcon onClick={handleplaypause} className="buttonn w-10 h-10" />
        ) : (
          <PlayIcon onClick={handleplaypause} className="buttonn w-10 h-10" />
        )}

        <FastForwardIcon
          onClick={() => spotifyApi.skipToNext()}
          className="buttonn"
        />
        <ReplyIcon className="buttonn" />
      </div>

      <div className="flex items-center pr-5 space-x-3 md:space-x-4 justify-end">
        <VolumeOffIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="buttonn"
        />
        <input
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="buttonn"
        />
      </div>
    </div>
  );
}

export default Player;
