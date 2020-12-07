import { useRouter } from 'next/router'
import React, { FormEvent, FunctionComponent, useCallback, useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const SearchBox: FunctionComponent = () => {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()

  const submitHandler = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (keyword.trim()) {
        router.push(`/search/${keyword}`)
      } else {
        router.push(`/`)
      }
    },
    [router, keyword]
  )
  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        onChange={(e) => setKeyword(e.currentTarget.value)}
        placeholder="Search Products..."
        className="mr-sm-2 ml-sm-2"
      ></Form.Control>
      <Button type="submit" variant="outline-success" className="p-2">
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
