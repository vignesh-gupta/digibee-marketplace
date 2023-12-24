"use client";

import { PRODUCT_CATEGORIES } from "@/lib/config";
import { use, useEffect, useRef, useState } from "react";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  const isAnyOpen = activeIndex !== null;

  const navRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(navRef, () => {
    setActiveIndex(null);
  });

  return (
    <div ref={navRef} className="flex h-full gap-4">
      {PRODUCT_CATEGORIES.map((category, index) => {
        const handleOpen = () => {
          if (activeIndex === index) setActiveIndex(null);
          else setActiveIndex(index);
        };
        return (
          <NavItem
            category={category}
            isOpen={activeIndex === index}
            isAnyOpen={isAnyOpen}
            handleOpen={handleOpen}
            key={category.value}
          />
        );
      })}
    </div>
  );
};

export default NavItems;
