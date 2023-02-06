import type { Session } from "next-auth";
import React from "react";
import LoginForm from "./LoginForm";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}
const Auth: React.FC<AuthProps> = ({ session }) => {
  return <>{session ? <UsernameForm /> : <LoginForm />}</>;
};

export default Auth;

const UsernameForm = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 ">
      <div className=" flex w-full max-w-md flex-col items-center space-y-4 rounded border-gray-300 bg-white py-8   pb-4  shadow-md">
        <h2
          className=" mb-4 text-gray-800 dark:text-white"
          style={{ fontFamily: "Grand Hotel", fontSize: "3rem" }}
        >
          Prismagram
        </h2>
        <div className="mb-4 space-y-4 px-4 pb-16 pt-2">
          <label className="text-md font-semibold text-gray-700">
            Create a username
          </label>
          <input
            type="text"
            className=" w-full rounded-lg border px-4 py-2"
            placeholder="Enter username"
          />
          <button
            type="button"
            className="dark:focus:ring-[#4285F4]/55 mr-2 mb-5    w-full  justify-center rounded-lg bg-[#4285F4]  py-2.5  text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none  focus:ring-4 focus:ring-[#4285F4]/50"
            onClick={() => console.log("helo")}
          >
            Continue to Prismagram
          </button>
        </div>
      </div>
    </div>
  );
};
