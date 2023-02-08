import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FcAddImage } from "react-icons/fc";

interface CreatePostModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={closeModal}
          //   open={isOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex  min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all  xl:max-w-2xl">
                  <Dialog.Title
                    as="h3"
                    className="border-b-2 pb-2 text-center  text-lg font-medium leading-6 text-gray-900"
                  >
                    Create new post
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col items-center justify-center space-y-4 py-8">
                    <FcAddImage className="h-24 w-24" />
                    <p className="text-sm text-gray-500">Drag photo here</p>
                  </div>

                  <div className="mt-4 flex flex-col space-y-4">
                    <div className="flex items-center justify-center px-6 py-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md  bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Select from computer
                      </button>
                    </div>
                    <button
                      className="inline-flex max-w-[5rem] rounded border-2 border-red-600 px-4 py-2 text-xs font-medium uppercase leading-tight text-red-600 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
                      type="button"
                      onClick={closeModal}
                    >
                      cancel
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
};
export default CreatePostModal;
