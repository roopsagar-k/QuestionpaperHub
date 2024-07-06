"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { Post as PostType } from "../../types/types";
import Post from "@/components/Post";
export const dynamic = "force-dynamic";

const Search = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const search = useSearchParams();
  const searchQuery = search ? search.get("q") : null;
  const encodedQuery = encodeURI(searchQuery || "");

  useEffect(() => {
    async function fetchQueryResults() {
      try {
        const response = await axios.get(`/api/search?q=${encodedQuery}`);
        setPosts(response.data.queryResults);
        setError(null);
      } catch (error) {
        setError("Error fetching search results");
      }
    }
    if (searchQuery) {
      fetchQueryResults();
    }
  }, []);

  return (
    <div className="container mx-auto max-w-md p-3 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col items-center gap-8">
      {error ? (
        <div className="w-full text-center text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="w-full text-center text-gray-500">
          No results for &quot;{searchQuery}&quot;
        </div>
      ) : (
        posts.map((post) => (
          <Post
            key={post.tests.id}
            id={post.tests.id!}
            post={post}
            descriptionLength={"half"}
          />
        ))
      )}
    </div>
  );
};

export default Search;
