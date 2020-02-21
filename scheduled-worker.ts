const dotenv = require("dotenv");
dotenv.config();
import VasaParser from "./src/VasaParser";
import Slack from "./src/Slack";
import { createHash } from "crypto";
import { connect, model, Schema } from "mongoose";
const shaHasher = createHash("sha1");
shaHasher.update("test");

connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const DataHashSchema = new Schema({ name: String, hash: String });

const DataHash = model("DataHash", DataHashSchema);

const FORCE_SEND = process.env.FORCE_SEND || false;
const WATCH_URLS = [
  "https://results.vasaloppet.se/2020/index.php?content=detail&fpid=favorites&pid=favorites&idp=000017167888700000611F37&lang=EN_CAP&event=%C3%96SS_99999916788868000000075C&favorite_category=private&search_event=%C3%96SS_99999916788868000000075C",
  // "https://results.vasaloppet.se/2020/?content=detail&fpid=search&pid=search&idp=9999991678885D000031D85A&lang=EN_CAP&event=%C3%96SS_9999991678885C00000006F9&search%5Bname%5D=Per&search_event=%C3%96SS_9999991678885C00000006F9",
  "https://results.vasaloppet.se/2020/index.php?content=detail&fpid=favorites&pid=favorites&idp=9999991678887100006F192D&lang=EN_CAP&event=%C3%96SS_99999916788868000000075C&favorite_category=private&search_event=%C3%96SS_99999916788868000000075C"
];

const getSHA1ofJSON = function(input) {
  return createHash("sha1")
    .update(JSON.stringify(input))
    .digest("hex");
};

async function parseAll() {
  const parser = new VasaParser();
  const slack = new Slack();

  const promises = WATCH_URLS.map(async url => {
    const data = await parser.parse(url);

    const dataSha = getSHA1ofJSON(data.toJSON());

    const savedData: any = await DataHash.findOne({ name: data.name });
    if (FORCE_SEND || !savedData || (savedData && savedData.hash !== dataSha)) {
      console.log("Found diff!");
      await slack.postVasaUpdate(data);
      if (savedData) {
        console.log("Updating", data.name);
        savedData.hash = dataSha;
        await savedData.save();
      } else {
        console.log("Saving new", data.name);
        await new DataHash({ name: data.name, hash: dataSha }).save();
      }
    } else {
      console.log("No update for", data.name);
    }
  });

  return Promise.all(promises);
}

(async () => {
  await parseAll();
  return process.exit();
})();
