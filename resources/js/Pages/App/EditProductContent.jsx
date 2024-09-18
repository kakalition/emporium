import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Chip, Divider, Input, Textarea } from "@nextui-org/react";
import { IconFile } from "@tabler/icons-react";
import axios from "axios";
import { filesize } from "filesize";
import path from "path-browserify";
import { useState } from "react";

function EditProduct({ product, files }) {
  const { auth, baseUrl } = usePage().props

  console.log(files)

  const [currentFiles, setCurrentFiles] = useState(files ?? [])

  function submit() {
    router.put(`/api/products/${product.id}`, formData);
  }

  async function onFileUpload(e) {
    var formData = new FormData();
    var file = e.target.files[0]

    formData.append("file", file);

    const result = await axios.post(`${baseUrl}/api/products/${product.id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    setCurrentFiles(result.data)
  }

  async function onFileDownload(id) {
    window.open(`${baseUrl}/api/products/${product.id}/files/${id}`, "_blank", "noreferrer");
  }

  async function onFileDelete(id) {
    const result = await axios.delete(`${baseUrl}/api/products/${product.id}/files/${id}`);

    setCurrentFiles(result.data)
  }

  function publish() {
    if (product.status == "UNPUBLISHED") {
      router.post(`/api/products/${product.id}/publish`);
      return;
    }

    router.post(`/api/products/${product.id}/unpublish`);
  }

  return (
    <AppLayout>
      <Head title="Edit Product Content" />
      <div className="flex flex-row items-center justify-between mb-12">
        <h1 className="font-semibold text-3xl">{product.name}</h1>
        <div className="flex flex-row gap-2">
          <Button onClick={publish} color={product.status == "UNPUBLISHED" ? "primary" : "default"} size="lg">
            {product.status == "UNPUBLISHED" ? "Publish" : "Unpublish"}
          </Button>
        </div>
      </div>

      <div className="flex flex-row gap-2 mb-4">

        <Link href={`/app/products/${product.id}/edit`}>
          <Chip color="default" variant="light" size="lg" className="p-4">
            <span className="font-medium text-lg">Product</span>
          </Chip>
        </Link>

        <Link href={`/app/products/${product.id}/edit/content`}>
          <Chip color="default" variant="flat" size="lg" className="p-4">
            <span className="font-medium text-lg">Content</span>
          </Chip>
        </Link>
      </div>

      <Divider />

      <div className="h-8"></div>

      <div className="flex flex-col gap-2">
        {currentFiles.map((e) => {
          return (
            <div key={e.id} className="flex flex-row items-center justify-between p-4 rounded-xl border-2 border-gray-200">
              <div className="flex flex-row items-center">
                <IconFile size={36} className="mr-2" />
                <div className="flex flex-col">
                  <p className="font-semibold">{e.filename}</p>
                  <p>{path.extname(e.filename).replaceAll(".", "").toUpperCase()} • {filesize(e.size)}</p>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <Button type="button" onClick={() => onFileDownload(e.id)}>Download</Button>
                <Button type="button" color="danger" onClick={() => onFileDelete(e.id)}>Delete</Button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="h-8"></div>
      <Divider />
      <div className="h-8"></div>

      <Input type="file" variant="bordered" size="lg" onChange={onFileUpload} />

    </AppLayout>
  )
}

export default EditProduct;