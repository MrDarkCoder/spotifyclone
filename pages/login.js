import { getProviders, signIn } from "next-auth/react";

function login({ providers }) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <h2 className="w-52 mb-5">Spotify</h2>

      {Object.values(providers).map((prvoider) => (
        <div key={prvoider.name}>
          <button
            onClick={() => signIn(prvoider.id, { callbackUrl: "/" })}
            className="bg-[#18d860] text-white p-5 rounded-full"
          >
            Login with {prvoider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}

export default login;
