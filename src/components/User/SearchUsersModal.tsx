import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";
import { Fragment, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { api } from "../../utils/api";
export default function MyModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) {
  const [username, setUsername] = useState("");
  const { data, isFetching } = api.user.searchUsers.useQuery(
    {
      searchUsername: username,
    },
    {
      enabled: !!username,
    }
  );

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

          <div className="fixed inset-0 overflow-y-auto">
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
                <Dialog.Panel className=" w-full max-w-xs transform overflow-hidden rounded bg-white text-left align-middle  shadow-xl transition-all dark:bg-gray-900 md:max-w-xl">
                  <div className="">
                    <div className="flex w-full items-center border-b px-4">
                      <CiSearch />
                      <input
                        type="text"
                        placeholder="Search users"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full  border-transparent focus:border-transparent focus:ring-0 dark:bg-gray-900"
                      />
                    </div>
                    <div className="h-[406px] overflow-hidden overflow-y-auto pb-6  scrollbar-thin scrollbar-thumb-slate-500">
                      {data &&
                        data.map((user) => (
                          <div
                            key={user.id}
                            className="oveflow-hidden mt-4 flex items-center justify-between px-6"
                          >
                            <Link href={`/u/${user.id}`}>
                              <div className="flex items-center">
                                <Image
                                  src={user.image as string}
                                  height={20}
                                  width={20}
                                  className="h-10 w-10 rounded-full object-cover"
                                  alt={` profile photo`}
                                />
                                <div className="flex  w-[100px] flex-col">
                                  <span className="ml-2 truncate  font-semibold">
                                    {user.username}
                                  </span>
                                  <span className="ml-2 flex-shrink-0  text-xs text-gray-400">
                                    {user.name}
                                  </span>
                                </div>
                              </div>
                            </Link>
                            <div>
                              <Link
                                href={`/u/${user.id}`}
                                className="rounded-sm border px-3 py-2 text-sm text-gray-600 dark:text-white"
                              >
                                View profile
                              </Link>
                            </div>
                          </div>
                        ))}
                      {isFetching ? (
                        <div className="mt-20 flex items-center justify-center">
                          Loading...
                        </div>
                      ) : null}

                      {data && data.length === 0 && (
                        <div className="mt-20 flex items-center justify-center">
                          No user found
                        </div>
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
}
