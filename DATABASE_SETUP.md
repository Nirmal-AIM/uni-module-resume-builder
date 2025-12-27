# Database Setup Guide

## ✅ Database Integration Complete!

### 📦 What's Been Added:

1. **MySQL Connection** (`lib/mysql.ts`)
   - Database connection utility
   - Environment variable support
   - Ready for Vercel deployment

2. **API Routes:**
   - `/api/templates` - Fetch resume templates from database
   - `/api/profile` - Save and fetch user profile data

### 🔧 Environment Variables:

Create a `.env.local` file in the project root with:

```env
DB_HOST=srv1640.hstgr.io
DB_PORT=3306
DB_USER=u941670923_unisync
DB_PASSWORD=Unisync@123
DB_NAME=u941670923_unisync
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 📊 Database Schema:

Run this SQL on your database to create the required tables:

```sql
-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    template_id VARCHAR(50),
    full_name VARCHAR(255),
    job_title VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    location VARCHAR(255),
    website VARCHAR(255),
    country VARCHAR(255),
    street_address VARCHAR(255),
    summary TEXT,
    education JSON,
    experience JSON,
    projects JSON,
    skills JSON,
    languages JSON,
    courses_certificates JSON,
    completed_sections JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);

-- 2. Resume Templates Table
CREATE TABLE IF NOT EXISTS resume_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    preview_image VARCHAR(500),
    category VARCHAR(100),
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_template_id (template_id),
    INDEX idx_is_active (is_active)
);

-- 3. Insert Sample Templates
INSERT INTO resume_templates (template_id, name, description, category, is_premium, is_active, features) VALUES
('modern-professional', 'Modern Professional', 'Clean and modern design perfect for tech professionals', 'professional', FALSE, TRUE, 
 JSON_ARRAY('ATS Friendly', 'Clean Layout', 'Professional Design', 'Easy to Read')),
 
('creative-designer', 'Creative Designer', 'Eye-catching design for creative professionals', 'creative', TRUE, TRUE,
 JSON_ARRAY('Creative Layout', 'Color Accents', 'Portfolio Ready', 'Modern Typography')),
 
('executive-classic', 'Executive Classic', 'Traditional format for senior positions', 'executive', FALSE, TRUE,
 JSON_ARRAY('Classic Design', 'Executive Format', 'Professional', 'Time-tested')),
 
('minimalist-clean', 'Minimalist Clean', 'Simple and elegant minimalist design', 'minimalist', FALSE, TRUE,
 JSON_ARRAY('Minimalist', 'Clean Lines', 'Easy to Scan', 'Professional'));
```

### 🚀 How to Use:

#### 1. Fetch Templates:
```typescript
const response = await fetch('/api/templates');
const data = await response.json();
console.log(data.templates);
```

#### 2. Save User Profile:
```typescript
const response = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        userId: 'user123',
        templateId: 'modern-professional',
        fullName: 'John Doe',
        jobTitle: 'Software Engineer',
        email: 'john@example.com',
        // ... other fields
    })
});
```

#### 3. Fetch User Profile:
```typescript
const response = await fetch('/api/profile?userId=user123');
const data = await response.json();
console.log(data.profile);
```

### 📝 Vercel Deployment:

1. **Add Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### ✅ Features:

- ✅ Database connection with environment variables
- ✅ Template fetching from database
- ✅ User profile CRUD operations
- ✅ Automatic JSON parsing for complex fields
- ✅ Error handling and logging
- ✅ Ready for Vercel deployment
- ✅ No disruption to existing functionality

### 🔒 Security:

- Environment variables for sensitive data
- SQL injection protection (parameterized queries)
- Error messages don't expose sensitive information
- Connection pooling for performance

---

**Everything is set up and ready to use! The existing application will continue to work, and you now have full database integration.** 🎉
