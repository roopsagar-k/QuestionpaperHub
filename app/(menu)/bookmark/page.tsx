"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import type { BookMarkJoinType, Post as PostType } from "../../types/types";
import Post from "@/components/Post";
import axios from "axios";


const BookMark = () => {
  const { user } = useUserContext();
  const [bookMarks, setBookMarks] = useState<BookMarkJoinType[]>();
  const [bookMarkUpdate, setBookMarkUpdate] = useState<boolean>(false);
  useEffect(() => {
    async function fetchBookMarks() {
      const response = await axios.get(`api/bookmarks`);
      setBookMarks(response?.data);
    }
    fetchBookMarks();
  }, [bookMarkUpdate]);
  return (
    <div className="container whitespace-pre-wrap mx-auto max-w-md p-3 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col items-center gap-8">
      {bookMarks?.length! > 0 ? (
        <>
          {bookMarks?.map((post) => (
            <Post
              key={post?.tests?.id}
              id={post?.tests?.id!}
              post={post as PostType}
              descriptionLength={"half"}
              setBookMarkUpdate={setBookMarkUpdate}
            />
          ))}
          <div className="h-16"></div>
        </>
      ) : (
        <div className="w-full text-center text-gray-500">No Bookmarks</div>
      )}
    </div>
  );
};

export default BookMark;
