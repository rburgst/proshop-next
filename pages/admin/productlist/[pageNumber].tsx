import { useRouter } from 'next/router'
import React, { FunctionComponent } from 'react'

import AdminProductListComponent from '../../../components/AdminProductListComponent'

const ProductListScreen: FunctionComponent = () => {
  const router = useRouter()
  const pageNumber = Number(router.query?.pageNumber ?? 1)
  return <AdminProductListComponent pageNumber={pageNumber} />
}

export default ProductListScreen
