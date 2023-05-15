import * as dotenv from 'dotenv';
import { Client } from "@notionhq/client";
dotenv.config();

const DATABASE_ID = '998af5d921dc41fe851443b57eec98bc';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

(async () => {
  const records = await notion.databases.query({
    database_id: DATABASE_ID
  });

  const x = records.results[0];
  console.log(x.properties['Movie 1'].rich_text[0].plain_text);
})();
