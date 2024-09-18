import Common from "@/common";
import AppLayout from "@/Layouts/AppLayout";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { IconStarFilled } from "@tabler/icons-react";
import { ReactSVG } from "react-svg";

function Library({ purchased }) {
  console.log(purchased);
  const { baseUrl } = usePage().props;

  const emptyElement = (
    <div className="w-full flex flex-col items-center justify-center mt-24">
      <ReactSVG className="size-[36rem]" src={`${baseUrl}/empty.svg`} />
      <p className="text-2xl">No matches found.</p>
    </div>
  )

  return (
    <AppLayout>
      <Head title="Library" />

      {purchased.length == 0 ? emptyElement : <div />}

      <div className="grid grid-cols-12 gap-8">
        {purchased.map((e) => {
          return (
            <Link href={`${baseUrl}/app/library/${e.id}`} key={e.id} className="col-span-12 lg:col-span-3 flex flex-col justify-between border-2 border-gray-200 rounded-2xl p-8 hover:bg-gray-200 transition">
              <img className="aspect-square mb-24" src={`${baseUrl}/storage/${e.thumbnail_path}`} />
              <div className="flex flex-col">
                <p className="text-xl text-left font-medium truncate mb-2">{e.name}</p>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-xl font-semibold text-red-500">Rp{Common.formatToCurrency(e.price)}</p>
                  <div className="flex flex-row gap-2 items-center justify-between">
                    <IconStarFilled className="fill-yellow-400 stroke-yellow-400" />
                    <span><span className="text-lg font-semibold">{e.stars.average} </span><span className="text-lg text-gray-600">({e.stars.total})</span></span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </AppLayout>
  )
}

export default Library;