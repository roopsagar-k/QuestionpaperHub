"use client";
import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import axios from "@/axiosConfig";
import CopyLinkComponent from "../CopyLinkComponent";
import { usePathname } from "next/navigation";
import AuthModal from "../auth/AuthModal";
import Register from "../auth/Register";
import Login from "../auth/Login";
import { useUserContext } from "@/context/UserContext";

interface Props {
  showTextArea: boolean;
  setShowTextArea: React.Dispatch<React.SetStateAction<boolean>>;
  setCommentId: React.Dispatch<React.SetStateAction<string>>;
  id: string;
  nested: boolean;
  setIsNestedComment: React.Dispatch<React.SetStateAction<boolean>>;
  nestedCommentId?: string;
  setNestedCommentId?: React.Dispatch<React.SetStateAction<string | undefined>>;
  showMenu: boolean;
  commentMessage: string;
  setTriggerFetchComments: React.Dispatch<React.SetStateAction<boolean>>;
  postTime: string;
}

const CommentSectionInteractionPannel: React.FC<Props> = ({
  setShowTextArea,
  setCommentId,
  id,
  showTextArea,
  nested,
  setIsNestedComment,
  nestedCommentId,
  setNestedCommentId,
  showMenu,
  commentMessage,
  setTriggerFetchComments,
  postTime,
}) => {
  const [updatedMessage, setUpdatedMessage] = useState<string>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [upVote, setUpVote] = useState<boolean>(false);
  const [downVote, setDownVote] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { user } = useUserContext();

  useEffect(() => {
    async function fetchCommentsVotes() {
      if (!nested) {
        const response = await axios.get(`api/comments/votes/${id}`);
        const { commentVotes, count: voteCount } = response.data;
        if (commentVotes) {
          setUpVote(commentVotes.upVote);
          setDownVote(commentVotes.downVote);
        }
        setCount(voteCount);
      } else {
        const response = await axios.get(
          `api/comments/votes/${id}/nested/${nestedCommentId}`
        );
        const { commentVotes, count: voteCount } = response.data;
        if (commentVotes) {
          setUpVote(commentVotes.upVote);
          setDownVote(commentVotes.downVote);
        }
        setCount(voteCount);
      }
    }
    fetchCommentsVotes();
  }, [id, nested, nestedCommentId]);

  const updateComment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const response = await axios.put(`api/comments/${id}/update`, {
      updatedMessage,
      nested,
      nestedCommentId,
    });
    setPopoverOpen(false);
    if (response.status === 201) {
      setTriggerFetchComments((prev) => !prev);
      setDialogOpen(false);
    }
  };

  const deleComment = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!nested) {
      await axios.delete(`api/comments/${id}/delete`);
      setPopoverOpen(false);
      setCommentDialogOpen(false);
      setTriggerFetchComments((prev) => !prev);
    } else {
      await axios.delete(`api/comments/${id}/delete/nested/${nestedCommentId}`);
      setPopoverOpen(false);
      setCommentDialogOpen(false);
      setTriggerFetchComments((prev) => !prev);
    }
  };

  const updateCommentUpVote = async () => {
    const result = await axios.put(`api/comments/votes/${id}`, {
      nested,
      votes: { upVote: !upVote, downVote: !upVote ? false : downVote },
      nestedCommentId,
    });
    setUpVote((prev) => !prev);
    setDownVote((prev) => (!upVote ? false : prev));
    setCount(result.data.count);
  };

  const updateCommentDownVote = async () => {
    const result = await axios.put(`api/comments/votes/${id}`, {
      nested,
      votes: { upVote: !downVote ? false : upVote, downVote: !downVote },
      nestedCommentId,
    });
    setDownVote((prev) => !prev);
    setUpVote((prev) => (!downVote ? false : prev));
    setCount(result.data.count);
  };

  const pathname = usePathname();
  const link =
    process.env.BASE_URL ||
    "https://questionpaper-hub.vercel.app/" +
      pathname +
      "#comment-" +
      (nested ? nestedCommentId : id);

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

      <div className="flex flex-col-reverse gap-2 md:flex-row mt-4 justify-between text-gray-700 dark:text-[#A8B3CF]">
        <div className="flex gap-4">
          <div
            onClick={() =>
              user ? updateCommentUpVote() : setOpenLoginDialog(true)
            }
          >
            {!upVote ? (
              <svg
                name="upVote"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 cursor-pointer hover:scale-110 hover:stroke-primary"
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
            onClick={() =>
              user ? updateCommentDownVote() : setOpenLoginDialog(true)
            }
          >
            {!downVote ? (
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
          <div
            onClick={() => {
              if (user) {
                setShowTextArea(!showTextArea);
                if (nested) {
                  setIsNestedComment(true);
                  setNestedCommentId && setNestedCommentId(nestedCommentId!);
                } else {
                  setIsNestedComment(false);
                }
                setCommentId(id);
              } else {
                setOpenLoginDialog(true);
              }
            }}
            className="peer flex gap-2 items-center cursor-pointer hover:text-primary text-gray-700 dark:text-[#A8B3CF]"
          >
            <svg
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
          </div>
          <div className="cursor-pointer text-gray-700 dark:text-[#A8B3CF]">
            <CopyLinkComponent link={link}>
              <svg
                viewBox="0 0 24 24"
                name="share"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 curosr-pointer hover:text-primary"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.302 3.805a2.75 2.75 0 10-3.89 3.89L11.5 8.78h-1.142a7.367 7.367 0 00-7.078 5.323l-1.233 4.271c-.315 1.09 1.068 1.849 1.818.999l2.287-2.59a5.25 5.25 0 013.935-1.775h1.422l-1.095 1.095a2.75 2.75 0 103.889 3.889l6.149-6.15a2.75 2.75 0 000-3.889l-6.15-6.149zm-.473 9.92a.75.75 0 01.012 1.073l-2.367 2.366a1.25 1.25 0 101.767 1.768l6.15-6.15a1.25 1.25 0 000-1.767l-6.15-6.149a1.25 1.25 0 10-1.768 1.768L13.74 8.9a.75.75 0 01-.396 1.38.753.753 0 01-.065 0h-2.922a5.867 5.867 0 00-5.637 4.24l-.694 2.403 1-1.133a6.75 6.75 0 015.06-2.283h3.216c.205 0 .391.083.527.216z"
                  fill="currentColor"
                ></path>
              </svg>
            </CopyLinkComponent>
          </div>
          {showMenu && (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger>
                <div className="peer text-gray-600 dark:text-[#A8B3CF] cursor-pointer hover:text-primary flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    name="menu"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 peer-hover:stroke-primary cursor-pointer"
                  >
                    <path
                      d="M12 17a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-6.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM12 4a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"
                      fill="currentColor"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </PopoverTrigger>
              <PopoverContent className="m-0">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger className="w-full">
                    <Button
                      className="flex gap-2 w-full text-gray-700 dark:text-[#A8B3CF]  justify-start"
                      variant={"ghost"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-pencil"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                      Edit
                    </Button>{" "}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit comment</DialogTitle>
                      <DialogDescription>
                        Make changes to your comment here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="name" className="text-left">
                          Comment
                        </Label>
                        <Textarea
                          id="comment"
                          defaultValue={commentMessage}
                          className="col-span-3"
                          value={updatedMessage}
                          onChange={(e) => setUpdatedMessage(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={(e) => updateComment(e)} type="submit">
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={commentDialogOpen}
                  onOpenChange={setCommentDialogOpen}
                >
                  <DialogTrigger className="w-full">
                    <Button
                      className="flex gap-2 w-full text-gray-700 dark:text-[#A8B3CF]  justify-start"
                      variant={"ghost"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-trash-2"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                      Delete
                    </Button>{" "}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete comment</DialogTitle>
                      <DialogDescription className="text-destructive flex gap-2">
                        Are you sure you want to delete this comment.
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-trash-2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 items-center gap-4">
                        <Label htmlFor="name" className="text-left">
                          Comment
                        </Label>
                        <Textarea
                          id="comment"
                          defaultValue={commentMessage}
                          className="col-span-3"
                          readOnly
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant={"destructive"}
                        onClick={(e) => deleComment(e)}
                        type="submit"
                      >
                        Delete comment
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <div className="text-xs md:text-base text-gray-700 dark:text-[#A8B3CF] font-semibold">
          {count + " "}Upvotes | {" " + postTime}{" "}
        </div>
      </div>
    </>
  );
};

export default CommentSectionInteractionPannel;
