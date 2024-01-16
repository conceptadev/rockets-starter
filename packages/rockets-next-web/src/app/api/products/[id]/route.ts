import { NextResponse } from "next/server";

export async function PATCH() {
  const product = { id: "1", title: "Product 1", category: "Category 1" };

  return NextResponse.json(product);
}

export async function PUT() {
  const product = { id: "1", title: "Product 1", category: "Category 1" };

  return NextResponse.json(product);
}

export async function DELETE() {
  return NextResponse.json({});
}
