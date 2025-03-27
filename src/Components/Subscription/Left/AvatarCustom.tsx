import React from "react";

type AvatarProps = {
  src: string;
  alt?: string;
  size?: number;
};

const Avatar: React.FC<AvatarProps> = ({ src, alt = "Avatar", size = 50 }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
};

export default Avatar;
