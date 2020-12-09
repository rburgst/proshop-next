import React, { FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'

interface MetaProps {
  title?: string
  description?: string
  keywords?: string
}
const Meta: FunctionComponent<MetaProps> = ({
  title = 'Welcome to ProShop',
  description = 'We sell the best products for cheap',
  keywords = 'electronics, buy electronics, cheap electronics',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  )
}

export default Meta
