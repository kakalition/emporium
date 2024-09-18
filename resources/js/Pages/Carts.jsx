import Common from "@/common";
import MainLayout from "@/Layouts/MainLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Button, Divider } from "@nextui-org/react";
import { useMemo } from "react";

import { v4 as uuidv4 } from "uuid";

function Carts({ carts }) {
  const { baseUrl } = usePage().props;

  const subtotal = useMemo(() => {
    return parseFloat(carts.map((e) => e.product.price).reduce((prev, cur) => prev + parseFloat(cur), 0))
  }, [carts]);

  const tax = useMemo(() => {
    return subtotal * 0.11;
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + tax;
  }, [subtotal, tax]);

  function redirectToPaymentPage() {
    router.visit("/app/carts/payment")
  }

  return (
    <MainLayout>
      <Head title="Carts" />

      <div className="grid grid-cols-12 gap-2 lg:gap-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          {carts.map((e) => (
            <div key={e.id} className="border-2 border-gray-200 rounded-xl p-4 flex flex-row">
              <img className="size-12 mr-4" src={`${baseUrl}/storage/${e.product.thumbnail_path} `} />
              <div className="flex flex-col w-full">
                <p className="text-xl font-semibold">{e.product.name}</p>
                <div className="flex flex-row items-center justify-between">
                  <p>{e.product.category}</p>
                  <p className="font-semibold text-red-500">Rp{Common.formatToCurrency(e.product.price)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="border-2 border-gray-200 rounded-xl flex flex-col">
            <div className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">Rp{Common.formatToCurrency(subtotal)}</p>
            </div>
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-gray-600">Tax</p>
              <p className="font-medium">Rp{Common.formatToCurrency(tax)}</p>
            </div>
            <Divider />
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-gray-600">Total</p>
              <p className="font-medium">Rp{Common.formatToCurrency(subtotal + tax)}</p>
            </div>
          </div>
          <Button color="primary" size="lg" onClick={redirectToPaymentPage} fullWidth>Pay</Button>
        </div>
      </div>
    </MainLayout>
  );
}

export default Carts;