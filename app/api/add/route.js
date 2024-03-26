import db from '../../../libs/connection'; // Adjust import path as needed
import {  NextResponse } from "next/server";

export async function POST(request, response) {
  try {
    const data =await  request.json();
    // Using parameterized query to prevent SQL injection
    const insertData = new Promise((resolve, reject) => {
      db.query('INSERT INTO crud (title, note) VALUES (?, ?)', [data.title, data.note], (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });

    // Wait for the promise to resolve
    await insertData;

    // Return success response
    return NextResponse.json({ message: "Data added successfully" }, { status: 201 });
  } catch(error) {
    console.error(error);
    // Return error response if there's an error
    return NextResponse.error(new Error("Failed to add data to the database"), { status: 500 });
  }
}
