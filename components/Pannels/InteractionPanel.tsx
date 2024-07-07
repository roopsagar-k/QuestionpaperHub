"use client";
import { useEffect, useState } from "react";
import { addToBookMark } from "@/lib/actions";
import { removeBookMark } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Post, Vote, UserVoteType } from "@/app/types/types";
import axios from "axios";
import CopyLinkComponent from "../CopyLinkComponent";
import { usePathname } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import Login from "../auth/Login";
import { Dialog } from "@/components/ui/dialog";
import AuthModal from "../auth/AuthModal";
import Register from "../auth/Register";
import { useMediaQuery } from "react-responsive";

interface InteractionPanelProps {
  setShowTextArea?: React.Dispatch<React.SetStateAction<boolean>>;
  post: Post;
  vote: UserVoteType;
  setVote: React.Dispatch<React.SetStateAction<UserVoteType | undefined>>;
  setBookMarkUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const InteractionPanel: React.FC<InteractionPanelProps> = ({
  setShowTextArea,
  post,
  vote,
  setVote,
  setBookMarkUpdate,
}) => {
  const router = useRouter();
  const { user } = useUserContext();
  const [isBookMark, setIsBookMark] = useState<boolean>(false);
  const pathName = usePathname();
  let link = process.env.BASE_URL || "https://questionpaper-hub.vercel.app/";
  link += "/home/post/" + post?.tests.id;
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const isPhoneView = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    async function fetchBookMarks() {
      const response = await axios.get(
        `api/bookmarks/${post?.tests?.id ?? pathName.split("/")[3]}`
      );
      if (response.data?.length! > 0) {
        setIsBookMark(true);
      } else {
        setIsBookMark(false);
      }
    }
    fetchBookMarks();
  }, []);

  const updateBookMark = async () => {
    if (isBookMark) {
      await removeBookMark(post?.tests?.id as string, user?.id as string);
    } else {
      await addToBookMark(post?.tests?.id as string, user?.id as string);
    }
    if (setBookMarkUpdate) {
      setBookMarkUpdate((prev) => !prev);
    }
    setIsBookMark((prev) => !prev);
  };

  const handleClick = () => {
    if (setShowTextArea) {
      setShowTextArea(true);
    } else {
      router.push(`/home/post/${post?.tests?.id}`);
    }
  };

  const updateUpVote = async () => {
    await axios.put(`api/posts/${post?.tests?.id}`, {
      operation: "upVote",
      val: !vote?.upVote,
    });
    setVote((prev) => {
      return {
        ...prev!,
        upVote: !prev?.upVote,
        downVote: !prev?.upVote ? false : prev?.downVote,
      };
    });
  };

  const updateDownVote = async () => {
    await axios.put(`api/posts/${post?.tests?.id}`, {
      operation: "downVote",
      val: !vote?.downVote,
    });
    setVote((prev) => {
      return {
        ...prev!,
        downVote: !prev?.downVote,
        upVote: !prev?.downVote ? false : prev?.upVote,
      };
    });
  };
  return (
    <>
      {openLoginDialog && (
        <AuthModal open={openLoginDialog} setOpen={setOpenLoginDialog}>
          {!isLogin ? (
            <Register setIsLogin={setIsLogin} />
          ) : (
            <Login setIsLogin={setIsLogin} />
          )}
        </AuthModal>
      )}

      <div className="mt-4 border rounded-md flex text-gray-700 dark:text-[#A8B3CF]">
        <div className="bg-secondary flex rounded-md w-max gap-4 p-2 border border-gray-600">
          <div
            onClick={() => (user ? updateUpVote() : setOpenLoginDialog(true))}
            className="rounded-md p-1"
          >
            {!vote?.upVote ? (
              <svg
                name="upVote"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 cursor-pointer text-gray-700 dark:text-[#A8B3CF] hover:scale-110 hover:stroke-primary"
                width="1"
                height="1"
              >
                <path
                  d="M9.456 4.216l-5.985 7.851c-.456.637-.583 1.402-.371 2.108l.052.155a2.384 2.384 0 002.916 1.443l2.876-.864.578 4.042a2.384 2.384 0 002.36 2.047h.234l.161-.006a2.384 2.384 0 002.2-2.041l.576-4.042 2.877.864a2.384 2.384 0 002.625-3.668L14.63 4.33a3.268 3.268 0 00-5.174-.115zm3.57.613c.16.114.298.253.411.411l5.897 7.736a.884.884 0 01-.973 1.36l-3.563-1.069a.884.884 0 00-1.129.722l-.678 4.75a.884.884 0 01-.875.759h-.234a.884.884 0 01-.875-.76l-.679-4.75a.884.884 0 00-1.128-.72l-3.563 1.068a.884.884 0 01-.973-1.36L10.56 5.24a1.767 1.767 0 012.465-.41z"
                  fill="currentColor"
                  fill-rule="evenodd"
                ></path>
              </svg>
            ) : (
              <svg
                name="upVoteFilled"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 cursor-pointer hover:scale-110 hover:stroke-primary"
              >
                <path
                  d="M13.234 3.395c.191.136.358.303.494.493l7.077 9.285a1.06 1.06 0 01-1.167 1.633l-4.277-1.284a1.06 1.06 0 00-1.355.866l-.814 5.701a1.06 1.06 0 01-1.05.911h-.281a1.06 1.06 0 01-1.05-.91l-.815-5.702a1.06 1.06 0 00-1.355-.866l-4.276 1.284a1.06 1.06 0 01-1.167-1.633l7.077-9.285a2.121 2.121 0 012.96-.493z"
                  fill="#0074e9"
                  fill-rule="evenodd"
                ></path>
              </svg>
            )}
          </div>
          <div
            onClick={() => (user ? updateDownVote() : setOpenLoginDialog(true))}
            className="rounded-md p-1"
          >
            {!vote?.downVote ? (
              <svg
                name="downVote"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 cursor-pointer hover:scale-110 hover:stroke-primary transform rotate-180"
                width="1"
                height="1"
              >
                <path
                  d="M9.456 4.216l-5.985 7.851c-.456.637-.583 1.402-.371 2.108l.052.155a2.384 2.384 0 002.916 1.443l2.876-.864.578 4.042a2.384 2.384 0 002.36 2.047h.234l.161-.006a2.384 2.384 0 002.2-2.041l.576-4.042 2.877.864a2.384 2.384 0 002.625-3.668L14.63 4.33a3.268 3.268 0 00-5.174-.115zm3.57.613c.16.114.298.253.411.411l5.897 7.736a.884.884 0 01-.973 1.36l-3.563-1.069a.884.884 0 00-1.129.722l-.678 4.75a.884.884 0 01-.875.759h-.234a.884.884 0 01-.875-.76l-.679-4.75a.884.884 0 00-1.128-.72l-3.563 1.068a.884.884 0 01-.973-1.36L10.56 5.24a1.767 1.767 0 012.465-.41z"
                  fill="currentColor"
                  fill-rule="evenodd"
                ></path>
              </svg>
            ) : (
              <svg
                name="downVoteFilled"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 cursor-pointer hover:scale-110 hover:stroke-primary transform rotate-180"
              >
                <path
                  d="M13.234 3.395c.191.136.358.303.494.493l7.077 9.285a1.06 1.06 0 01-1.167 1.633l-4.277-1.284a1.06 1.06 0 00-1.355.866l-.814 5.701a1.06 1.06 0 01-1.05.911h-.281a1.06 1.06 0 01-1.05-.91l-.815-5.702a1.06 1.06 0 00-1.355-.866l-4.276 1.284a1.06 1.06 0 01-1.167-1.633l7.077-9.285a2.121 2.121 0 012.96-.493z"
                  fill="#0074e9"
                  fill-rule="evenodd"
                ></path>
              </svg>
            )}
          </div>
        </div>
        <div className="flex justify-around w-full">
          <div
            onClick={() => (user ? handleClick() : setOpenLoginDialog(true))}
            className="peer flex gap-2 items-center cursor-pointer hover:text-primary"
          >
            <svg
              name="comments"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 cursor-pointer peer-hover:stroke-primary"
            >
              <path
                d="M8.084 3.217a35.447 35.447 0 017.05-.078l.782.078.279.031c1.089.121 1.885.372 2.606.828a4.516 4.516 0 011.664 1.86c.336.69.5 1.423.53 2.361l.005.321v3.975a4.493 4.493 0 01-3.545 4.392l-.207.04-2.089.346-2.86 2.992-.147.135c-.986.789-2.399.623-3.205-.324-.532-.625-.616-1.34-.51-2.29l.029-.224.038-.254.033-.187-1.332-.189a5.011 5.011 0 01-1.677-.55l-.253-.146-.243-.16a4.777 4.777 0 01-1.491-1.721 4.935 4.935 0 01-.532-1.972l-.009-.3V8.618c0-1.096.162-1.915.535-2.683.375-.77.94-1.4 1.664-1.859.649-.41 1.359-.655 2.288-.788l.318-.04.28-.031zm7.666 1.491a33.948 33.948 0 00-6.752-.075l-.748.075-.28.031c-.915.102-1.481.297-1.97.606a3.016 3.016 0 00-1.116 1.247c-.228.468-.357.989-.38 1.76l-.004.266v3.563c0 .577.134 1.116.375 1.587.242.471.592.874 1.024 1.18.37.263.801.453 1.276.554l.242.043 1.98.283c.339.048.457.096.575.175.119.078.262.187.27.386l-.002.024-.013.08-.164.741-.064.333c-.111.63-.167 1.332.09 1.634.263.309.7.39 1.037.187l.089-.062 2.998-3.135.13-.101.092-.063.077-.04.08-.03.035-.01.087-.02L17 15.545a2.993 2.993 0 002.495-2.77l.005-.182V8.618c0-.921-.13-1.506-.384-2.026A3.016 3.016 0 0018 5.345c-.44-.278-.943-.464-1.706-.572l-.265-.034-.279-.03zm-.55 6.294l.093.005c.398.044.707.36.707.746 0 .38-.301.693-.691.743l-.109.007H8.8l-.093-.005c-.398-.044-.707-.36-.707-.745 0-.38.301-.694.691-.744l.109-.007h6.4zm0-3.5l.093.004c.398.044.707.36.707.746 0 .38-.301.693-.691.743l-.109.007H8.8l-.093-.005C8.309 8.953 8 8.637 8 8.252c0-.38.301-.694.691-.744l.109-.007h6.4z"
                fill="currentColor"
                fill-rule="evenodd"
              ></path>
            </svg>
            {!isPhoneView && (
              <p className="font-semibold peer-hover:text-primary">Comment</p>
            )}
          </div>
          <div
            onClick={() => (user ? updateBookMark() : setOpenLoginDialog(true))}
            className="peer flex gap-2 items-center cursor-pointer hover:text-primary"
          >
            {!isBookMark ? (
              <svg
                name="bookmark"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 cursor-pointer fill-current peer-hover:text-primary"
              >
                <path
                  d="M15.874 3H8.126a3.357 3.357 0 00-3.35 3.152l-.772 12.77c-.028.459.106.915.38 1.286l.101.125c.666.764 1.818.9 2.647.287L12 17.023l4.868 3.597a1.964 1.964 0 003.128-1.7l-.771-12.767A3.358 3.358 0 0015.874 3zm0 1.5c.981 0 1.794.764 1.854 1.744l.771 12.768a.464.464 0 01-.74.402l-5.207-3.848a.929.929 0 00-1.104 0L6.24 19.414a.464.464 0 01-.74-.402l.773-12.768c.06-.98.872-1.744 1.853-1.744h7.748z"
                  fill="currentColor"
                  fill-rule="evenodd"
                ></path>
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 pointer-events-none"
              >
                <path
                  d="M16.444 3c1.178 0 2.152.917 2.224 2.092l.926 15.317a.557.557 0 01-.887.482l-6.247-4.616c-.394-.29-.931-.29-1.324 0L4.888 20.89a.557.557 0 01-.887-.482l.926-15.317A2.228 2.228 0 017.15 3h9.293z"
                  fill="#0074e9"
                  fill-rule="evenodd"
                ></path>
              </svg>
            )}
            {!isPhoneView && (
              <p className="font-semibold peer-hover:text-primary">Bookmark</p>
            )}
          </div>
          <CopyLinkComponent link={link as string}>
            <div className="peer flex gap-2 items-center cursor-pointer hover:text-primary">
              <svg
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 cursor-pointer fill-current peer-hover:text-primary"
              >
                <path
                  d="M13.2 4.096a3.743 3.743 0 015.148-.137l.144.137 1.412 1.412a3.743 3.743 0 01.137 5.148l-.137.144-4.023 4.023a3.743 3.743 0 01-5.148.137l-.144-.137-.706-.706a.749.749 0 01.982-1.125l.076.067.706.705c.84.84 2.181.876 3.063.105l.113-.105 4.022-4.022c.84-.84.876-2.181.105-3.064l-.105-.112-1.411-1.411a2.246 2.246 0 00-3.063-.105l-.113.105L13.2 6.213a.749.749 0 01-1.126-.982l.067-.076L13.2 4.096zM8.119 9.177a3.743 3.743 0 015.148-.137l.144.137.706.706a.749.749 0 01-.982 1.125l-.076-.067-.706-.705a2.246 2.246 0 00-3.063-.105l-.113.105-4.022 4.022a2.246 2.246 0 00-.105 3.064l.105.112 1.411 1.411c.84.84 2.181.876 3.063.105l.113-.105 1.058-1.058a.749.749 0 011.126.982l-.067.076-1.059 1.059a3.743 3.743 0 01-5.148.137l-.144-.137-1.412-1.412a3.743 3.743 0 01-.137-5.148l.137-.144L8.12 9.177z"
                  fill="currentColor"
                  fill-rule="evenodd"
                ></path>
              </svg>
              {!isPhoneView && (
                <p className="font-semibold peer-hover:text-primary">Copy</p>
              )}
            </div>
          </CopyLinkComponent>
        </div>
      </div>
    </>
  );
};

export default InteractionPanel;
