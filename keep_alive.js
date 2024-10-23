import http from "http";

export const keep_alive = () => {
  http
    .createServer((req, res) => {
      res.write("I am alive!");
      res.end();
    })
    .listen(8080);
};
