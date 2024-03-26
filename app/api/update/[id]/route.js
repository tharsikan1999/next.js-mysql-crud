import db from '../../../../libs/connection'; // Adjust import path as needed

import { NextResponse } from "next/server";

export async function PUT(request) {
   try {
      const id = request.nextUrl.pathname.split('/').pop(); 
      if (!id) {
         throw new Error('ID parameter is missing');
      }
      
      const { title, note } = await request.json();
      
      // Using parameterized query to prevent SQL injection
      const query = `UPDATE crud SET title = ?, note = ? WHERE id = ?`;
      const result = await db.query(query, [title, note, id]);
      
      // Check if the update was successful
      
         // Return a JSON response with a success message
         return NextResponse.json({ message: 'Data updated successfully' });
      
   } catch(error) {
      console.error(error);
      // Return an error response if there's an error
      throw new Error("Failed to update data in MySQL");
   }
}