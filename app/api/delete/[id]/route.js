import { NextResponse } from "next/server";
import db from '../../../../libs/connection';

export async function DELETE(request, response) {
  try {
    const id = request.nextUrl.pathname.split('/').pop(); // Extract ID from the last segment of the pathname
    if (!id) {
      throw new Error('ID parameter is missing');
    }

    const query = `DELETE FROM crud WHERE id = ${id}`;
    const result = await db.query(query); // Wait for the query to complete

    
    // Return a JSON response with a success message and the affected rows
    return NextResponse.json({ message: 'Data deleted successfully' });
  } catch(error) {
    console.error(error);
    // Return an error response if there's an error
    throw new Error("Failed to delete data from MySQL");
  }
}
