import { revalidatePath } from "next/cache";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...restBody } = body;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menu/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restBody),
    });

    if (!response.ok) {
      throw new Error("Failed to add menu");
    }

    const data = await response.json();
    revalidatePath("/");
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
