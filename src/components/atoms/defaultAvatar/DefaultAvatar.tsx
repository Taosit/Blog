import React from "react";

type DefaultAvatarProps = {
  color?: string;
} & React.SVGProps<SVGSVGElement>;

export const DefaultAvatar = ({
  color = "#656A76",
  ...props
}: DefaultAvatarProps) => {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 58 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <ellipse cx="29" cy="29" rx="29" ry="29" fill="white" />
      <path
        d="M29.8286 11.6C27.7801 11.6 25.7777 12.2074 24.0745 13.3455C22.3712 14.4835 21.0437 16.1011 20.2598 17.9936C19.4759 19.8861 19.2708 21.9686 19.6704 23.9777C20.0701 25.9868 21.0565 27.8322 22.505 29.2807C23.9534 30.7292 25.7989 31.7156 27.808 32.1152C29.8171 32.5149 31.8996 32.3098 33.7921 31.5259C35.6846 30.742 37.3022 29.4145 38.4402 27.7112C39.5783 26.008 40.1857 24.0056 40.1857 21.9571C40.1857 19.2102 39.0945 16.5759 37.1522 14.6335C35.2098 12.6912 32.5755 11.6 29.8286 11.6Z"
        fill={color || "#656A76"}
      />
      <path
        d="M29 0C23.2643 0 17.6575 1.70082 12.8885 4.88738C8.11945 8.07394 4.40245 12.6031 2.20751 17.9022C0.0125652 23.2012 -0.561731 29.0322 0.55724 34.6576C1.67621 40.2831 4.43819 45.4504 8.49391 49.5061C12.5496 53.5618 17.7169 56.3238 23.3424 57.4428C28.9678 58.5617 34.7988 57.9874 40.0978 55.7925C45.3969 53.5976 49.9261 49.8805 53.1126 45.1115C56.2992 40.3425 58 34.7356 58 29C57.9912 21.3114 54.9331 13.9402 49.4964 8.50359C44.0598 3.06694 36.6886 0.00877192 29 0ZM45.5549 47.4896C45.5136 44.7725 44.4066 42.1805 42.4724 40.2718C40.5382 38.3632 37.9316 37.2908 35.2143 37.2857H22.7857C20.0684 37.2908 17.4618 38.3632 15.5276 40.2718C13.5934 42.1805 12.4864 44.7725 12.4452 47.4896C8.68875 44.1354 6.03974 39.7194 4.84888 34.8262C3.65803 29.9331 3.9815 24.7936 5.77648 20.0884C7.57145 15.3832 10.7533 11.3342 14.9006 8.47746C19.0479 5.62075 23.9651 4.09112 29.001 4.09112C34.037 4.09112 38.9542 5.62075 43.1015 8.47746C47.2488 11.3342 50.4306 15.3832 52.2256 20.0884C54.0206 24.7936 54.3441 29.9331 53.1532 34.8262C51.9623 39.7194 49.3113 44.1354 45.5549 47.4896Z"
        fill={color || "#656A76"}
      />
    </svg>
  );
};
