import { NextRequest, NextResponse } from 'next/server';
import { createMySQLConnection } from '@/lib/mysql';

export async function GET(request: NextRequest) {
    let connection;

    try {
        connection = await createMySQLConnection();

        // Test connection
        const [rows] = await connection.execute('SELECT 1 as test');

        // Check if tables exist
        const [tables] = await connection.execute(
            "SHOW TABLES LIKE 'user_profiles'"
        );

        const userProfilesExists = (tables as any[]).length > 0;

        const [templateTables] = await connection.execute(
            "SHOW TABLES LIKE 'resume_templates'"
        );

        const templatesExists = (templateTables as any[]).length > 0;

        return NextResponse.json({
            status: 'connected',
            message: 'Database connection successful',
            tables: {
                user_profiles: userProfilesExists,
                resume_templates: templatesExists
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Database test error:', error);
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
            error: String(error)
        }, { status: 500 });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}
