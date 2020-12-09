import Link from 'next/link'
import React, { FunctionComponent } from 'react'
import { Pagination } from 'react-bootstrap'

interface PaginateProps {
  pages: number
  page: number
  isAdmin?: boolean
  keyword: string
}
const Paginate: FunctionComponent<PaginateProps> = ({ pages, page, isAdmin = false, keyword }) => {
  return pages > 1 ? (
    <Pagination>
      {[...Array(pages).keys()].map((x) => {
        const productLink = keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`
        const adminLink = `/admin/productlist/${x + 1}`
        const link = isAdmin ? adminLink : productLink
        return (
          <Link key={x + 1} href={link}>
            <Pagination.Item as="a" href={link} active={x + 1 === page}>
              {x + 1}
            </Pagination.Item>
          </Link>
        )
      })}
    </Pagination>
  ) : null
}

export default Paginate
