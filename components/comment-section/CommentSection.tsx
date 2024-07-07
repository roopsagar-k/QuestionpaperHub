import React, { useEffect, useState } from "react";
import type { Comment } from "@/app/types/types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import CommentSectionInteractionPannel from "../Pannels/CommentSectionInteractionPannel";
import CommentTextBox from "./CommentTextBox";
import { useUserContext } from "@/context/UserContext";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  commentMessage: string;
  setCommentMessage: React.Dispatch<React.SetStateAction<string>>;
  setTriggerFetchComments: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  postId,
  commentMessage,
  setCommentMessage,
  setTriggerFetchComments,
}) => {
  const [showTextArea, setShowTextArea] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<string>("");
  const [isNestedComment, setIsNestedComment] = useState<boolean>(false);
  const [nestedCommentId, setNestedCommentId] = useState<string>();
  const [onViewColor, setOnViewColor] = useState<boolean>(false);
  const [scrollCommentId, setOnScrollCommentId] = useState<string>("");
  const { user, setUser } = useUserContext();

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    recipientId: string
  ) => {
    await axios.put(`/api/comments/${postId}`, {
      commentMessage,
      commentId,
      recipientId,
    });
    setCommentMessage("");
    setShowTextArea(false);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const commentId = hash.substring(1);
      const comment = document.getElementById(commentId);
      setOnScrollCommentId(commentId);
      comment?.scrollIntoView({ behavior: "instant" });
      updateColor();
    }
  }, []);

  function updateColor() {
    setOnViewColor(true);
    setTimeout(() => {
      setOnViewColor(false);
    }, 10000);
  }

  return (
    <Card className="relative flex flex-col gap-8 w-full md:min-w-[30rem] lg:min-w-[40rem] xl:min-w-[55rem]">
      {comments.map((comment) => (
        <div key={comment.comments.id}>
          <Card
            className={`p-4 ${
              scrollCommentId === "comment-" + comment.comments.id &&
              onViewColor
                ? "bg-accent"
                : ""
            }`}
            id={`comment-${comment.comments.id}`}
          >
            <div className="flex items-center gap-4">
              <Avatar className="cursor-pointer size-12 flex items-center text-center">
                <AvatarImage
                  className="rounded-lg"
                  src={comment?.users?.imgUrl}
                />
                <AvatarFallback className="text-center">{"R"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center text-sm">
                <p className="font-semibold">{comment?.users.name}</p>
                <p className="text-gray-500 dark:text-gray-300 hover:underline hover:text-primary dark:hover:text-primary cursor-pointer">
                  {"@" + comment?.users.userName}
                </p>
              </div>
            </div>
            <div className="message mt-4 whitespace-pre-wrap">
              {comment?.comments?.message}
            </div>
            <CommentSectionInteractionPannel
              showTextArea={showTextArea}
              setShowTextArea={setShowTextArea}
              id={comment.comments.id}
              setCommentId={setCommentId!}
              nested={false}
              setIsNestedComment={setIsNestedComment}
              showMenu={comment.comments.userId === user?.id}
              commentMessage={comment?.comments?.message}
              setTriggerFetchComments={setTriggerFetchComments}
              postTime={formatDistanceToNow(
                new Date(parseInt(comment.comments.createdAt)),
                {
                  addSuffix: true,
                }
              )}
            />
          </Card>
          <div className="w-[95%] ml-auto">
            {comment?.comments?.nestedComments?.map((nestedComment) => (
              <div key={nestedComment.id} className="flex gap-2">
                <div className="w-1 bg-blue-600 min-h-full"></div>
                <Card
                  id={`comment-${nestedComment.id}`}
                  className={`p-4 flex-1 mt-4 ${
                    scrollCommentId === "comment-" + nestedComment.id &&
                    onViewColor
                      ? "bg-accent"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="cursor-pointer size-12 flex items-center text-center">
                      <AvatarImage
                        className="rounded-lg"
                        src={nestedComment.user.imgUrl}
                      />
                      <AvatarFallback className="text-center">
                        {"R"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-center text-sm">
                      <p className="font-semibold">
                        {nestedComment?.user?.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-300 cursor-pointer hover:text-primary dark:hover:text-primary hover:underline">
                        {"@" + nestedComment?.user?.userName}
                      </p>
                    </div>
                  </div>
                  <div className="message mt-4 whitespace-pre-wrap">
                    <p className="bg-blue-900 text-white font-semibold mb-2 w-max rounded">
                      {"@" + nestedComment?.recipient?.userName}{" "}
                    </p>
                    {nestedComment?.message}
                  </div>
                  <CommentSectionInteractionPannel
                    showTextArea={showTextArea}
                    setShowTextArea={setShowTextArea}
                    id={comment.comments.id}
                    setCommentId={setCommentId!}
                    nested={true}
                    nestedCommentId={nestedComment?.id!}
                    setNestedCommentId={setNestedCommentId}
                    setIsNestedComment={setIsNestedComment}
                    showMenu={nestedComment.userId === user?.id}
                    commentMessage={nestedComment?.message}
                    setTriggerFetchComments={setTriggerFetchComments}
                    postTime={formatDistanceToNow(
                      new Date(nestedComment.createdAt),
                      {
                        addSuffix: true,
                      }
                    )}
                  />
                </Card>
              </div>
            ))}
          </div>
          <div>
            {showTextArea && comment.comments.id === commentId && (
              <CommentTextBox
                name={user?.name as string}
                showTextArea={showTextArea}
                commentTo={
                  isNestedComment
                    ? comment.comments.nestedComments.find(
                        (n) => n.id === nestedCommentId
                      )?.user.userName
                    : comment.users.userName
                }
                recipientId={
                  isNestedComment
                    ? comment.comments.nestedComments.find(
                        (n) => n.id === nestedCommentId
                      )?.user?.id!
                    : comment.users.id
                }
                comment={commentMessage}
                setComment={setCommentMessage}
                handleClick={handleClick}
              />
            )}
          </div>
        </div>
      ))}
    </Card>
  );
};

export default CommentSection;
