import dotenv from "dotenv";

dotenv.config();

const catalogueUrl = process.env.CATALOGUE_URL;

const productUrl = process.env.PRODUCT_URL;

export { catalogueUrl, productUrl };
