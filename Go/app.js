const express = require('express')
const fs = require('fs');
const app = express()
const port = 3000

app.use(express.static('.'));

app.get('/getWasmBuffer', (req, res) => {
  const wasmCode = fs.readFileSync("./lib.wasm",{ encoding: null })
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  const oneYear = 31536000000
  res.set({
    'Content-Type': 'application/wasm',
    'Cache-Control':`public, max-age=${oneYear}`,
    'Expires': new Date(Date.now() + oneYear).toUTCString()
  })
  res.send(wasmCode)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
