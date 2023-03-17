import { Dialog } from "@headlessui/react";
// import { XIcon } from '@heroicons/react/solid';
import React, { useCallback, useRef, useState } from "react";
// import { useRecoilState } from 'recoil';
import { useForm } from "react-hook-form";
// import { modalState } from '../atoms/modalState';
// import { IUser } from '../lib/types';
// import { CameraIcon } from '@heroicons/react/outline';
// import { useUpdateProfileMutation } from '../generated/graphql';
import toast, { LoaderIcon } from "react-hot-toast";
import { useRouter } from "next/router";
import { AiOutlineCamera } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import { type RouterOutputs, api } from "../../utils/api";
// import { checkImage, imageUpload } from '../utils/imageUpload';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  user: RouterOutputs["user"]["user"];
}

interface Input {
  username: string | null;
  bio: string | null;
  image: string | null;
  website: string | null;
  file: undefined | File;
}

const EditProfileModal = ({ isOpen, closeModal, user }: Props) => {
  const initialInput: Input = {
    username: user.username,
    file: undefined,
    bio: user.bio,
    website: user.website,
    image: user.image,
  };
  //   const [file, setFile] = useState<File | undefined>(undefined);
  const [input, setInput] = useState(initialInput);
  const { mutateAsync: createPresignedUrl } =
    api.post.createPresignedUrl.useMutation();

  const handleImgUpload = async () => {
    // const { file } = input;
    if (!file) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { url, fields, key } = await createPresignedUrl({
      fileType: file.type,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = {
      ...fields,
      "Content-Type": file.type,
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
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed inset-0 z-50 flex justify-center"
    >
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
      <div className="relative mx-4 mt-[10vh] max-h-[85vh] w-full max-w-2xl rounded bg-white dark:bg-black ">
        <div className="flex items-center justify-end px-4 py-3">
          <IoMdClose
            className=" h-6 w-6 cursor-pointer dark:text-white"
            onClick={closeModal}
          />
        </div>
        <div>
          <span className="flex items-center justify-center text-3xl dark:text-white">
            Edit Profile
          </span>
          <form onSubmit={onSubmit} className="space-y-3 px-6 py-3">
            <div className="mb-4 space-y-2 p-3 pb-4">
              <div className="flex items-center justify-center ">
                <input
                  //   {...register('image')}
                  //   name='userLoginInput'
                  type="file"
                  onChange={onFileChange}
                  accept="image/*"
                  // value={file}
                  ref={fileInputRef}
                  className="mt-1 hidden w-full rounded border border-gray-300 p-2 outline-none"
                />
                <div className="relative inline-block">
                  <Image
                    height={28}
                    width={28}
                    className="h-28 w-28 rounded-full  border-2 border-teal-200 object-cover"
                    src={
                      input.file
                        ? (URL.createObjectURL(input.file) as string)
                        : user && (user.image as string)
                    }
                    alt=""
                  />
                  <div className="absolute top-0 flex h-full w-full items-center justify-center rounded-full bg-black bg-opacity-25">
                    <span
                      className="rounded-full p-2 focus:outline-none hover:bg-white hover:bg-opacity-25"
                      onClick={handleClick}
                    >
                      <AiOutlineCamera className="h-5 w-5 cursor-pointer text-white" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                {/* <div className='w-full'>
                  <label
                    htmlFor=''
                    className='block text-sm font-bold text-gray-600 dark:text-white'
                  >
                    Full name
                  </label>
                  <input
                    {...register('name')}
                    name='name'
                    type='text'
                    className='mt-1 w-full rounded border border-gray-300 p-2 outline-none dark:bg-white'
                  />
                </div> */}
                <div className="w-full">
                  <label
                    htmlFor=""
                    className="block text-sm font-bold text-gray-600 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    // {...register('username')}
                    value={input.username}
                    onChange={onChange}
                    name="username"
                    type="text"
                    className="mt-1 w-full rounded border border-gray-300 p-2 outline-none dark:bg-white"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="w-full">
                  <label
                    htmlFor=""
                    className="block text-sm font-bold text-gray-600 dark:text-white"
                  >
                    Website
                  </label>
                  <input
                    value={input.website}
                    onChange={onChange}
                    name="website"
                    type="url"
                    className="mt-1 w-full rounded border border-gray-300 p-2 outline-none dark:bg-white"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor=""
                    className="block text-sm font-bold text-gray-600 dark:text-white"
                  >
                    Bio
                  </label>
                  <input
                    value={input.bio}
                    onChange={onChange}
                    name="bio"
                    type="text"
                    // value={user.bio}
                    // onChange={(e) => console.log(e)}
                    className="mt-1 w-full rounded border border-gray-300 p-2 outline-none dark:bg-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="block w-full items-center  justify-center rounded bg-blue-500 px-4 py-2 text-white"
              >
                {/* {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-1 h-6 w-6 animate-spin"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                    </svg>
                    Updating...
                  </span>
                ) : ( */}
                <span>Update Profile</span>
                {/* )} */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default EditProfileModal;
