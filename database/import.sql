-- Resume Builder Database Schema
-- Import this file in phpMyAdmin

-- 1. Create user_profiles table
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
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- 2. Create resume_templates table
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
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
);

-- 3. Insert default templates
INSERT INTO resume_templates (template_id, name, description, category, is_premium, is_active, features) VALUES
('modern-professional', 'Modern Professional', 'Clean and modern design perfect for tech professionals', 'professional', FALSE, TRUE, 
 JSON_ARRAY('ATS Friendly', 'Clean Layout', 'Professional Design', 'Easy to Read')),
 
('creative-designer', 'Creative Designer', 'Eye-catching design for creative professionals', 'creative', TRUE, TRUE,
 JSON_ARRAY('Creative Layout', 'Color Accents', 'Portfolio Ready', 'Modern Typography')),
 
('executive-classic', 'Executive Classic', 'Traditional format for senior positions', 'executive', FALSE, TRUE,
 JSON_ARRAY('Classic Design', 'Executive Format', 'Professional', 'Time-tested')),
 
('minimalist-clean', 'Minimalist Clean', 'Simple and elegant minimalist design', 'minimalist', FALSE, TRUE,
 JSON_ARRAY('Minimalist', 'Clean Lines', 'Easy to Scan', 'Professional'));
