import { Session } from "next-auth";
import React from "react";

interface AuthProps {
  session: Session | null;
  reloadSession: () => void;
}
const Auth: React.FC<AuthProps> = ({ session }) => {
  return <>{session ? <div>username form</div> : <div>login form</div>}</>;
};

export default Auth;
