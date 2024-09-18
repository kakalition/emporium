import Common from "@/common";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Divider } from "@nextui-org/react";
import { IconStarFilled } from "@tabler/icons-react";
import moment from "moment";
import { Fragment } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Product({ product, stars }) {
  const { baseUrl } = usePage().props;

  console.log(product);

  function addToCart() {
    router.post(`/app/carts`, {
      productId: product.id,
    })
  }

  function viewItem() {
    router.visit(`${baseUrl}/app/library/${product.id}`)
  }

  function getCTA(isFullWidth, extraClass = '') {
    if (product.purchased) {
      return (
        <Button type="button" size="lg" color="default" className={`bg-gray-950 text-white ${extraClass}`} onClick={viewItem} fullWidth={isFullWidth}>View</Button>
      )
    }

    return (
      <Button type="button" size="lg" color="primary" className={extraClass} onClick={addToCart} fullWidth={isFullWidth}>Add to Cart</Button>
    )
  }

  return (
    <MainLayout>
      <Head title={product.name} />

      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex flex-row lg:items-center w-full">
          <div className="hidden lg:blockbg-gray-900 py-2 px-3 rounded-xl mr-4">
            <span className="text-white font-medium">Rp{Common.formatToCurrency(product.price)}</span>
          </div>
          <span className="text-gray-900 font-medium leading-snug text-4xl lg:text-3xl mb-4 lg:mb-0">{product.name}</span>
        </div>

        {getCTA(false, 'w-full lg:w-auto')}
      </div>

      <Divider className="my-8" />

      <Carousel showStatus={false} showThumbs={false}>
        {product.covers.map((e) => (
          <div key={e.id} className="h-64 lg:h-[48rem]">
            <img className="object-contain" src={`${baseUrl}/storage/${e.path}`}></img>
          </div>
        ))}
      </Carousel>

      <div className="h-8 lg:h-16" />

      <div className="grid grid-cols-12 lg:gap-12">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex flex-col justify-between">
            <p className="hidden lg:block text-gray-900 font-medium text-5xl mb-6">{product.name}</p>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row items-center">
                {product.user.profile_path ? <img src={`${baseUrl}/storage/${product.user.profile_path}`} className="rounded-full size-5 mr-2" /> : <div className="bg-gray-800 rounded-full size-5 mr-2" />}
                <p className="text-gray-600">{product.user.name}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <IconStarFilled className="fill-yellow-400 stroke-yellow-400" />
                <span><span className="text-lg font-semibold">{stars?.average ?? 0} </span><span className="text-lg text-gray-600">({product.reviews?.length ?? 0})</span></span>
              </div>
            </div>
          </div>

          <div className="h-8" />

          <p className="text-gray-900 font-medium text-base lg:text-xl whitespace-pre-line">{product.description}</p>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <div className="h-4" />

          {getCTA(true)}

          <div className="border-gray-200 border-2 flex flex-col rounded-xl">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="font-bold text-xl">Product Info</p>
            </div>
            <Divider />
            {product.attributes.map((e, index) => (
              <Fragment key={e.id}>
                <div className="flex flex-row items-center justify-between p-4">
                  <p className="font-medium">{e.key}</p>
                  <p className="">{e.value}</p>
                </div>
                {index != (product.attributes.length - 1) ? <Divider /> : <div />}
              </Fragment>
            ))}
          </div>

          <div className="border-gray-200 border-2 flex flex-col rounded-xl">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="font-bold text-xl">Ratings</p>
              <div className="flex flex-row gap-2 items-center">
                <IconStarFilled className="fill-yellow-400 stroke-yellow-400" />
                <span><span className="text-lg font-semibold">{product.stars.average} </span><span className="text-lg text-gray-600">({product.reviews.length})</span></span>
              </div>
            </div>
            <Divider />
            <div className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
              <span>5 stars</span>
              <span>{Common.ifNanZero(product.stars['values']['5'] / product.reviews.length * 100)}%</span>
            </div>
            <div className="flex flex-row items-center justify-between px-4 py-2">
              <span>4 stars</span>
              <span>{Common.ifNanZero(product.stars['values']['4'] / product.reviews.length * 100)}%</span>
            </div>
            <div className="flex flex-row items-center justify-between px-4 py-2">
              <span>3 stars</span>
              <span>{Common.ifNanZero(product.stars['values']['3'] / product.reviews.length * 100)}%</span>
            </div>
            <div className="flex flex-row items-center justify-between px-4 py-2">
              <span>2 stars</span>
              <span>{Common.ifNanZero(product.stars['values']['2'] / product.reviews.length * 100)}%</span>
            </div>
            <div className="flex flex-row items-center justify-between px-4 pt-2 pb-4">
              <span>1 stars</span>
              <span>{Common.ifNanZero(product.stars['values']['1'] / product.reviews.length * 100)}%</span>
            </div>
            <Divider />
            {product.reviews.map((e, index) => (
              <Fragment key={e.id}>
                <div className="flex flex-col justify-between p-4">
                  <div className="flex flex-row gap-2 mb-2">
                    {Array.from(Array(e.rating).keys()).map((e) => (
                      <IconStarFilled key={e} className="fill-yellow-400 stroke-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-2">"{e.comment}"</p>
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center">
                      {e.user.profile_path ? <img src={`${baseUrl}/storage/${e.user.profile_path}`} className="rounded-full size-5 mr-2" /> : <div className="bg-gray-800 rounded-full size-5 mr-2" />}
                      <p className="text-gray-600">{e.user.name}</p>
                    </div>
                    <p className="text-gray-600">{moment(e.created_at).fromNow()}</p>
                  </div>
                </div>
                {index != (product.reviews.length - 1) ? <Divider /> : <div />}
              </Fragment>
            ))}
          </div>

          <div className="h-8" />
        </div>
      </div>
    </MainLayout>
  )
}

export default Product;