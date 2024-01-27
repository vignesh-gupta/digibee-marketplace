import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container relative flex flex-col items-center justify-center px-0 pt-5">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
