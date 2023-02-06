import type { Session } from "next-auth";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { api } from "../../utils/api";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}
const Auth: React.FC<AuthProps> = ({ session, reloadSession }) => {
  return (
    <>
      {session ? <UsernameForm relaodSession={reloadSession} /> : <LoginForm />}
    </>
  );
};

export default Auth;

interface UsernameFormProps {
  relaodSession: () => void;
}
const UsernameForm: React.FC<UsernameFormProps> = ({ relaodSession }) => {
  const [username, setUsername] = useState("");
  const createUsername = api.user.createUsername.useMutation().mutateAsync;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    try {
      await createUsername({ username });
      relaodSession();
    } catch {
      throw new Error("error");
    }
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 ">
      <div className=" flex w-full max-w-md flex-col items-center space-y-4 rounded border-gray-300 bg-white py-8   pb-4  shadow-md">
        <h2
          className=" mb-4 text-gray-800 dark:text-white"
          style={{ fontFamily: "Grand Hotel", fontSize: "3rem" }}
        >
          Prismagram
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mb-4 space-y-4 px-4 pb-16 pt-2"
        >
          <label className="text-md font-semibold text-gray-700">
            Create a username
          </label>

          <input
            type="text"
            className=" w-full rounded-lg border px-4 py-2"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            className="dark:focus:ring-[#4285F4]/55 mr-2 mb-5    w-full  justify-center rounded-lg bg-[#4285F4]  py-2.5  text-sm font-medium text-white hover:bg-[#4285F4]/90 focus:outline-none  focus:ring-4 focus:ring-[#4285F4]/50"
          >
            Continue
            {/* {isLoading ? "loading..." : "Continue to Prismagram"} */}
          </button>
        </form>
      </div>
    </div>
  );
};
