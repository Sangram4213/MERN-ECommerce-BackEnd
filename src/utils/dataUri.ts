import DataUriParser from 'datauri/parser.js';
import path from "path"

export const getDataUri = (photo:Express.Multer.File)=>{
  const parser = new DataUriParser();
  const extName = path.extname(photo.originalname).toString();

  return parser.format(extName,photo.buffer);
}