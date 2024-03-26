// pages/api/get.ts

import { NextResponse } from 'next/server';
import db from '../../../libs/connection'; // Adjust import path as needed
import { MysqlError } from 'mysql'; // Import MysqlError type

export async function GET() {
    try {
        const fetchDatas = new Promise((resolve, reject) => {
            db.query("SELECT * FROM crud", (err: MysqlError | null, result: any) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        });
        
        const data = await fetchDatas; // Wait for the promise to resolve
            
        return NextResponse.json(data); // Return the fetched data as JSON response
    }
    catch (error) {
        console.log(error);
        return NextResponse.error(); // Return error response if there's an error
    }   
}
