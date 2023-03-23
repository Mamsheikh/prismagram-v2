import Link from "next/link";
import Image from "next/image";
import { api } from "../../utils/api";

const Suggestions = () => {
  const { data } = api.user.userSuggesstions.useQuery();
  return (
    <div className="mt-4 ml-10">
      <div className="mb-5 flex justify-between text-sm">
        <h3 className="text-sm font-semibold text-gray-400">Suggestions</h3>
        <button className="font-semibold text-gray-600">See All</button>
      </div>
      {data &&
        data.map((user) => (
          <div key={user.id} className="mt-3 flex items-center justify-between">
            <div className="relative">
              <Image
                height={20}
                width={20}
                src={user.image as string}
                alt="user"
                className="h-10 w-10 rounded-full"
              />
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-sm font-semibold">{user.username}</h2>
              <h3 className="text-xs text-gray-400">New to Prismagram</h3>
            </div>
            <div className="text-xs font-bold text-blue-400">
              <Link href={`/u/${user.id}`}>View Profile</Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Suggestions;
