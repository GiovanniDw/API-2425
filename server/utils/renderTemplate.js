import { Liquid } from "liquidjs";
import {engine} from '../server.js';
// const engine = new Liquid({
//   extname: ".liquid",
// });

export const renderTemplate = (template, data) => {
const viewPath = `./views/${template}`;


  const templateData = {
    NODE_ENV: process.env.NODE_ENV || "production",
    ...data,
  };

  return engine.renderFileSync(viewPath, templateData);
};
