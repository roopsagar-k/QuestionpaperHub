import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import classNames from "classnames";
import { useUserContext } from "@/context/UserContext";
import AuthModal from "../auth/AuthModal";
import Register from "../auth/Register";
import Login from "../auth/Login";

interface CommentTextBoxProps {
  showTextArea: boolean;
  name: string;
  comment: string;
  commentTo?: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  handleClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    recipientId: string
  ) => void;
  recipientId?: string;
}
const CommentTextBox: React.FC<CommentTextBoxProps> = ({
  showTextArea,
  name,
  comment,
  setComment,
  handleClick,
  commentTo,
  recipientId = "",
}) => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { user } = useUserContext();
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
      <Card
        className={classNames(
          "lg:min-w-[55rem] h-max p-2 border-none hidden",
          showTextArea && "block"
        )}
      >
        <div className="flex gap-4">
          <Avatar className="cursor-pointer size-12 flex items-center">
            <AvatarImage className="rounded-lg" src={user?.image} />
            <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col w-full">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                commentTo
                  ? "Share your thoughts to " + "@" + commentTo
                  : "Share your thoughts"
              }
            />
            <Button
              disabled={comment?.trim().length === 0}
              className="w-full h-12 mt-4 rounded-md"
              onClick={(e) =>
                user ? handleClick(e, recipientId) : setOpenLoginDialog(true)
              }
            >
              Comment
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CommentTextBox;
