import { Transition, Dialog } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import { type RouterOutputs } from "../../../utils/api";
import toast from "react-hot-toast";
import { env } from "../../../env/client.mjs";
import Link from "next/link";

function PostActionButtonsModal({
  isOpen,
  closeModal,
  post,
  hasFavored,
  handleFavorite,
  setIsOpenDelete,
}: {
  isOpen: boolean;
  closeModal: () => void;
  post:
    | RouterOutputs["post"]["posts"]["posts"][number]
    | RouterOutputs["post"]["post"];
  hasFavored: boolean | undefined;
  handleFavorite: () => void;
  setIsOpenDelete: (isOpenDelete: boolean) => void;
}) {
  const { data: session } = useSession();

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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left  align-middle shadow-xl transition-all dark:bg-gray-900">
                  <div className=" flex w-full flex-col">
                    {post?.user?.id === session?.user?.id && (
                      <>
                        {" "}
                        <button
                          type="button"
                          className="inline-flex justify-center border-b  px-4 py-2 text-sm  font-medium text-red-500 focus:outline-none focus:ring-0 "
                          onClick={() => {
                            setIsOpenDelete(true);
                            closeModal();
                          }}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center border-b  px-4 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:ring-0 dark:text-white"
                          onClick={closeModal}
                        >
                          Edit
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      className="inline-flex justify-center border-b  px-4 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:ring-0 dark:text-white"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${env.NEXT_PUBLIC_URL}/p/${post.id}`
                        );
                        toast.success("link copied to clipboard");
                        closeModal();
                      }}
                    >
                      Copy link
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center border-b   px-4 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:ring-0 dark:text-white"
                    >
                      <Link href={`/p/${post.id}`}>Go to post</Link>
                    </button>
                    {post?.user?.id !== session?.user?.id && (
                      <button
                        type="button"
                        className="inline-flex justify-center border-b  px-4 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:ring-0 dark:text-white "
                        onClick={handleFavorite}
                      >
                        {hasFavored ? "Remove from" : "Add to "} favorites
                      </button>
                    )}
                    <button
                      type="button"
                      className="inline-flex justify-center  px-4 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:ring-0 dark:text-white"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
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

export default PostActionButtonsModal;
