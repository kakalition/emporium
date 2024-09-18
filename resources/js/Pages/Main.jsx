import Common from "@/common";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Chip, Divider } from "@nextui-org/react";
import { IconStarFilled } from "@tabler/icons-react";
import { useMemo } from "react";
import { ReactSVG } from "react-svg";

function Main({ products }) {
  const { baseUrl } = usePage().props;
  const currentSlug = (usePage().url.split("?")[0]).split("/").pop() ?? "all"

  console.log('products', products)
  const rawChips = useMemo(() => {
    return [{ name: "All", slug: "all" }, ...Common.productCategories];
  }, []);

  const emptyElement = (
    <div className="w-full flex flex-col items-center justify-center mt-24">
      <ReactSVG className="size-64 lg:size-[36rem]" src={`${baseUrl}/empty.svg`} />
      <p className="text-2xl">No matches found.</p>
    </div>
  )

  return (
    <MainLayout>
      <Head title="Find Product" />
      <div className="flex flex-row gap-4 w-full overflow-x-scroll pb-4">
        {rawChips.map((e) => {
          return (
            <Link href={`/products/${e.slug}`} key={e.name}>
              <Chip variant={currentSlug == e.slug ? "solid" : "light"} size="lg">{e.name}</Chip>
            </Link>
          )
        })}
      </div>

      <Divider className="my-6" />

      <h2 className="text-2xl lg:text-3xl font-medium mb-4">{currentSlug == "all" ? "All" : Common.productCategories.filter((e) => e.slug == currentSlug)[0].name}</h2>

      <div className="h-8"></div>

      {products.length == 0 ? emptyElement : <div />}

      <div className="grid grid-cols-12 gap-8">
        {products.map((e) => {
          return (
            <Link href={`${baseUrl}/u/${e.email}/p/${e.url}`} key={e.id} className="col-span-12 lg:col-span-3 flex flex-col  border-2 border-gray-200 rounded-2xl p-8 hover:bg-gray-200 transition">
              <img className="aspect-square mb-24" src={`${baseUrl}/storage/${e.thumbnail_path}`} />
              <div className="flex flex-col">
                <p className="text-xl text-left font-medium truncate mb-2">{e.name}</p>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-xl font-semibold text-red-500">Rp{Common.formatToCurrency(e.price)}</p>
                  <div className="flex flex-row gap-2 items-center justify-between">
                    <IconStarFilled className="fill-yellow-400 stroke-yellow-400" />
                    <span><span className="text-lg font-semibold">{e.rating_value} </span><span className="text-lg text-gray-600">({e.total_review})</span></span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="h-24" />
    </MainLayout>
  )
}

export default Main;