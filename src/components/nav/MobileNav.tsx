import { PRODUCT_CATEGORIES } from "@/config";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="block lg:hidden">
        <Button variant="outline" size="icon">
          <Menu className="h-10" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        {PRODUCT_CATEGORIES.map((product, i) => (
          <Accordion key={product.value} type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>{product.label}</AccordionTrigger>
              <AccordionContent className="">
                {product.featured.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm block py-2 px-4 hover:bg-gray-100"
                  >
                    {item.name}
                  </a>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
