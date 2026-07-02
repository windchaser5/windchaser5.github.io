import { mkdir, writeFile } from "node:fs/promises";

const token = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;
const notionVersion = process.env.NOTION_VERSION || "2022-06-28";

if (!token || !databaseId) {
  console.log("NOTION_TOKEN or NOTION_DATABASE_ID is missing. Skipping Notion sync.");
  process.exit(0);
}

const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Notion-Version": notionVersion,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    filter: {
      property: "Published",
      checkbox: {
        equals: true
      }
    },
    sorts: [
      {
        property: "Date",
        direction: "descending"
      }
    ]
  })
});

if (!response.ok) {
  throw new Error(`Notion API error: ${response.status} ${await response.text()}`);
}

const data = await response.json();

function plainText(parts = []) {
  return parts.map((part) => part.plain_text || "").join("").trim();
}

function prop(page, name) {
  return page.properties?.[name];
}

function propertyText(page, name) {
  const value = prop(page, name);
  if (!value) return "";
  if (value.type === "title") return plainText(value.title);
  if (value.type === "rich_text") return plainText(value.rich_text);
  if (value.type === "select") return value.select?.name || "";
  if (value.type === "date") return value.date?.start || "";
  if (value.type === "url") return value.url || "";
  return "";
}

function points(page) {
  const raw = propertyText(page, "Points");
  return raw.split("\n").map((item) => item.trim()).filter(Boolean);
}

const content = {
  perspectives: [],
  cases: []
};

for (const page of data.results || []) {
  const type = propertyText(page, "Type");
  const item = {
    date: propertyText(page, "Date").slice(0, 7).replace("-", "."),
    title: propertyText(page, "Title") || propertyText(page, "Name"),
    summary: propertyText(page, "Summary"),
    tag: propertyText(page, "Tag") || type,
    url: propertyText(page, "URL") || page.url
  };

  if (type === "Case") {
    content.cases.push({
      label: propertyText(page, "Label") || `Case ${String(content.cases.length + 1).padStart(2, "0")}`,
      title: item.title,
      summary: item.summary,
      points: points(page)
    });
  } else {
    content.perspectives.push(item);
  }
}

await mkdir("data", { recursive: true });
await writeFile("data/content.json", `${JSON.stringify(content, null, 2)}\n`);
console.log(`Synced ${content.perspectives.length} perspectives and ${content.cases.length} cases from Notion.`);
