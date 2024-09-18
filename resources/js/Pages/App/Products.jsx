import Modal from "@/Components/Modal";
import AppLayout from "@/Layouts/AppLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { Button, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react";
import { IconImageInPicture } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

function Products({ products }) {
  const { baseUrl } = usePage().props;

  function deleteProduct(id) {
    router.delete(`${baseUrl}/products/${id}`);
  }

  const emptyElement = (
    <div className="w-full flex flex-col items-center justify-center mt-24">
      <ReactSVG className="size-[36rem]" src={`${baseUrl}/empty.svg`} />
      <p className="text-2xl">It's empty.</p>
    </div>
  )

  return (
    <AppLayout>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="font-semibold text-3xl">Products</h1>
        <Link href="/app/products/new">
          <Button color="primary" size="lg">
            New product
          </Button>
        </Link>
      </div>

      {products.length == 0 ? emptyElement : <div />}

      <Table aria-label="products list" className={`${products.length == 0 ? 'hidden' : 'block'} overflow-x-auto`}>
        <TableHeader>
          <TableColumn>THUMBNAIL</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>CATEGORY</TableColumn>
          <TableColumn></TableColumn>
        </TableHeader>
        <TableBody items={products ?? []}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.thumbnail_path ? <img className="size-8" src={`${baseUrl}/storage/${item.thumbnail_path}`}></img> : <IconImageInPicture size={24} />}
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>
                <div className="flex flex-row">
                  <Button className="mr-2" color="default" onClick={() => router.visit(`/app/products/${item.id}/edit`)}>Edit</Button>
                  <Button color="danger" onClick={() => deleteProduct(item.id)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

    </AppLayout>
  )
}

export default Products;