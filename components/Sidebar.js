import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";

import { playlistIdState } from "../atoms/playlistAtoms";

import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from "@heroicons/react/outline";

function Sidebar() {
  const spotifyapi = useSpotify();
  const { data: session, status } = useSession();

  const [playlist, setPlaylist] = useState([]);
  const [playlistId, setPaylistId] = useRecoilState(playlistIdState);

  useEffect(() => {
    if (spotifyapi.getAccessToken()) {
      spotifyapi.getUserPlaylists().then((data) => {
        setPlaylist(data.body?.items);
        console.log("useeffect sidebar", data.body.items);
      });
    }
  }, [session, spotifyapi]);
  // console.log(session);
  return (
    <div className="text-gray-500 pb-36 p-5 text-xs lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen hidden md:inline-flex">
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="h-5 w-5" />
          <p>Library</p>
        </button>

        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* PLAYLIST */}
        {playlist && playlist?.map((play) => (
          <p
            onClick={() => setPaylistId(play.id)}
            key={play.id}
            className="cursor-pointer hover:text-white"
          >
            {play.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
