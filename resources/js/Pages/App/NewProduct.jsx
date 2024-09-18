import Common from "@/common";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Input } from "@nextui-org/react";
import { IconArrowRight, IconCancel } from "@tabler/icons-react";
import { useState } from "react";

function NewProduct({ }) {
  const { auth } = usePage().props

  console.log(auth)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
  });

  function onFormDataChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function onCategoryClick(value) {
    setFormData((prev) => ({
      ...prev,
      'category': value,
    }))
  }

  function submit() {
    router.post("/api/products", formData);
  }

  return (
    <AppLayout>
      <Head title="New Product" />
      <div className="flex flex-row items-center justify-between mb-8 lg:mb-16">
        <h1 className="font-semibold text-3xl">New Product</h1>
        <div className="hidden lg:flex flex-row gap-2">
          <Link href="/app/products">
            <Button startContent={<IconCancel size={24} />} color="default" size="lg">
              Cancel
            </Button>
          </Link>
          <Button onClick={submit} startContent={<IconArrowRight size={24} />} color="primary" size="lg">
            Next
          </Button>
        </div>
      </div>

      <p className="font-medium mb-2">Name</p>
      <Input type="text" variant="bordered" size="lg" name="name" value={formData.name} onChange={onFormDataChange} />

      <div className="h-8"></div>

      <p className="font-medium mb-2">Category</p>
      <div className="grid grid-cols-12 gap-2 lg:gap-4">
        {Common.getProductCategories(24).map((e) => {
          return (
            <button type="button"
              key={e.name}
              className={`col-span-12 lg:col-span-4 border flex flex-row p-4 rounded-xl hover:bg-gray-200 transition ${formData.category == e.name ? 'border-gray-800 bg-gray-200' : 'border-gray-300'}`}
              onClick={() => onCategoryClick(e.name)}
            >
              {e.icon}
              <div className="flex flex-col items-start w-full ml-4">
                <p className="font-bold">{e.name}</p>
                <p className="font-medium text-left">{e.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="h-8"></div>

      <p className="font-medium mb-2">Price</p>
      <Input type="number" variant="bordered" size="lg" name="price" value={formData.price} onChange={onFormDataChange} />

      <div className="h-8"></div>

      <div className="flex lg:hidden flex-row gap-2">
        <Link href="/app/products">
          <Button startContent={<IconCancel size={24} />} color="default" size="lg" fullWidth>
            Cancel
          </Button>
        </Link>
        <Button onClick={submit} startContent={<IconArrowRight size={24} />} color="primary" size="lg" fullWidth>
          Next
        </Button>
      </div>

      <div className="h-8"></div>
    </AppLayout>
  )
}

export default NewProduct;