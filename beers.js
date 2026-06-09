exports.handler = async function (event, context) {
  const SQUARE_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
  const CHARLESTON_DRAFT_CATEGORY = "NFR6NOCY26EV6UUYIUPGXFLP";

  try {
    const response = await fetch("https://connect.squareup.com/v2/catalog/list?types=ITEM", {
      headers: {
        Authorization: `Bearer ${SQUARE_TOKEN}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-01-17",
      },
    });

    const data = await response.json();
    const items = data.objects || [];

    // Filter to only items in the Charleston Draft menu category
    const draftBeers = items
      .filter((item) => {
        const cats = (item.item_data?.categories || []).map((c) => c.id);
        return cats.includes(CHARLESTON_DRAFT_CATEGORY);
      })
      .map((item) => item.item_data.name)
      .filter((name) => {
        // Exclude non-beer entries
        const exclude = ["Beer Flight of Four", "Burpees Promo Draft Beer", "Oktoberfest Mug Deal", "Potter's Imperial Dry Cider"];
        return !exclude.includes(name);
      })
      .sort();

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
