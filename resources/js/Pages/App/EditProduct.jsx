import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Chip, Divider, Input, Textarea } from "@nextui-org/react";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useMemo, useState } from "react";
import slugify from "slugify";

function EditProduct({ product, covers }) {
  console.log('product', product);
  console.log('covers', covers);

  const { auth, baseUrl } = usePage().props
  const productBaseUrl = `${baseUrl}/u/${auth.user.email}/p/`

  const [formData, setFormData] = useState({
    ...product
  });

  const [currentThumbnail, setCurrentThumbnail] = useState(product.thumbnail_path);
  const [currentCovers, setCurrentCovers] = useState(covers);

  function onFormDataChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function submit() {
    router.put(`/api/products/${product.id}`, formData);
  }

  function publish() {
    if (product.status == "UNPUBLISHED") {
      router.post(`/api/products/${product.id}/publish`);
      return;
    }

    router.post(`/api/products/${product.id}/unpublish`);
  }

  async function onCoverUpload(e) {
    var formData = new FormData();
    var file = e.target.files[0]

    formData.append("file", file);

    const result = await axios.post(`${baseUrl}/api/products/${product.id}/covers`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    setCurrentCovers(result.data)
  }

  async function onCoverDelete(id) {
    const result = await axios.delete(`${baseUrl}/api/products/${product.id}/covers/${id}`);

    setCurrentCovers(result.data)
  }

  async function onThumbnailUpload(e) {
    var formData = new FormData();
    var file = e.target.files[0]

    formData.append("file", file);

    const result = await axios.post(`${baseUrl}/api/products/${product.id}/thumbnail`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    setCurrentThumbnail(result.data)
  }

  async function onThumbnailDelete() {
    await axios.delete(`${baseUrl}/api/products/${product.id}/thumbnail`);

    setCurrentThumbnail(null)
  }

  const thumbnailElement = useMemo(() => {
    if (currentThumbnail == null) {
      return <div></div>
    }

    return (
      <div className="relative">
        <img className="size-48 rounded-lg" src={`${baseUrl}/storage/${currentThumbnail}`} />
        <button type="button" className="absolute top-[-10px] right-[-10px]" onClick={() => onThumbnailDelete()}>
          <div className="flex items-center justify-center bg-red-400 rounded-full p-1">
            <IconTrash className="stroke-white" size={20} />
          </div>
        </button>
      </div>
    )
  }, [currentThumbnail])

  const thumbnailUploadElement = useMemo(() => {
    if (currentThumbnail == null) {
      return <Input type="file" variant="bordered" size="lg" onChange={onThumbnailUpload} />
    }

    return <div></div>
  }, [currentThumbnail])

  function addAttributes() {
    setFormData((prev) => ({
      ...prev,
      attributes: [...(prev.attributes ?? []), { id: Math.random() * 10000, key: "", value: "" }],
    }));
  }

  function onAttributeKeyChange(index, event) {
    setFormData((prev) => {
      const temp = prev.attributes;
      temp[index]['key'] = event.target.value;

      return {
        ...prev,
        attributes: temp,
      }
    });
  }

  function onAttributeValueChange(index, event) {
    setFormData((prev) => {
      const temp = prev.attributes;
      temp[index]['value'] = event.target.value;

      return {
        ...prev,
        attributes: temp,
      }
    });
  }

  return (
    <AppLayout>
      <Head title="Edit Product" />
      <div className="flex flex-row items-center justify-between mb-8 lg:mb-12">
        <h1 className="font-semibold text-3xl">{product.name}</h1>
        <div className="hidden lg:flex flex-row gap-2">
          <Button onClick={publish} color={product.status == "UNPUBLISHED" ? "primary" : "default"} size="lg">
            {product.status == "UNPUBLISHED" ? "Publish" : "Unpublish"}
          </Button>
          <Button onClick={submit} color="primary" variant="bordered" size="lg">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex flex-row gap-2 mb-4">

        <Link href={`/app/products/${product.id}/edit`}>
          <Chip color="default" variant="flat" size="lg" className="p-4">
            <span className="font-medium text-lg">Product</span>
          </Chip>
        </Link>

        <Link href={`/app/products/${product.id}/edit/content`}>
          <Chip color="default" variant="light" size="lg" className="p-4">
            <span className="font-medium text-lg">Content</span>
          </Chip>
        </Link>
      </div>

      <Divider />

      <div className="h-8"></div>

      <p className="font-medium mb-2">Name</p>
      <Input type="text" variant="bordered" size="lg" name="name" value={formData.name} onChange={onFormDataChange} />

      <div className="h-8"></div>

      <p className="font-medium mb-2">Description</p>
      <Textarea type="text" variant="bordered" size="lg" name="description" value={formData.description ?? ''} onChange={onFormDataChange} />

      <div className="h-8"></div>

      <p className="font-medium mb-2">URL</p>
      <Input startContent={<Chip className="hidden lg:block" variant="bordered">{productBaseUrl}</Chip>} type="text" variant="bordered" size="lg" name="url" value={formData.url ?? ''} onChange={onFormDataChange} />

      <div className="h-8"></div>
      <Divider />
      <div className="h-8"></div>

      <h2 className="text-4xl">Product Info</h2>
      <div className="h-8"></div>

      <div className="mb-4 flex flex-col gap-4">
        {formData.attributes?.map((e, index) => {
          return (
            <div key={e.id} className="flex flex-row gap-2">
              <Input variant="bordered" value={formData.attributes[index].key} onChange={(event) => onAttributeKeyChange(index, event)} placeholder="Attribute" />
              <Input variant="bordered" value={formData.attributes[index].value} onChange={(event) => onAttributeValueChange(index, event)} placeholder="Value" />
              <Button type="button"><IconTrash /></Button>
            </div>
          )
        })}
      </div>

      <Button type="button" onClick={addAttributes} fullWidth>Add Info</Button>

      <div className="h-8"></div>
      <Divider />
      <div className="h-8"></div>

      <h2 className="text-4xl">Cover</h2>
      <div className="h-8"></div>

      <div className="flex flex-row gap-4 mb-4">
        {currentCovers.map((e) => (
          <div key={e.id} className="relative">
            <img className="size-24 rounded-lg" src={`${baseUrl}/storage/${e.path}`} />
            <button type="button" className="absolute top-[-10px] right-[-10px]" onClick={() => onCoverDelete(e.id)}>
              <div className="flex items-center justify-center bg-red-400 rounded-full p-1">
                <IconTrash className="stroke-white" size={20} />
              </div>
            </button>
          </div>
        ))}
      </div>

      <Input type="file" variant="bordered" size="lg" onChange={onCoverUpload} />

      <div className="h-8"></div>
      <Divider />
      <div className="h-8"></div>

      <h2 className="text-4xl">Thumbnail</h2>
      <div className="h-8"></div>

      <div className="flex flex-row gap-4 mb-4">
        {thumbnailElement}
      </div>

      {thumbnailUploadElement}

      <div className="h-8"></div>
      <Divider />
      <div className="h-8"></div>

      <h2 className="text-4xl">Pricing</h2>
      <div className="h-8"></div>

      <p className="font-medium mb-2">Price</p>
      <Input startContent={<span>Rp</span>} type="number" variant="bordered" size="lg" name="price" value={formData.price} onChange={onFormDataChange} />

      <div className="h-8"></div>

      <div className="flex lg:hidden flex-row gap-2">
        <Button onClick={submit} color="primary" variant="bordered" size="lg" fullWidth>
          Save Changes
        </Button>
        <Button onClick={publish} color={product.status == "UNPUBLISHED" ? "primary" : "default"} size="lg" fullWidth>
          {product.status == "UNPUBLISHED" ? "Publish" : "Unpublish"}
        </Button>
      </div>

      <div className="h-24"></div>

    </AppLayout>
  )
}

export default EditProduct;