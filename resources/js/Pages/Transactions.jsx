import Common from "@/common";
import AppLayout from "@/Layouts/AppLayout";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { Button, Chip, Divider } from "@nextui-org/react";
import { IconStarFilled } from "@tabler/icons-react";
import moment from "moment";
import { ReactSVG } from "react-svg";

function Transactions({ transactions }) {
  const { baseUrl } = usePage().props;
  console.log(transactions);

  const emptyElement = (
    <div className="w-full flex flex-col items-center justify-center mt-24">
      <ReactSVG className="size-[36rem]" src={`${baseUrl}/empty.svg`} />
      <p className="text-2xl">No matches found.</p>
    </div>
  )

  const getPaymentButton = (e) => (
    <Button type="button" color="primary" size="sm">
      <a href={e.payment_url}>Continue Payment</a>
    </Button>
  )

  return (
    <AppLayout>
      <Head title="Transactions" />

      {transactions.length == 0 ? emptyElement : <div />}

      <div className="flex flex-col gap-2">
        {transactions.map((e) => {
          let sum = 0;

          let chip = <div />
          if (e.status == "PENDING") {
            chip = <Chip color="default" size="sm">Pending</Chip>;
          } else if (e.status == "FAILED") {
            chip = <Chip color="danger" size="sm">Failed</Chip>;
          } else if (e.status == "FINISHED") {
            chip = <Chip color="success" size="sm">Success</Chip>;
          }

          return (
            <div key={e.id} className="col-span-3 flex flex-col border-2 border-gray-200 rounded-2xl p-4 lg:p-8 hover:bg-gray-200 transition">
              <div className="flex flex-col lg:flex-row gap-2 mb-4 items-start lg:items-center justify-between">
                <div className="flex flex-row gap-2 justify-between w-full">
                  <p className="font-medium">{moment(e.updated_at).format("DD MMM YYYY")}</p>
                  {chip}
                </div>
                <p className="font-medium text-gray-500 truncate">{e.order_id.replaceAll('-', '/')}</p>
              </div>
              <div className="flex flex-col gap-5">
                {e.details.map((e) => {
                  sum += parseFloat(e.price);
                  return (
                    <div key={e.id} className="flex flex-row gap-4">
                      <img className="size-12" src={`${baseUrl}/storage/${e.product.thumbnail_path}`}></img>
                      <div className="flex flex-col w-full">
                        <p className="text-base lg:text-xl font-medium">{e.product.name}</p>
                        <div className="flex flex-row items-center justify-between w-full">
                          <p>{e.product.user.name}</p>
                          <p className="text-base text-red-500 lg:text-xl font-medium">Rp{Common.formatToCurrency(e.price)}</p>
                        </div>
                      </div>
                    </div>
                  )
                }
                )}
                <Divider />
                <div className="flex flex-row items-center justify-between w-full mb-2">
                  <p className="text-base lg:text-xl font-medium">Total:</p>
                  <p className="text-base lg:text-xl font-medium text-red-500">Rp{Common.formatToCurrency(sum)}</p>
                </div>

                {e.status == "PENDING" ? getPaymentButton(e) : null}
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-8" />
    </AppLayout>
  )
}

export default Transactions;