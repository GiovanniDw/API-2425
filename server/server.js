import "dotenv/config";
import { App } from "@tinyhttp/app";
import { logger } from "@tinyhttp/logger";
import { Liquid } from "liquidjs";
import sirv from "sirv";

import { renderTemplate } from "./utils/renderTemplate.js";

const PORT = process.env.PORT | 3000;


const data = {
  'beemdkroon': {
    id: "beemdkroon",
    name: "Beemdkroon",
    image: {
      src: "https://i.pinimg.com/736x/09/0a/9c/090a9c238e1c290bb580a4ebe265134d.jpg",
      alt: "Beemdkroon",
      width: 695,
      height: 1080,
    },
  },
  'wilde-peen': {
    id: "wilde-peen",
    name: "Wilde Peen",
    image: {
      src: "https://mens-en-gezondheid.infonu.nl/artikel-fotos/tom008/4251914036.jpg",
      alt: "Wilde Peen",
      width: 418,
      height: 600,
    },
  },
};

const engine = new Liquid({
  extname: ".liquid",
});

const app = new App();

app.locals.title = "My App";
app.locals.email = "me@myapp.com";

app.engine("liquid", engine.express());

app.set("views", "./views");

app.set("view engine", "liquid");


app
  .use(logger())
  .use("/", sirv("dist"))
  .use("/", sirv("public"));
  

app.get("/", async (req, res) => {
  const pageData = {
    title: "Home",
    items: Object.values(data),
  };

  return res.send(renderTemplate("index.liquid", pageData));
});

app.get("/plant/:id/", async (req, res) => {
  const id = req.params.id;
  const item = data[id];

  const pageData = {
    title: `Detail page for ${id}`,
    item,
  };

  if (!item) {
    return res.status(404).send("Not found");
  }
  return res.send(renderTemplate("detail.liquid", pageData));
});


app.listen(3000, () => console.log("Server available on http://localhost:3000"));