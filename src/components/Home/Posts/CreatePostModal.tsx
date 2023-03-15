/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @next/next/no-img-element */
import { Dialog, Transition } from "@headlessui/react";
import {
  type ChangeEvent,
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { FiImage } from "react-icons/fi";
import { FileDrop } from "react-file-drop";
import Image from "next/image";
import { MAX_FILE_SIZE } from "../../../server/api/routers/user";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { api } from "../../../utils/api";
import { Session } from "next-auth";

interface CreatePostModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  session: Session | null;
}

interface Input {
  caption: string;
  file: undefined | File;
}

const initialInput: Input = {
  caption: "",
  file: undefined,
};
const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  setIsOpen,
  session,
}) => {
  // const [file, setFile] = useState<File | undefined>();
  const [input, setInput] = useState(initialInput);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [isFileNearBy, setIsFileNearBy] = useState<boolean>(false);
  const [isFileOver, setIsFileOver] = useState(false);
  const [close, setClose] = useState(false);
  let extraClasses = "";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files?.[0]) {
      const file = event.target.files[0];
      // if (file.size > MAX_FILE_SIZE) return "file too big";
      // setFile(file);
      setInput((prev) => ({ ...prev, file }));
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setPreview(reader.result as string);
      // };
      // reader.readAsDataURL(file);
    }
  };

  if (isFileNearBy && !isFileOver) extraClasses += " text-blue-300";
  if (isFileOver) extraClasses += " text-blue-500";

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, caption: value }));
  };
  function closeModal() {
    setIsOpen(false);
  }

  function closeDiscardModal() {
    setClose(false);
  }

  function openDiscardModal() {
    setClose(true);
  }

  function discard() {
    setInput(initialInput);
    setPreview("");
    closeModal();
  }
  const utils = api.useContext();
  const { mutateAsync: createPresignedUrl } =
    api.post.createPresignedUrl.useMutation();
  const { mutateAsync: createPost } = api.post.createPost.useMutation({
    onSuccess: () => {
      utils.post.posts.invalidate();
    },
  });

  const handleImgUpload = async () => {
    const { file } = input;
    if (!input.file) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { url, fields, key } = await createPresignedUrl({
      fileType: input.file.type,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = {
      ...fields,
      "Content-Type": input.file.type,
      file,
    };

    const formData = new FormData();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    await fetch(url, {
      method: "POST",
      body: formData,
    });

    return key;
  };

  const handleCreatePost = async () => {
    setLoading(true);
    const key = await handleImgUpload();
    if (!key) throw new Error("No key");
    const { caption } = input;
    await createPost({
      caption,
      imageKey: key,
    });

    setLoading(false);
    // refetch()

    discard();
  };

  useEffect(() => {
    // create the preview
    if (!input.file) return;
    const objectUrl = URL.createObjectURL(input.file);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [input.file]);

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
                <Dialog.Panel
                  className={`w-full ${
                    preview ? "max-w-2xl" : "max-w-md"
                  } transform overflow-hidden rounded-2xl bg-white text-left  align-middle shadow-xl transition-all dark:bg-gray-900  xl:max-w-2xl`}
                >
                  <Dialog.Title
                    as="h3"
                    className="flex  justify-between border-b-2 px-6 py-4 pb-2 text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    {preview && (
                      <div className="flex items-center justify-start">
                        <AiOutlineArrowLeft
                          className="cursor-pointer"
                          onClick={openDiscardModal}
                        />
                      </div>
                    )}
                    <span className="flex-1 justify-center dark:text-white">
                      Create new post
                    </span>
                    <IoMdClose
                      className="h-5 w-5 cursor-pointer text-gray-600 dark:text-white"
                      onClick={() => {
                        if (preview) openDiscardModal();
                        else {
                          closeModal();
                        }
                      }}
                    />
                    {/* <div className=""> */}
                    {/* </div> */}
                  </Dialog.Title>
                  {!preview ? (
                    <FileDrop
                      onFrameDragEnter={() => setIsFileNearBy(true)}
                      onFrameDragLeave={() => setIsFileNearBy(false)}
                      onDragOver={() => setIsFileOver(true)}
                      onDragLeave={() => setIsFileOver(false)}
                      onDrop={(files) =>
                        setInput((prev) => ({ ...prev, file: files?.[0] }))
                      }
                      // frame={}
                    >
                      <div
                        className={
                          "mt-2 flex flex-col items-center justify-center space-y-4  py-8 " +
                          extraClasses
                        }
                      >
                        {/* {isFileOver ? "hover" : "no hover by"} */}
                        <FiImage
                          className={"h-24 w-24 text-gray-400" + extraClasses}
                        />
                        <p className="text-sm text-gray-500">Drag photo here</p>
                      </div>
                    </FileDrop>
                  ) : (
                    <div className="flex">
                      <div className=" h-[406px] w-[406px] flex-1 ">
                        <img
                          className=" h-full w-full object-cover"
                          src={preview}
                          alt=""
                        />
                      </div>
                      <div className=" space-y-4 border-l-2 px-4 py-2">
                        <div className="flex items-center space-x-4">
                          {/* <div className="h-8 w-8 rounded-full bg-blue-500"></div> */}
                          <img
                            src={session?.user?.image as string}
                            alt={`${session?.user?.username} profile photo`}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                          <p className="text-xs text-gray-500">
                            {session?.user?.username}
                          </p>
                        </div>
                        <div className="h-1/2">
                          <textarea
                            className="h-full w-full resize-none  border-0 text-sm text-gray-900 focus:ring-0  dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 "
                            placeholder="Write a caption..."
                            value={input.caption}
                            onChange={handleTextChange}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <BsEmojiSmile className="cursor-pointer text-gray-600" />
                          <span className="text-xs text-gray-600">0/200</span>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={handleCreatePost}
                            className="mr-2 mb-2 rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 focus:ring-green-200 hover:bg-gradient-to-bl dark:focus:ring-green-800"
                          >
                            {loading ? (
                              <>
                                <svg
                                  aria-hidden="true"
                                  role="status"
                                  className="mr-3 inline h-4 w-4 animate-spin text-white"
                                  viewBox="0 0 100 101"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB"
                                  />
                                  <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor"
                                  />
                                </svg>
                                Sharing...
                              </>
                            ) : (
                              "Share"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!preview && !input.file && (
                    <div className="mt-4 mb-6 flex flex-col space-y-4">
                      <div className="flex items-center justify-center px-6 py-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md  bg-blue-500 px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:bg-blue-600"
                          onClick={handleClick}
                        >
                          Select from computer
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={onFileChange}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                      </div>

                      {/* <button
                      className="inline-flex max-w-[5rem] rounded border-2 border-red-600 px-4 py-2 text-xs font-medium uppercase leading-tight text-red-600 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
                      type="button"
                      onClick={closeModal}
                    >
                      cancel
                    </button> */}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
              <DiscardModal
                close={close}
                closeDiscardModal={closeDiscardModal}
                discard={discard}
              />
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default CreatePostModal;

function DiscardModal({
  close,
  closeDiscardModal,
  discard,
}: {
  close: boolean;
  closeDiscardModal: () => void;
  discard: () => void;
}) {
  return (
    <>
      <Transition appear show={close} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDiscardModal}>
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="px-6 pt-6 pt-4 text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Discard post?
                  </Dialog.Title>
                  <div className="mt-2 ">
                    <p className="text-center text-sm text-gray-500">
                      If you leave, your edits won&apos;t be saved.
                    </p>
                  </div>

                  <div className="mt-4 flex w-full flex-col">
                    <button
                      type="button"
                      className="inline-flex justify-center   px-4 py-2 text-sm font-semibold font-medium text-red-500 focus:outline-none focus:ring-0 "
                      onClick={discard}
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center   px-4 py-2 text-sm font-medium text-gray-600 focus:outline-none focus:ring-0 "
                      onClick={closeDiscardModal}
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
