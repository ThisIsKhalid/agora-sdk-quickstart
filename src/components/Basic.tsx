import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useEffect, useState } from "react";
import { MdMic, MdMicOff, MdCall, MdCallEnd } from "react-icons/md";

export default function Basics() {
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("");
  const [channel, setChannel] = useState("");
  const [token, setToken] = useState("");

  useJoin(
    {
      appid: appId,
      channel: channel,
      token: token ? token : null,
    },
    calling
  );

  const [micOn, setMic] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  usePublish([localMicrophoneTrack]);

  // Immediately mute the local audio playback so you don't hear yourself
  useEffect(() => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setVolume(0); // Set the local audio volume to 0
    }
  }, [localMicrophoneTrack]); // Ensure the effect runs when the local track is available

  const remoteUsers = useRemoteUsers();

  console.log(remoteUsers);

//   useEffect(() => {
//     remoteUsers.forEach((user) => {
//       if (user.audioTrack) {
//         user.audioTrack.play(); // Ensure the audio track is played
//       }
//     });
//   }, [remoteUsers]); // Dependency array ensures it runs when remote users update

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {isConnected ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded-md">
                <LocalUser
                  audioTrack={localMicrophoneTrack}
                  micOn={micOn}
                  cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                >
                  <span className="text-sm font-medium text-gray-700">You</span>
                </LocalUser>
              </div>
              {/* {remoteUsers.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center space-x-4 p-2 bg-gray-50 rounded-md"
                >
                  <RemoteUser
                    cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                    user={user}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {user.uid}
                    </span>
                  </RemoteUser>
                </div>
              ))} */}
              {remoteUsers.map((user) => {
                // Play the remote user's audio track if it exists
                if (user.audioTrack) {
                  user.audioTrack.play(); // This will automatically play the audio
                }

                return (
                  <div
                    key={user.uid}
                    className="flex items-center space-x-4 p-2 bg-gray-50 rounded-md"
                  >
                    <RemoteUser
                      cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
                      user={user}
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {user.uid}
                      </span>
                    </RemoteUser>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg p-6 space-y-4">
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setAppId(e.target.value)}
              placeholder="Your app ID"
              value={appId}
            />
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setChannel(e.target.value)}
              placeholder="Your channel Name"
              value={channel}
            />
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setToken(e.target.value)}
              placeholder="Your token"
              value={token}
            />
            <button
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                !appId || !channel
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={!appId || !channel}
              onClick={() => setCalling(true)}
            >
              Join Channel
            </button>
          </div>
        )}
      </div>
      {isConnected && (
        <div className="mt-6 flex justify-center space-x-4">
          <button
            className={`p-3 rounded-full ${
              micOn
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-red-600 hover:bg-red-700"
            } text-white`}
            onClick={() => setMic((prev) => !prev)}
          >
            {micOn ? <MdMic size={24} /> : <MdMicOff size={24} />}
          </button>
          <button
            className={`p-3 rounded-full ${
              calling
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
            onClick={() => setCalling((prev) => !prev)}
          >
            {calling ? <MdCallEnd size={24} /> : <MdCall size={24} />}
          </button>
        </div>
      )}
    </div>
  );
}
