import { copyFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const dist = join(process.cwd(), "dist")
const index = join(dist, "index.html")
const notFound = join(dist, "404.html")
const nojekyll = join(dist, ".nojekyll")

if (existsSync(index)) {
  copyFileSync(index, notFound)
}

writeFileSync(nojekyll, "")
