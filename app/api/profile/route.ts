import { NextRequest, NextResponse } from 'next/server';
import { createMySQLConnection } from '@/lib/mysql';

// GET - Fetch user profile
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    let connection;

    try {
        connection = await createMySQLConnection();

        const [rows] = await connection.execute(
            `SELECT * FROM user_profiles WHERE user_id = ? LIMIT 1`,
            [userId]
        );

        const profiles = rows as any[];

        if (profiles.length === 0) {
            return NextResponse.json({ exists: false, profile: null });
        }

        const profile = profiles[0];

        // Parse JSON fields and map to camelCase
        const parsedProfile = {
            basicInfo: {
                fullName: profile.full_name || '',
                jobTitle: profile.job_title || '',
                phone: profile.phone || '',
                email: profile.email || '',
                location: profile.location || '',
                website: profile.website || '',
                country: profile.country || '',
                streetAddress: profile.street_address || '',
                profileImage: profile.profile_image || '',
            },
            summary: profile.summary || '',
            education: profile.education ? JSON.parse(profile.education) : [],
            experience: profile.experience ? JSON.parse(profile.experience) : [],
            projects: profile.projects ? JSON.parse(profile.projects) : [],
            skills: profile.skills ? JSON.parse(profile.skills) : [],
            languages: profile.languages ? JSON.parse(profile.languages) : [],
            coursesCertificates: profile.courses_certificates ? JSON.parse(profile.courses_certificates) : [],
            completedSections: profile.completed_sections ? JSON.parse(profile.completed_sections) : {},
        };

        return NextResponse.json({ exists: true, profile: parsedProfile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile', details: String(error) },
            { status: 500 }
        );
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// POST - Create or Update user profile
export async function POST(request: NextRequest) {
    let connection;

    try {
        const body = await request.json();
        const { userId, templateId, ...profileData } = body;

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        connection = await createMySQLConnection();

        // Map camelCase to snake_case for database columns
        const dbData: any = {};

        // Direct field mappings
        if (profileData.fullName !== undefined) dbData.full_name = profileData.fullName;
        if (profileData.jobTitle !== undefined) dbData.job_title = profileData.jobTitle;
        if (profileData.phone !== undefined) dbData.phone = profileData.phone;
        if (profileData.email !== undefined) dbData.email = profileData.email;
        if (profileData.location !== undefined) dbData.location = profileData.location;
        if (profileData.website !== undefined) dbData.website = profileData.website;
        if (profileData.country !== undefined) dbData.country = profileData.country;
        if (profileData.streetAddress !== undefined) dbData.street_address = profileData.streetAddress;
        if (profileData.profileImage !== undefined) dbData.profile_image = profileData.profileImage;
        if (profileData.summary !== undefined) dbData.summary = profileData.summary;
        if (templateId !== undefined) dbData.template_id = templateId;

        // JSON fields
        if (profileData.education !== undefined) dbData.education = JSON.stringify(profileData.education);
        if (profileData.experience !== undefined) dbData.experience = JSON.stringify(profileData.experience);
        if (profileData.projects !== undefined) dbData.projects = JSON.stringify(profileData.projects);
        if (profileData.skills !== undefined) dbData.skills = JSON.stringify(profileData.skills);
        if (profileData.languages !== undefined) dbData.languages = JSON.stringify(profileData.languages);
        if (profileData.coursesCertificates !== undefined) dbData.courses_certificates = JSON.stringify(profileData.coursesCertificates);
        if (profileData.completedSections !== undefined) dbData.completed_sections = JSON.stringify(profileData.completedSections);

        // Check if profile exists
        const [existing] = await connection.execute(
            `SELECT id FROM user_profiles WHERE user_id = ? LIMIT 1`,
            [userId]
        );

        const existingProfiles = existing as any[];

        if (existingProfiles.length > 0) {
            // Update existing profile
            const updates: string[] = [];
            const values: any[] = [];

            Object.keys(dbData).forEach(key => {
                updates.push(`${key} = ?`);
                values.push(dbData[key]);
            });

            if (updates.length === 0) {
                return NextResponse.json({ success: true, action: 'no_changes' });
            }

            values.push(userId);

            await connection.execute(
                `UPDATE user_profiles SET ${updates.join(', ')}, updated_at = NOW() WHERE user_id = ?`,
                values
            );

            return NextResponse.json({ success: true, action: 'updated' });
        } else {
            // Create new profile
            const fields = ['user_id'];
            const placeholders = ['?'];
            const values: any[] = [userId];

            Object.keys(dbData).forEach(key => {
                // Skip 'id' field - it's auto-increment
                if (key !== 'id') {
                    fields.push(key);
                    placeholders.push('?');
                    values.push(dbData[key]);
                }
            });

            await connection.execute(
                `INSERT INTO user_profiles (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`,
                values
            );

            return NextResponse.json({ success: true, action: 'created' });
        }
    } catch (error) {
        console.error('❌ Error saving profile:', error);

        return NextResponse.json(
            {
                error: 'Failed to save profile',
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
