import {createServer} from "node:http"
import { URL } from "node:url";
import fs from "node:fs/promises"

const hostname = "127.0.0.1"
const port = 3000;

const pages = [
  {
  path: "/",
  page: "../index.html"
},
{
  path:"/about",
  page: "./about.html",
},
{
  path: "/contact",
  page: "./contact-me.html"
}
]
const errorPage = {
  page: "./404.html"
}

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  getPage(req).then(data => {
    res.end(data)
    console.log(data)
  })
})

async function getPage(req) {
  console.log("getting")
  let page = null
  for(let i = 0; i < pages.length; i++){
    if(pages[i].path === req.url) {
      page = pages[i];
      break
    }
  }
  if(!page) {page = errorPage}
  const path = new URL(page.page, import.meta.url)
  try {
    const data = await fs.readFile(path, {encoding: "utf8"})
    return data
  }
  catch(err) {
    console.log(err)
    return null
  }
}

server.listen(port, hostname, () => {
  console.log(`server running at: https://${hostname}:${port}`)
})