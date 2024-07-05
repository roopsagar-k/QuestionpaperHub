import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card } from "@/components/ui/card";
import { Post } from "@/app/types/types";
import classNames from "classnames";
import axios from "axios";
import CommentTextBox from "./CommentTextBox";
import { useUserContext } from "@/context/UserContext";

interface CommentProps {
  post: Post;
  showTextArea: boolean;
  setShowTextArea: React.Dispatch<React.SetStateAction<boolean>>;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
}

const Comment: React.FC<CommentProps> = ({
  post,
  showTextArea,
  setShowTextArea,
  comment,
  setComment,
}) => {
  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      await axios.post(`/api/comments/${post.tests.id}`, { comment });
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const { user } = useUserContext();
  return (
    <>
      <Card
        onClick={() =>  setShowTextArea(true)}
        className={classNames(
          "bg-secondary md:min-w-[30rem] lg:min-w-[40rem] xl:min-w-[55rem] hover:border hover:border-gray-200 cursor-pointer p-2 flex justify-between items-center",
          showTextArea && "hidden"
        )}
      >
        <div className="flex gap-4 text-foreground dark:text-gray-300 mx-1">
          <Avatar className="cursor-pointer size-16 flex items-center">
            <AvatarImage className="rounded-lg" src={user?.image} />
            <AvatarFallback>{post?.users?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex gap-4 items-center">
            <p>Share your thoughts</p>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 pointer-events-none !h-6 !w-6 text-base -ml-2 mr-1 text-gray-700 dark:text-[#A8B3CF]"
            >
              <g fill-rule="evenodd" clip-rule="evenodd" fill="#A8B3CF">
                <path
                  d="M17.793 3.708a3.145 3.145 0 002.488 2.453l1.268.244c.599.116.602.97.004 1.098l-1.266.27c-.125.027-.248.061-.368.102l-.06.021c-.096.035-.19.074-.28.118l-.172.088-.208.126-.191.136-.126.102-.156.142-.178.187-.034.04a3.19 3.19 0 00-.695 1.442l-.252 1.27a.544.544 0 01-.402.435l-.097.017-.097.001a.54.54 0 01-.502-.442l-.262-1.265A3.145 3.145 0 0013.72 7.84l-1.268-.244c-.599-.115-.602-.97-.004-1.098l1.266-.27c.367-.078.71-.218 1.018-.41l.124-.083c.2-.136.383-.295.546-.472l.156-.184.124-.168.138-.22.044-.079.074-.147.023-.051.03-.064.002-.006c.083-.197.147-.405.19-.62l.251-1.27c.12-.6.974-.608 1.098-.01l.262 1.264zM9.743 8.62l.367 1.771a4.404 4.404 0 003.483 3.435l1.776.341c.838.162.843 1.36.006 1.537l-1.773.378a4.482 4.482 0 00-.515.143l-.085.03a4.467 4.467 0 00-.392.164l-.24.124-.291.176-.268.19-.177.143-.218.2-.248.261-.048.056a4.467 4.467 0 00-.974 2.019l-.353 1.778a.762.762 0 01-.563.609l-.134.024-.137.001a.755.755 0 01-.702-.618L7.89 19.61a4.404 4.404 0 00-3.483-3.435l-1.776-.341c-.838-.162-.843-1.359-.006-1.537l1.773-.378c.514-.11.994-.306 1.425-.574l.174-.117c.28-.191.536-.413.764-.661l.219-.257.173-.235.194-.308.062-.111.103-.206.032-.071c.014-.03.028-.06.04-.09l.003-.007c.117-.276.207-.567.267-.869l.353-1.778c.166-.84 1.363-.851 1.536-.016z"
                  fill="#A8B3CF"
                ></path>
              </g>
            </svg>
          </div>
        </div>
        <div className="py-2 px-4 border rounded-md border-gray-500 font-semibold mx-4">
          Post
        </div>
      </Card>
      <CommentTextBox
        name={post?.users?.name!}
        comment={comment}
        setComment={setComment}
        handleClick={handleClick}
        showTextArea={showTextArea}
      />
    </>
  );
};

export default Comment;
