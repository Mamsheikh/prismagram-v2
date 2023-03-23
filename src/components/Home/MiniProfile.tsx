import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import React from "react";

interface MiniProfileProps {
  session: Session | null;
}

const MiniProfile: React.FC<MiniProfileProps> = ({ session }) => {
  return (
    <div className="mt-10 ml-10 flex items-center justify-center">
      <div className=" relative  rounded-full">
        <Image
          height={20}
          width={20}
          className="h-12 w-12 rounded-full"
          src={session?.user?.image as string}
          alt="profile"
        />
      </div>
      <div className="mx-4 flex-1">
        <h2 className="font-bold dark:text-gray-300">
          {session?.user?.username}
        </h2>
        <h3 className="text-sm text-gray-400">Welcome to Prismagram</h3>
      </div>
      <button
        onClick={() => signOut()}
        className="text-sm font-bold text-blue-400"
      >
        Sign out
      </button>
    </div>
  );
};

export default MiniProfile;
