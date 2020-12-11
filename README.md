# MERN eCommerce (next.js/typescript)

This is a next.js / typescript / redux-toolkit variant of the great [MERN eCommerce from Scratch](https://www.udemy.com/course/mern-ecommerce) course by [Brad Traversy](https://github.com/bradtraversy).

see also 

* https://www.udemy.com/course/mern-ecommerce
* https://github.com/bradtraversy/proshop_mern

In addition to the code from the sample repo it also contains a few security fixes.

Note that I purposefully stuck to the redux variant of the client app model even though it is somewhat of an 
antipattern when using next.js (you could use `getServerSideProps`).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
