/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import { api } from "../../utils/api";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  userId: string;
}

const FollowersModal: React.FC<IProps> = ({ isOpen, closeModal, userId }) => {
  const { data, hasNextPage, fetchNextPage } =
    api.user.followers.useInfiniteQuery(
      { limit: 5, userId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  if (!data) return null;
  const followers = data?.pages.flatMap((page) => page.followers) ?? [];

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" w-full max-w-sm transform  rounded-2xl bg-white text-left  align-middle shadow-xl transition-all dark:bg-gray-900">
                  <Dialog.Title
                    as="h3"
                    className=" border-b px-6 py-2 text-center text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    <div className="flex items-center justify-center">
                      <div className="flex-1 dark:text-white">Followers</div>
                      <div className="-mr-3 flex justify-end">
                        <IoMdClose
                          className=" flex h-5 w-5 cursor-pointer justify-end text-gray-600 dark:text-white"
                          onClick={closeModal}
                        />
                      </div>
                    </div>
                  </Dialog.Title>
                  <div className="h-fit max-h-[406px] overflow-hidden overflow-y-auto  scrollbar-thumb-slate-500">
                    {followers &&
                      followers.map((follower) => (
                        <div
                          key={follower.id}
                          className="oveflow-hidden mt-4 flex items-center justify-between px-6"
                        >
                          <div className="flex items-center">
                            <Image
                              src={follower.image as string}
                              height={20}
                              width={20}
                              className="h-10 w-10 rounded-full object-cover"
                              alt={`${follower.username} profile photo`}
                            />
                            <div className="flex flex-col">
                              <span className="ml-2 font-semibold">
                                {follower.username}
                              </span>
                              <span className="ml-2 text-xs text-gray-400">
                                {follower.name}
                              </span>
                            </div>
                          </div>
                          <div>
                            {/* <FollowBtn
                              isFollowing={follower.isFollowing}
                              userId={follower.id}
                            /> */}
                            <Link
                              href={`/u/${follower.id}`}
                              className="rounded-sm border px-3 py-2 text-sm text-gray-600 dark:text-white"
                            >
                              View profile
                            </Link>
                          </div>
                        </div>
                      ))}
                    <div className="mt-4 flex justify-center">
                      {hasNextPage && (
                        <button
                          type="button"
                          className="mr-2 mb-2 rounded-lg bg-teal-500 px-5 py-1 text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 hover:bg-blue-800 dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700"
                          onClick={() => fetchNextPage()}
                        >
                          Load more
                        </button>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default FollowersModal;
