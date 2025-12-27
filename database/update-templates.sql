-- Update existing templates (1-4) with new preview images
-- Run this in phpMyAdmin

UPDATE resume_templates 
SET preview_image = '/templates/template-4.png',
    updated_at = NOW()
WHERE template_id = 'modern-professional';

UPDATE resume_templates 
SET preview_image = '/templates/template-5.png',
    updated_at = NOW()
WHERE template_id = 'creative-designer';

UPDATE resume_templates 
SET preview_image = '/templates/template-6.png',
    updated_at = NOW()
WHERE template_id = 'executive-classic';

UPDATE resume_templates 
SET preview_image = '/templates/template-7.png',
    updated_at = NOW()
WHERE template_id = 'minimalist-clean';
