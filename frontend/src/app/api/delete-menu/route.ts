import { revalidatePath } from "next/cache";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;
    console.log("request :", request);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/menu/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status !== 204) {
      throw new Error("Failed to Delete menu");
    }

    revalidatePath("/");
    return new Response(
      JSON.stringify({ message: "Item deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: 500,
    });
  }
}
