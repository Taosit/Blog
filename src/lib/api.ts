import { HslColorType, userUpdateFields } from "@/types/types";

export type fetcherProps = {
  url: string;
  method?: "get" | "post" | "put" | "delete";
  body?: { [key: string]: any };
  json?: boolean;
};

export const fetcher = async ({
  url,
  method = "get",
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
    method: "put",
    body: user.data,
  });
};

export const updateUserColor = (data: {
  color: HslColorType;
  userId: string;
}) => {
  return fetcher({
    url: `/api/color`,
    method: "put",
    body: data,
  });
};

export const updateUserImage = (data: { image: string; userId: string }) => {
  return fetcher({
    url: `/api/avatar`,
    method: "put",
    body: data,
  });
};

export const getUser = (id: string) => {
  return fetcher({ url: `/api/users/${id}` });
};
