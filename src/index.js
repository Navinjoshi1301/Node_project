import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import swaggerDocs from "../swagger.js";
dotenv.config();
connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log(err);
      throw err;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server listening on port " + process.env.PORT);
      swaggerDocs(app,8000)
    });
  })
  .catch((err) => {
    console.log("MongoDB db Connection failed !!" + err);
  });
