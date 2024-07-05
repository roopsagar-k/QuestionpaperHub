import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type {
  Post as PostType,
  Comment as CommentType,
  Vote,
} from "@/app/types/types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import InteractionPanel from "@/components/InteractionPanel";
import PaperViewDialog from "@/components/PaperViewDialog";
import Comment from "@/components/Comment";
import CommentSection from "@/components/CommentSection";
import { Tag } from "lucide-react";
import type { UserVoteType } from "@/app/types/types";
import { formatDistanceToNow } from "date-fns";
import { useMediaQuery } from "react-responsive";
import { useUserContext } from "@/context/UserContext";
import AuthModal from "@/components/AuthModal";
import Register from "./Register";
import Login from "./Login";

interface PostComponentProps {
  post: PostType;
  descriptionLength: "half" | "full";
  id: string;
  setBookMarkUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Post: React.FC<PostComponentProps> = ({
  post,
  descriptionLength,
  id,
  setBookMarkUpdate,
}) => {
  const router = useRouter();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [comment, setComment] = useState<string>("");
  const [showTextArea, setShowTextArea] = useState<boolean>(false);
  const [totalUpVotes, setTotalUpVotes] = useState<number>(0);
  const [vote, setVote] = useState<UserVoteType>();
  const [commentMessage, setCommentMessage] = useState<string>("");
  const [triggerFetchComments, setTriggerFetchComments] =
    useState<boolean>(false);
  const isTabView = useMediaQuery({
    query: "(min-width: 768px) && (max-width: 1024px)",
  });
  const isPhoneView = useMediaQuery({ query: "(max-width: 767px)" });
  const maxLengthOfDescription =
    descriptionLength === "half"
      ? 500
      : isPhoneView
      ? 200
      : post?.tests.description.length;
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.get(`/api/comments/${id}`);
      setComments(response.data);
    };
    fetchComments();
  }, [id, comment, commentMessage, triggerFetchComments]);

  useEffect(() => {
    const getTotalUpVotes = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/votes/${id}/all`);
          setTotalUpVotes(
            response.data.filter((vote: Vote) => vote.upVote).length
          );
        } catch (error) {
          console.error("Error fetching votes:", error);
        }
      }
    };
    getTotalUpVotes();
  }, [id, vote]);

  useEffect(() => {
    const fetchVotes = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/votes/${id}`);
          setVote(response.data);
        } catch (error) {
          console.error("Error fetching votes:", error);
        }
      }
    };
    fetchVotes();
  }, [id]);

  const handleReadMore = () => {
    router.push(`/home/post/${id}`);
  };

  const handleTakeTest = () => {
    router.push(`/tests/${id}`);
  };

  const createdAt = post?.tests?.createdAt;

  const formattedDate = createdAt
    ? formatDistanceToNow(new Date(parseInt(createdAt)), { addSuffix: true })
    : "Unknown time";

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
      <div>
        <Card
          key={id}
          className="w-[90vw] mx-2 sm:w-[38rem] text-card-foreground lg:min-w-[55rem] py-3 px-4 md:py-6 md:px-8 shadow-md"
        >
          <div className="flex items-center gap-4">
            <Avatar className="cursor-pointer text-center size-16 flex items-center">
              <AvatarImage className="rounded-lg" src={post?.users?.imgUrl} />
              <AvatarFallback>{post?.users?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold">{post?.users?.name}</p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="hover:cursor-pointer hover:text-primary hover:underline">
                  @{post?.users?.userName}
                </span>{" "}
                | {formattedDate}
              </p>
            </div>
          </div>
          <h3 className="mt-8 text-2xl text-wrap font-semibold tracking-tight">
            {post?.tests?.title}
          </h3>
          <p className="mt-4 leading-7 text-wrap">
            {post?.tests?.description.length > maxLengthOfDescription
              ? `${
                  isTabView
                    ? post?.tests?.description.slice(0, 250)
                    : post?.tests?.description.slice(0, maxLengthOfDescription)
                }...`
              : `${
                  isTabView
                    ? post?.tests?.description.slice(0, 250) + "..."
                    : post?.tests?.description
                }`}
            {post?.tests?.description.length > maxLengthOfDescription && (
              <Button onClick={handleReadMore} className="-ml-4" variant="link">
                read more
              </Button>
            )}
          </p>
          <div className="mt-4 font-semibold">
            <p className="items-center">
              <div>
                <div className="flex gap-2">
                  <Tag className="transform rotate-90 text-gray-700 dark:text-[#A8B3CF]" />
                  <p>Tags:</p>{" "}
                </div>
                <span className="text-primary font-medium mt-2">
                  {isTabView
                    ? post?.tests?.tags.slice(0, 100) + "..."
                    : post?.tests?.tags}
                </span>
              </div>
            </p>
            <div className="mt-4 flex gap-4 text-gray-700 dark:text-[#A8B3CF]">
              <p>
                {comments.length} Comments | {totalUpVotes} Upvotes
              </p>
            </div>
          </div>
          <div>
            <PaperViewDialog questions={post?.tests?.questions!} />
            <Button
              onClick={() =>
                user ? handleTakeTest() : setOpenLoginDialog(true)
              }
              className="w-full mt-2"
            >
              Take Test
            </Button>
          </div>
          <div>
            <InteractionPanel
              setBookMarkUpdate={setBookMarkUpdate!}
              post={post}
              vote={vote!}
              setVote={setVote}
            />
          </div>
          {descriptionLength === "full" && (
            <>
              <div className="mt-8">
                <Comment
                  showTextArea={showTextArea}
                  setShowTextArea={setShowTextArea}
                  post={post}
                  comment={comment}
                  setComment={setComment}
                />
              </div>
              <div className="mt-8">
                {comments.length > 0 && (
                  <CommentSection
                    commentMessage={commentMessage}
                    setCommentMessage={setCommentMessage}
                    comments={comments}
                    postId={id}
                    setTriggerFetchComments={setTriggerFetchComments}
                  />
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default Post;
