import AddToCartButton from "@/components/AddToCartButton";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductImageSlider from "@/components/ProductImageSlider";
import ProductReel from "@/components/ProductReel";
import { PRODUCT_CATEGORIES } from "@/config";
import { getPayloadClient } from "@/get-payload";
import { formatPrice } from "@/lib/utils";
import { CheckIcon, Shield } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductDetailsProps = {
  params: {
    productId: string;
  };
};

const BREADCRUMBS = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Products", href: "/products" },
];

const ProductDetails = async ({
  params: { productId },
}: ProductDetailsProps) => {
  const payload = await getPayloadClient();

  const { docs: products } = await payload.find({
    collection: "products",
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        equals: "approved",
      },
    },
  });
  const [product] = products;

  if (!product) {
    return notFound();
  }

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  const validURLs = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  return (
    <MaxWidthWrapper>
      <div className="bg-white">
        <div className=" mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product Detail*/}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={breadcrumb.href}
                      className="font-medium text-muted-foreground text-sm hover:text-gray-900"
                    >
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 ? (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <section className="mt-4">
              <div className="flex items-center">
                <p className="font-medium text-green-900">
                  {formatPrice(product.price)}
                </p>

                <div className="ml-4 border-l text-muted-foreground border-gray-300 pl-4">
                  {label}
                </div>
              </div>

              <div className="mt-4 space-y-6">
                <p className="text-base text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <CheckIcon
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-gray-500"
                />
                <p className="ml-2 text-sm text-muted-foreground">
                  Eligible for Instant Delivery
                </p>
              </div>
            </section>
          </div>
          {/* Product Image */}
          <div className="mt-10 lg:col-start-2 lg:row-span-1 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-lg">
              <ProductImageSlider urls={validURLs} />
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div>
              <div className="mt-10">
                <AddToCartButton product={product} />
              </div>

              <div className="mt-6 text-center">
                <div className="group inline-flex text-sm font-medium">
                  <Shield
                    aria-hidden="true"
                    className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
                  />
                  <span className="text-muted-foreground hover:text-gray-700">
                    30 Day Return Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReel
        title={`Similar ${label}`}
        href="/products"
        query={{
          category: product.category,
          limit: 4,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default ProductDetails;
