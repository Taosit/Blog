import {
  draftPostType,
  HslColorType,
  savedPostType,
  userUpdateFields,
} from "@/types/types";

export type fetcherProps = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: { [key: string]: any };
  json?: boolean;
};

export const fetcher = async ({
  url,
  method = "GET",
  body,
  json = true,
}: fetcherProps) => {
  const res = await fetch(url, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    // handle your errors
    throw new Error("API error");
  }

  if (json) {
    const data = await res.json();
    return data.data;
  }
};

export const updateUser = (user: { id: string; data: userUpdateFields }) => {
  return fetcher({
    url: `/api/users/${user.id}`,
    method: "PUT",
    body: user.data,
  });
};

export const updateUserColor = (data: {
  color: HslColorType;
  userId: string;
}) => {
  return fetcher({
    url: `/api/users/${data.userId}/color`,
    method: "PUT",
    body: data,
  });
};

export const updateUserImage = (data: { image: string; userId: string }) => {
  return fetcher({
    url: `/api/users/${data.userId}/avatar`,
    method: "PUT",
    body: data,
  });
};

export const fetchUser = (id: string) => {
  return fetcher({ url: `/api/users/${id}` });
};

export const fetchUserClasses = (id: string) => {
  return fetcher({ url: `/api/users/${id}/classes` });
};

export const fetchCoursesAndSemesters = () => {
  return fetcher({ url: `/api/classes` });
};

export const fetchSavedPost = (id: string) => {
  return fetcher({ url: `/api/savedPost/${id}` });
};

type SearchParamsType = {
  search?: string;
  course?: string;
  term?: string;
  sort?: string;
};

export const fetchPosts = (searchParams: SearchParamsType) => {
  const params = new URLSearchParams(searchParams);
  return fetcher({ url: `/api/posts?${params.toString()}` });
};

export const fetchPost = (id: string) => {
  return fetcher({ url: `/api/posts/${id}` });
};

export const savePost = (userId: string, post: draftPostType | null) => {
  return fetcher({
    url: `/api/savedPost`,
    method: "PUT",
    body: { userId, post },
  });
};

export const publishBlog = (userId: string, post: savedPostType) => {
  return fetcher({
    url: `/api/posts`,
    method: "POST",
    body: { userId, post },
  });
};

export const updateBlog = (id: string, post: savedPostType) => {
  return fetcher({
    url: `/api/posts/${id}`,
    method: "PUT",
    body: { post },
  });
};

export const deleteBlog = (id: string) => {
  return fetcher({
    url: `/api/posts/${id}`,
    method: "DELETE",
  });
};

export const getImageUrl = (image: string) => {
  return fetcher({
    url: `/api/image`,
    method: "POST",
    body: { image },
  });
};

export const getComments = (postId: string) => {
  return fetcher({
    url: `/api/posts/${postId}/comments`,
  });
};

export const sendComment = (postId: string, comment: object) => {
  return fetcher({
    url: `/api/posts/${postId}/comments`,
    method: "POST",
    body: { comment },
  });
};
