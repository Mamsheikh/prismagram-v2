import React from "react";
import { api, type RouterOutputs } from "../../utils/api";
import { useQueryClient } from "@tanstack/react-query";

interface FollowBtnProps {
  isFollowing: boolean;
  userId: string;
  //   userId: string;
}

const FollowBtn: React.FC<FollowBtnProps> = ({ isFollowing, userId }) => {
  const client = useQueryClient();
  const utils = api.useContext();
  const { mutateAsync: follow } = api.follow.follow.useMutation({
    onSuccess: (data, variables) => {
      utils.user.user.invalidate();
      // utils.user.followers.invalidate();
      // utils.user.following.invalidate();
      //   client.setQueryData(
      //     [
      //       ["user", "user"],
      //       {
      //         input: {
      //           userId: variables.followId,
      //         },
      //         type: "query",
      //       },
      //     ],
      //     (prevData) => {
      //       const newData = prevData as RouterOutputs["user"]["user"];
      //       newData.followers = [{ id: data.id }];
      //       newData.isFollowing = true;
      //       newData._count.followers += 1;
      //       return newData;
      //     }
      //   );
      //   if (user) {
      //     utils.user.user.setData({ userId: user.id }, (prevData) => {
      //       if (prevData) {
      //         prevData.isFollowing = true;
      //         prevData.followers = [{ id: data.id }];
      //         prevData._count.followers += 1;
      //       }

      //       return prevData;
      //     });
      //   }
    },
  });
  const { mutateAsync: unfollow } = api.follow.unfollow.useMutation({
    onSuccess: () => {
      utils.user.user.invalidate();
      // utils.user.followers.invalidate();
      // utils.user.following.invalidate();
      //   if (user) {
      //     utils.user.user.setData({ userId: user.id }, (prevData) => {
      //       if (prevData) {
      //         prevData.isFollowing = false;
      //         prevData.followers.pop();
      //         prevData._count.followers -= 1;
      //       }

      //       return prevData;
      //     });
      //   }
    },
  });

  const handleFollow = () => {
    follow({
      followId: userId,
    });
  };
  const handleUnFollow = () => {
    unfollow({ followedId: userId });
  };
  return (
    <>
      {isFollowing ? (
        <button
          onClick={handleUnFollow}
          className="rounded-md bg-red-500 px-4  py-1 text-white"
        >
          Unfollow
        </button>
      ) : (
        <button
          onClick={handleFollow}
          className="rounded-md bg-blue-500 px-5 py-1 text-white"
        >
          Follow
        </button>
      )}
    </>
  );
};

export default FollowBtn;
