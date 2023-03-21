import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { Fragment } from "react";

interface DropdownProps {
  image: string;
  id: string;
}

const Dropdown: React.FC<DropdownProps> = ({ image, id }) => {
  return (
    <div>
      <Menu as="div" className="relative">
        <Menu.Button>
          <Image
            height={20}
            width={20}
            src={image}
            className=" navBtn rounded-full border object-cover"
            alt=""
          />

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-32  origin-top-right rounded-md border bg-white shadow-lg dark:bg-black">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={`/u/${id}`}
                    className={`${
                      active ? "bg-gray-100 " : ""
                    } block px-3 py-2 text-gray-700 hover:bg-gray-200 dark:text-white `}
                  >
                    Profile
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                <button
                  onClick={() => signOut()}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 dark:text-white"
                >
                  Logout
                </button>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu.Button>
      </Menu>
    </div>
  );
};

export default Dropdown;
