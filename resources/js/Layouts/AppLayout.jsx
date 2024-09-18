import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Chip, Divider, NextUIProvider } from "@nextui-org/react";
import { IconArrowLeft, IconMenu } from "@tabler/icons-react";
import { useState } from "react";

function AppLayout({ children }) {
  const { appLogo, baseUrl } = usePage().props
  const currentPageSlug = usePage().url.replace("/app/", "")

  const [drawerOpen, setDrawerOpen] = useState(false);

  function getMenuChipVariant(value) {
    if (currentPageSlug.includes(value)) {
      return "solid";
    }

    return "bordered";
  }

  return (
    <NextUIProvider>
      <div className="min-h-screen w-full lg:pb-8">
        <div className="grid grid-cols-12 justify-between py-4 px-4 lg:px-48">
          <Link href="/" className="col-span-2 lg:col-span-3 flex flex-row items-center gap-4">
            <img className="size-8 lg:size-10" src={appLogo} />
            <h1 className="hidden lg:block font-semibold text-2xl">Emporium</h1>
          </Link>
          <div className={`order-last lg:order-none flex flex-col lg:flex-row items-start lg:items-center justify-center gap-2 lg:gap-4 col-span-12 lg:col-span-6 ${drawerOpen ? 'flex' : 'hidden lg:flex'}`}>
            <div className="h-6 lg:h-0" />
            <Link href="/app/library">
              <Chip color="default" variant={getMenuChipVariant("library")} size="lg" className="p-4">
                <span className="font-medium text-lg w-full">Library</span>
              </Chip>
            </Link>
            <Link href="/app/products">
              <Chip color="default" variant={getMenuChipVariant("products")} size="lg" className="p-4">
                <span className="font-medium text-lg">Products</span>
              </Chip>
            </Link>
            <Link href="/app/sales">
              <Chip color="default" variant={getMenuChipVariant("sales")} size="lg" className="p-4">
                <span className="font-medium text-lg">Sales</span>
              </Chip>
            </Link>
            <Link href="/app/transactions">
              <Chip color="default" variant={getMenuChipVariant("transactions")} size="lg" className="p-4">
                <span className="font-medium text-lg">Transactions</span>
              </Chip>
            </Link>
            <Link href="/app/profile">
              <Chip color="default" variant={getMenuChipVariant("profile")} size="lg" className="p-4">
                <span className="font-medium text-lg">Profile</span>
              </Chip>
            </Link>
            <button type="button" onClick={() => router.post(`${baseUrl}/logout`)}>
              <Chip color="default" variant="bordered" size="lg" className="p-4">
                <span className="font-medium text-lg">Logout</span>
              </Chip>
            </button>
          </div>
          <div className="col-span-10 lg:col-span-3 flex flex-row items-center justify-end gap-8">
            <Link href="/products/all" className="flex flex-row items-center gap-1">
              <IconArrowLeft size={24} />
              <p className="hidden lg:block font-medium text-xl">Back</p>
            </Link>
            <IconMenu size={24} className="block lg:hidden" onClick={() => setDrawerOpen(!drawerOpen)} />
          </div>
        </div>

        <Divider />

        <div className="px-4 lg:px-48 mt-4 lg:mt-12">
          {children}
        </div>
      </div>
    </NextUIProvider>
  )
}

export default AppLayout;