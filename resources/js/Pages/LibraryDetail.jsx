import AppLayout from "@/Layouts/AppLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { Button, Divider, Textarea } from "@nextui-org/react";
import { IconFile, IconStarFilled } from "@tabler/icons-react";
import { filesize } from "filesize";
import path from "path-browserify";
import { useState } from "react";

function LibraryDetail({ product }) {
  console.log(product);

  const { baseUrl } = usePage().props

  const [comment, setComment] = useState(product.review?.comment ?? '');
  const [star, setStar] = useState(product.review?.rating ?? 0);

  async function onFileDownload(id) {
    window.open(`${baseUrl}/api/products/${product.id}/files/${id}`, "_blank", "noreferrer");
  }

  function onSubmitReview() {
    router.post(`${baseUrl}/reviews`, {
      productId: product.id,
      comment: comment,
      rating: star,
    })
  }

  return (
    <AppLayout>
      <Head title={product.name} />
      <div className="flex flex-row gap-4 items-start justify-start">
        <img className="size-12" src={`${baseUrl}/storage/${product.thumbnail_path}`} />
        <h1 className="font-medium text-3xl lg:text-5xl">{product.name}</h1>
      </div>

      <Divider className="my-8" />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-2">
          {product.files.map((e) => {
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
                </div>
              </div>
            )
          })}
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-2">
          <div className="border-gray-200 border-2 flex flex-col rounded-xl">
            <div className="p-4">
              <p className="font-bold text-xl">Ratings</p>
            </div>
            <Divider />
            <div className="p-4">
              <div className="flex flex-row items-center gap-2 mb-4">
                <span>Stars:</span>
                <StarReview onClick={() => setStar(1)} number={1} currentStarValue={star} />
                <StarReview onClick={() => setStar(2)} number={2} currentStarValue={star} />
                <StarReview onClick={() => setStar(3)} number={3} currentStarValue={star} />
                <StarReview onClick={() => setStar(4)} number={4} currentStarValue={star} />
                <StarReview onClick={() => setStar(5)} number={5} currentStarValue={star} />
              </div>

              <Textarea className="mb-4" variant="bordered" value={comment} onChange={(e) => setComment(e.target.value)} minRows={8} placeholder="Write your comment..." />
              <Button type="button" onClick={onSubmitReview} className="bg-gray-900 text-white" fullWidth>Submit</Button>
            </div>

          </div>
        </div>
      </div>

    </AppLayout>
  )
}

function StarReview({ onClick, number, currentStarValue }) {
  return (
    <button type="button" onClick={onClick}>
      <IconStarFilled className={`${number <= currentStarValue ? 'fill-yellow-400 stroke-yellow-400' : 'fill-gray-300 stroke-gray-300'}`} />
    </button>
  )
}

export default LibraryDetail;