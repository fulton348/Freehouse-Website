export const handler = async function (event, context) {
  const SQUARE_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
  const CHARLESTON_DRAFT_CATEGORY = "NFR6NOCY26EV6UUYIUPGXFLP";

  try {
    // Paginate through ALL pages of the catalog, not just the first 100 items
    let allItems = [];
    let cursor = null;

    do {
      const url = cursor
        ? `https://connect.squareup.com/v2/catalog/list?types=ITEM&cursor=${encodeURIComponent(cursor)}`
        : `https://connect.squareup.com/v2/catalog/list?types=ITEM`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${SQUARE_TOKEN}`,
          "Content-Type": "application/json",
          "Square-Version": "2024-01-17",
        },
      });

      const data = await response.json();
      allItems = allItems.concat(data.objects || []);
      cursor = data.cursor || null;
    } while (cursor);

    const exclude = ["Beer Flight of Four", "Burpees Promo Draft Beer", "Oktoberfest Mug Deal", "Potter's Imperial Dry Cider"];

    const draftBeers = allItems
      .filter((item) => {
        const cats = (item.item_data?.categories || []).map((c) => c.id);
        return cats.includes(CHARLESTON_DRAFT_CATEGORY);
      })
      .filter((item) => !exclude.includes(item.item_data.name))
      .map((item) => ({
        name: item.item_data.name,
        // Square's catalog description field, if filled in
        description: item.item_data.description || item.item_data.description_html || null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ beers: draftBeers }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch beer list" }),
    };
  }
};
