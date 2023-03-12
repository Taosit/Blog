import { accountFields } from "@/types/types";

export type fetcherProps = {
  url: string;
  method: "ger" | "post" | "put" | "delete";
  body: { [key: string]: any };
  json?: boolean;
};

export const fetcher = async ({
  url,
  method,
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

export const updateUser = (user: { id: string; data: accountFields }) => {
  return fetcher({
    url: `/api/users/${user.id}`,
    method: "put",
    body: user.data,
  });
};
