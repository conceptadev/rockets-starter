import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const filter = request.nextUrl.searchParams.get("filter[]");
  const products = [
    { id: "1", title: "Product 1", category: "Category 1" },
    { id: "2", title: "Product 2", category: "Category 2" },
    { id: "3", title: "Product 3", category: "Category 3" },
    { id: "4", title: "Product 4", category: "Category 4" },
    { id: "5", title: "Product 5", category: "Category 5" },
    { id: "6", title: "Product 6", category: "Category 6" },
    { id: "7", title: "Product 7", category: "Category 7" },
    { id: "8", title: "Product 8", category: "Category 8" },
    { id: "9", title: "Product 9", category: "Category 9" },
  ];

  if (filter) {
    const param = filter.split("||")[2];

    return NextResponse.json({
      data: products.filter((product) => product.title.includes(param)),
    });
  }

  return NextResponse.json({ data: products });
}

export async function POST() {
  const product = { id: "1", title: "Product 1", category: "Category 1" };

  return NextResponse.json(product);
}
