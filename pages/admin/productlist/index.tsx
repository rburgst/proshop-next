import React, { FunctionComponent } from 'react'

import AdminProductListComponent from '../../../components/AdminProductListComponent'

const ProductListScreen: FunctionComponent = () => {
  const pageNumber = 1
  return <AdminProductListComponent pageNumber={pageNumber} />
}

export default ProductListScreen
