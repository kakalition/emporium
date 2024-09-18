import { Link, router, usePage } from "@inertiajs/react";
import { Divider, Input, NextUIProvider } from "@nextui-org/react";
import { IconMenu, IconSearch, IconShoppingCart, IconUser } from "@tabler/icons-react";
import { useState } from "react";

function MainLayout({ children }) {
  const { appLogo, auth, baseUrl } = usePage().props

  const urlParts = usePage().url.split("?");
  const currentUrl = urlParts[0]
  const params = Object.fromEntries(new URLSearchParams(urlParts[1]));

  const [query, setQuery] = useState(params.query ?? "");

  function onQueryKeyUp(event) {
    if (event.key === 'Enter') {
      router.visit(`${currentUrl}?query=${query}`)
    }
  }

  function onQueryChange(event) {
    setQuery(event.target.value);
  }

  return (
    <NextUIProvider>
      <div className="min-h-screen w-full lg:pb-8">
        <div className="grid grid-cols-12 justify-between py-4 px-4 lg:px-48">
          <Link href="/" className="col-span-2 lg:col-span-3 flex flex-row items-center gap-4">
            <img className="size-8 lg:size-10" src={appLogo} />
            <h1 className="hidden lg:block font-semibold text-2xl">Emporium</h1>
          </Link>
          <div className="hidden lg:col-span-6 lg:flex items-center">
            <Input className="lg:block hidden" startContent={<IconSearch size={20} />} type="text" variant="bordered" size="md" value={query} onChange={onQueryChange} onKeyUp={onQueryKeyUp} />
          </div>
          <div className="col-span-10 lg:col-span-3 flex flex-row items-center justify-end gap-4 lg:gap-8">
            <Link href="/app/carts" className="flex flex-row items-center gap-1">
              <IconShoppingCart size={24} />
              <p className="hidden lg:block font-medium text-xl">Cart</p>
            </Link>
            <Link href="/app" className="flex flex-row items-center gap-1">
              {auth.user.profile_path ? <img src={`${baseUrl}/storage/${auth.user.profile_path}`} className="rounded-full size-8 lg:size-10 lg:mr-2" /> : <div className="bg-gray-800 rounded-full size-8 lg:size-10 mr-2" />}
              <p className="hidden lg:block font-medium text-xl">{auth.user.name}</p>
            </Link>
          </div>
        </div>

        <Divider />

        <div className="px-4 lg:px-48 mt-4 lg:mt-12">
          <Input className="block lg:hidden mb-4" startContent={<IconSearch size={20} />} type="text" variant="bordered" size="md" value={query} onChange={onQueryChange} onKeyUp={onQueryKeyUp} />
          {children}
        </div>
      </div>
    </NextUIProvider>
  )
}

export default MainLayout;