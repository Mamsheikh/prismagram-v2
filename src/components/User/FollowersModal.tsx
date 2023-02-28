/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Image from "next/image";
import { api } from "../../utils/api";
import FollowBtn from "../common/FollowBtn";

interface IProps {
  isOpen: boolean;
  closeModal: () => void;
  userId: string;
}

const FollowersModal: React.FC<IProps> = ({ isOpen, closeModal, userId }) => {
  // const { data: followers } = api.user.followers.useQuery({
  //   userId,
  // });
  // if (!followers) return null;

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
                <Dialog.Panel className=" w-full max-w-sm transform  rounded-2xl bg-white  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="border-b px-6 py-2 text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Followers
                  </Dialog.Title>
                  <div className="h-[406px] overflow-hidden overflow-y-auto  scrollbar-thumb-slate-500">
                    {/* {followers &&
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
                            <FollowBtn
                              isFollowing={follower.isFollowing}
                              userId={follower.id}
                            />
                          </div>
                        </div>
                      ))} */}
                    <div className="mt-4 flex w-full flex-col">
                      <button
                        type="button"
                        className="inline-flex justify-center   px-4 py-2 text-sm font-semibold  text-red-500 focus:outline-none focus:ring-0 "
                        onClick={closeModal}
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                  {/* <div className="mt-4 flex items-center justify-between px-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-500"></div>
                      <div className="flex flex-col items-center">
                        <span className="ml-4 font-semibold">Mr_zero</span>
                        <span className="ml-2 text-xs text-gray-400">
                          Munir Ali
                        </span>
                      </div>
                    </div>
                    <div>
                      <button className="rounded bg-teal-500 px-4 py-1">
                        Follow
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between px-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-500"></div>
                      <div className="flex flex-col items-center">
                        <span className="ml-4 font-semibold">Mr_zero</span>
                        <span className="ml-2 text-xs text-gray-400">
                          Munir Ali
                        </span>
                      </div>
                    </div>
                    <div>
                      <button className="rounded bg-teal-500 px-4 py-1">
                        Follow
                      </button>
                    </div>
                  </div> */}
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
