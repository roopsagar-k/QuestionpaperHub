export type CredentialsType = {
  email: string;
  id: string;
  password?: string;
  name?: string;
  userName?: string;
  imgUrl?: string;
  image?: string;
};

export type OAuthType = {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: boolean;
  imgUrl?: string;
  image?: string;
};

export type User = CredentialsType | OAuthType;

export type UserContextType = {
  user: User | undefined;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export type Test = {
  id?: string;
  title: string;
  duration: number;
  createdAt?: string;
  description: string;
  tags: string;
  ownTest: boolean;
  privatePost: boolean;
  questions?: QuestionType[];
  userId?: string;
};

export type QuestionType = {
  question: string;
  options: { option: string }[];
  answer: string;
  images?: { url: string; publicId: string }[];
};

export type TestInfo = {
  testId?: string;
  userId?: string;
  answers?: { questionIndex: number; answer: number }[];
  minutes?: number;
  seconds?: number;
  currentScore?: number;
  highestScore?: number;
  totalScore?: number;
};

export type TestInfoContextType = {
  testInfo: TestInfo | undefined;
  setTestInfo: React.Dispatch<React.SetStateAction<TestInfo | undefined>>;
};

export type TestContextType = {
  test: Test | undefined;
  setTest: React.Dispatch<React.SetStateAction<Test | undefined>>;
};

export type Post = {
  tests: Test;
  users: CredentialsType;
};

export type ParentComment = {
  id: string;
  message: string;
  createdAt: string;
  userId: string;
  postId: string;
};

export type ChildrenComment = {
  nestedComments: {
    id: string;
    message: string;
    createdAt: string;
    userId: string;
    postId: string;
    user: CredentialsType;
    recipient: CredentialsType;
  }[];
};

export type Comment = {
  comments: ParentComment & ChildrenComment & CredentialsType;
  users: CredentialsType;
};

export type Vote = {
  id: string;
  upVote: boolean;
  downVote: false;
  userId: string;
  postId: string;
};

export type UserVoteType = {
  postId: string;
  upVote: boolean;
  downVote: boolean;
};

export type NestedComment = {
  id: string;
  message: Date;
  createdAt: string;
  userId: string;
  recipientId?: string;
  postId: string;
};

export type BookmarkType = {
  id: string;
  postId: string;
  userId: string;
};

export type BookMarkJoinType = {
  book_mark: BookmarkType;
  tests: Test;
  users: User;
};

export type Answer = {
  answer: number,
  questionIndex: number,
}

export type cloudinaryImagObj = {
  url: string;
  publicId: string; 
}