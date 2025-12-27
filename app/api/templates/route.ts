import { NextRequest, NextResponse } from 'next/server';
import { createMySQLConnection } from '@/lib/mysql';

export async function GET(request: NextRequest) {
    let connection;

    try {
        connection = await createMySQLConnection();

        // Fetch all active templates from database
        const [rows] = await connection.execute(
            `SELECT 
                template_id,
                name,
                description,
                preview_image,
                category,
                is_premium,
                features
            FROM resume_templates 
            WHERE is_active = TRUE 
            ORDER BY created_at DESC`
        );

        const templates = rows as any[];

        // Parse JSON features field
        const parsedTemplates = templates.map(template => ({
            ...template,
            features: template.features ? JSON.parse(template.features) : []
        }));

        return NextResponse.json({
            success: true,
            templates: parsedTemplates
        });

    } catch (error) {
        console.error('Error fetching templates:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch templates',
                details: error instanceof Error ? error.message : String(error)
            },
            { status: 500 }
        );
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}
