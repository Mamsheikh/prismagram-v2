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

interface CreatePostModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
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
}) => {
  const [file, setFile] = useState<File | undefined>();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [isFileNearBy, setIsFileNearBy] = useState<boolean>(false);
  const [isFileOver, setIsFileOver] = useState(false);
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
      setFile(file);
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setPreview(reader.result as string);
      // };
      // reader.readAsDataURL(file);
    }
  };

  if (isFileNearBy && !isFileOver) extraClasses += " text-blue-300";
  if (isFileOver) extraClasses += " text-blue-500";

  // const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setInput((prev) => ({ ...prev, [name]: value }));
  // };
  function closeModal() {
    setIsOpen(false);
  }

  // const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files?.[0]) return setError("No file selected");
  //   if (e.target.files[0].size > MAX_FILE_SIZE) return setError("File too big");
  //   // const ob
  //   // setInput((prev) => ({ ...prev, file: e.target.files![0] }));
  // };

  useEffect(() => {
    // create the preview
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  console.log(file);
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
                  } transform overflow-hidden rounded-2xl bg-white  text-left align-middle shadow-xl transition-all  xl:max-w-2xl`}
                >
                  <Dialog.Title
                    as="h3"
                    className="flex  justify-between border-b-2 px-6 py-4 pb-2 text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    {preview && (
                      <div className="flex items-center justify-start">
                        <AiOutlineArrowLeft
                          className="cursor-pointer"
                          onClick={() => {
                            setFile(undefined);
                            setPreview("");
                          }}
                        />
                      </div>
                    )}
                    <span className="flex-1 justify-center">
                      Create new post
                    </span>
                    <IoMdClose
                      className="h-5 w-5 cursor-pointer text-gray-600"
                      onClick={closeModal}
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
                      onDrop={(files) => setFile(files![0])}
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
                          <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                          <p className="text-xs text-gray-500">mamsheikh_01</p>
                        </div>
                        <div className="h-1/2">
                          <textarea
                            className="h-full w-full  border-0 text-sm text-gray-900 focus:ring-0  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 "
                            placeholder="Write a caption..."
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <BsEmojiSmile className="cursor-pointer text-gray-600" />
                          <span className="text-xs text-gray-600">0/200</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {!preview && !file && (
                    <div className="mt-4 mb-6 flex flex-col space-y-4">
                      <div className="flex items-center justify-center px-6 py-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md  bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default CreatePostModal;
