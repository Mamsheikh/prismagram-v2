import { type InfiniteData } from "@tanstack/react-query";
import { type Session } from "next-auth";
import React from "react";
import { MdVerified } from "react-icons/md";
import { type RouterOutputs } from "../../utils/api";

type DesktopProfileProps = {
  user: RouterOutputs["user"]["user"];
  data: InfiniteData<RouterOutputs["post"]["posts"]> | undefined;
  session: Session | null;
  isOpen: boolean;
  closeModal: () => void;
  isOpenFollowing: boolean;
  closeFollowingModal: () => void;
  LIMIT: number;
};

const DesktopProfile: React.FC<DesktopProfileProps> = () => {
  return (
    <main className="bg-gray-100 bg-opacity-25 pt-20">
      <div className="mb-8 lg:mx-auto lg:w-8/12">
        <header className="flex flex-wrap items-center p-4 md:py-8">
          <div className="md:ml-16 md:w-3/12">
            {/* <!-- profile image --> */}
            <img
              className="h-20 w-20 rounded-full border-2 border-pink-600 object-cover
                     p-1 md:h-40 md:w-40"
              src="https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
              alt="profile"
            />
          </div>

          {/* <!-- profile meta --> */}
          <div className="ml-4 w-8/12 md:w-7/12">
            <div className="mb-4 md:flex md:flex-wrap md:items-center">
              <h2 className="mb-2 inline-block text-3xl font-light sm:mb-0 md:mr-2">
                mrtravlerrr_
              </h2>

              {/* <!-- badge --> */}
              <span
                className=" relative mr-6 inline-block -translate-y-2 transform text-xl text-blue-500"
                aria-hidden="true"
              >
                <MdVerified />
              </span>

              {/* <!-- follow button --> */}
              <a
                href="#"
                className="block  rounded 
                        bg-blue-500 px-2 py-1 text-center text-sm font-semibold 
                        text-white sm:inline-block"
              >
                Follow
              </a>
            </div>

            {/* <!-- post, following, followers list for medium screens --> */}
            <ul className="mb-4 hidden space-x-8 md:flex">
              <li>
                <span className="font-semibold">136</span>
                posts
              </li>

              <li>
                <span className="font-semibold">40.5k</span>
                followers
              </li>
              <li>
                <span className="font-semibold">302</span>
                following
              </li>
            </ul>

            {/* <!-- user meta form medium screens --> */}
            <div className="hidden md:block">
              <h1 className="font-semibold">Mr Travlerrr...</h1>
              <span>Travel, Nature and Music</span>
              <p>Lorem ipsum dolor sit amet consectetur</p>
            </div>
          </div>

          {/* <!-- user meta form small screens --> */}
          <div className="my-2 text-sm md:hidden">
            <h1 className="font-semibold">Mr Travlerrr...</h1>
            <span>Travel, Nature and Music</span>
            <p>Lorem ipsum dolor sit amet consectetur</p>
          </div>
        </header>

        {/* <!-- posts --> */}
        <div className="px-px md:px-3">
          {/* <!-- user following for mobile only --> */}
          <ul
            className="flex justify-around space-x-8 border-t p-2 
                text-center text-sm leading-snug text-gray-600 md:hidden"
          >
            <li>
              <span className="block font-semibold text-gray-800">136</span>
              posts
            </li>

            <li>
              <span className="block font-semibold text-gray-800">40.5k</span>
              followers
            </li>
            <li>
              <span className="block font-semibold text-gray-800">302</span>
              following
            </li>
          </ul>

          {/* <!-- insta freatures --> */}
          <ul
            className="flex items-center justify-around space-x-12 border-t  
                    text-xs font-semibold uppercase tracking-widest text-gray-600
                    md:justify-center"
          >
            {/* <!-- posts tab is active --> */}
            <li className="md:-mt-px md:border-t md:border-gray-700 md:text-gray-700">
              <a className="inline-block p-3" href="#">
                <i className="fas fa-th-large text-xl md:text-xs"></i>
                <span className="hidden md:inline">post</span>
              </a>
            </li>
            <li>
              <a className="inline-block p-3" href="#">
                <i className="far fa-square text-xl md:text-xs"></i>
                <span className="hidden md:inline">igtv</span>
              </a>
            </li>
            <li>
              <a className="inline-block p-3" href="#">
                <i
                  className="fas fa-user rounded border
                             border-gray-500 px-1 pt-1 text-xl md:text-xs"
                ></i>
                <span className="hidden md:inline">tagged</span>
              </a>
            </li>
          </ul>
          {/* <!-- flexbox grid --> */}
          <div className="-mx-px flex flex-wrap md:-mx-3">
            {/* <!-- column --> */}
            <div className="w-1/3 p-px md:px-3">
              {/* <!-- post 1--> */}
              <a href="#">
                <article className="post pb-full relative bg-gray-100 text-white md:mb-6">
                  {/* <!-- post image--> */}
                  <img
                    className="absolute left-0 top-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                    alt="image"
                  />

                  <i className="fas fa-square absolute right-0 top-0 m-1"></i>
                  {/* <!-- overlay--> */}
                  <div
                    className="overlay absolute left-0 top-0 hidden h-full 
                                w-full bg-gray-800 bg-opacity-25"
                  >
                    <div
                      className="flex h-full items-center 
                                    justify-center space-x-4"
                    >
                      <span className="p-2">
                        <i className="fas fa-heart"></i>
                        412K
                      </span>

                      <span className="p-2">
                        <i className="fas fa-comment"></i>
                        2,909
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </div>

            <div className="w-1/3 p-px md:px-3">
              <a href="#">
                {/* <!-- post 2 --> */}
                <article className="post pb-full relative bg-gray-100 text-white md:mb-6">
                  <img
                    className="absolute left-0 top-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1498409570040-05bf6d3dd5b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                    alt="image"
                  />

                  {/* <!-- overlay--> */}
                  <div
                    className="overlay absolute left-0 top-0 hidden h-full 
                                w-full bg-gray-800 bg-opacity-25"
                  >
                    <div
                      className="flex h-full items-center 
                                    justify-center space-x-4"
                    >
                      <span className="p-2">
                        <i className="fas fa-heart"></i>
                        412K
                      </span>

                      <span className="p-2">
                        <i className="fas fa-comment"></i>
                        1,993
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </div>

            <div className="w-1/3 p-px md:px-3">
              <a href="#">
                <article className="post pb-full relative bg-gray-100 text-white  md:mb-6">
                  <img
                    className="absolute left-0 top-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                    alt="image"
                  />
                  {/* <!-- overlay--> */}
                  <div
                    className="overlay absolute left-0 top-0 hidden h-full 
                                w-full bg-gray-800 bg-opacity-25"
                  >
                    <div
                      className="flex h-full items-center 
                                    justify-center space-x-4"
                    >
                      <span className="p-2">
                        <i className="fas fa-heart"></i>
                        112K
                      </span>

                      <span className="p-2">
                        <i className="fas fa-comment"></i>
                        2,090
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </div>

            <div className="w-1/3 p-px md:px-3">
              <a href="#">
                <article className="post pb-full relative bg-gray-100 text-white md:mb-6">
                  <img
                    className="absolute left-0 top-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                    alt="image"
                  />

                  <i className="fas fa-video absolute right-0 top-0 m-1"></i>

                  {/* <!-- overlay--> */}
                  <div
                    className="overlay absolute left-0 top-0 hidden h-full 
                                w-full bg-gray-800 bg-opacity-25"
                  >
                    <div
                      className="flex h-full items-center 
                                    justify-center space-x-4"
                    >
                      <span className="p-2">
                        <i className="fas fa-heart"></i>
                        841K
                      </span>

                      <span className="p-2">
                        <i className="fas fa-comment"></i>
                        909
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </div>

            <div className="w-1/3 p-px md:px-3">
              <a href="#">
                <article className="post pb-full relative bg-gray-100 text-white md:mb-6">
                  <img
                    className="absolute left-0 top-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1475688621402-4257c812d6db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"
                    alt="image"
                  />
                  {/* <!-- overlay--> */}
                  <div
                    className="overlay absolute left-0 top-0 hidden h-full 
                                w-full bg-gray-800 bg-opacity-25"
                  >
                    <div
                      className="flex h-full items-center 
                                    justify-center space-x-4"
                    >
                      <span className="p-2">
                        <i className="fas fa-heart"></i>
                        120K
                      </span>

                      <span className="p-2">
                        <i className="fas fa-comment"></i>
                        3,909
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default DesktopProfile;
