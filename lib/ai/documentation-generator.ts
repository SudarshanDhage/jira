import { model } from './client';

/**
 * Generates comprehensive project documentation based on project data and sprint plan
 */
export async function generateDocumentation(projectData: any, sprintPlan: any) {
  try {
    console.log('Starting documentation generation with Gemini API');
    
    const prompt = `
    You are creating comprehensive, high-quality technical documentation for a software project. Your documentation must be extremely structured, detailed, and follow modern software industry standards.

    PROJECT DETAILS:
    ${JSON.stringify(projectData, null, 2)}
    
    TECH STACK:
    ${JSON.stringify(projectData.techStack || {}, null, 2)}
    
    ${sprintPlan ? `SPRINT PLAN (Reference only):
    ${JSON.stringify(sprintPlan, null, 2)}` : ''}
    
    # DOCUMENTATION REQUIREMENTS

    ## 1. Structure
    Create documentation with the following sections, ALWAYS in this exact order:
    - Project Overview (h1)
    - System Architecture (h2)
    - Folder Structure (h2)
    - Technical Stack (h2)
    - Data Model (h2)
    - Environment Setup (h2)
    - API Reference (h2)
    - Authentication & Security (h2)
    - Deployment Process (h2)
    - Development Workflow (h2)

    ## 2. Content Guidelines
    For each section:
    
    ### Project Overview
    - Project name and tagline (single sentence)
    - Brief description (3-4 sentences)
    - Key features as a bullet list
    - Project goals and target users
    - Current status (Alpha/Beta/Production)

    ### System Architecture
    - Create a detailed ASCII diagram of the system architecture
    - Label all components clearly
    - Show data flow between components
    - Explain each component's responsibility
    - Place the diagram inside <pre class="ascii-diagram">...</pre> tags

    ### Folder Structure
    - Show the main project directories and their purpose
    - Format as a tree structure inside <pre> tags
    - Explain key files in each directory

    ### Technical Stack
    - Frontend: framework, libraries, and versions
    - Backend: language, framework, and versions
    - Database: type, version, and schema overview
    - Third-party services and their purpose
    - DevOps tools and infrastructure

    ### Data Model
    - Database schema details or data structure
    - Entity relationship diagrams (using ASCII)
    - Key database tables/collections and their fields
    - Data validation rules

    ### Environment Setup
    - Prerequisites (exact versions of Node.js, etc.)
    - Installation steps with EXACT terminal commands
    - Configuration (.env file format with ALL variables)
    - Local development setup with commands
    - Docker setup if applicable

    ### API Reference
    - Endpoint documentation with routes
    - Request/response examples for each endpoint
    - Query parameters and their formats
    - Error responses and status codes
    - Rate limiting and pagination details

    ### Authentication & Security
    - Authentication methods
    - Authorization levels and permissions
    - Security practices implemented
    - Security considerations for developers

    ### Deployment Process
    - Environment setup for production
    - Deployment pipeline explanation
    - Infrastructure requirements
    - Rollback procedures
    - Monitoring and logging

    ### Development Workflow
    - Branching strategy
    - Code review process
    - Testing approach with examples
    - CI/CD pipeline details
    - Contributing guidelines

    ## 3. Formatting Requirements
    - Use HTML elements and proper semantic structure
    - Every major section must be in its own <section> tags with clear IDs
    - Each section must begin with an <h2> heading
    - Code samples must be in <pre><code class="language-xxx"> blocks with correct language
    - Tables must use proper <table>, <tr>, <th>, <td> structure
    - Terminal commands must use bash language highlighting
    - ASCII diagrams must be placed in <pre class="ascii-diagram"> tags
    - Link sections using anchor tags <a href="#section-id">

    ## 4. Style Guidelines
    - Write in a clear, concise, technical style
    - Use present tense and active voice
    - Be specific and concrete with all examples
    - Use proper technical terminology
    - Avoid marketing language, buzzwords, and fluff
    - Prioritize practical, usable information over theory
    - Write as an experienced developer communicating with peers

    ## 5. Output Formatting
    - Your output should be in HTML format
    - Create proper section IDs for navigation
    - Generate a table of contents at the top with anchor links
    - Each major section should have clear boundaries
    - Ensure architecture diagrams are properly formatted and self-contained
    - Do not include any <style> tags in your output
    
    IMPORTANT: Your documentation must be EXTREMELY DETAILED with real technical content - not generic placeholders. Include specific filename examples, actual commands, and detailed explanations that would genuinely help a developer understand the project.
    `;

    // Create a promise that rejects after a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Documentation generation timed out')), 180000); // 3 minutes timeout
    });

    // Race the API call against the timeout
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2, // Slightly higher for more natural writing style
          maxOutputTokens: 40000, // Increased token limit for more comprehensive output
        }
      }),
      timeoutPromise
    ]) as any;

    const response = await result.response;
    const text = response.text();
    
    console.log('Documentation generation completed successfully');
    
    // Process the response text - we want to keep Markdown formatting
    let docContent = text;
    
    // Check if the response is wrapped in markdown code blocks and extract
    const markdownBlockRegex = /```(?:markdown|md|html)?\s*([\s\S]*?)\s*```/;
    const markdownMatch = text.match(markdownBlockRegex);
    if (markdownMatch && markdownMatch[1]) {
      docContent = markdownMatch[1];
    }
    
    // Convert Markdown to HTML if needed
    const htmlContent = docContent.trim().startsWith('<') 
      ? docContent  // Already HTML
      : convertMarkdownToHTML(docContent, projectData.title);
    
    // Enhance the documentation with better formatting
    const enhancedContent = enhanceDocumentation(htmlContent, projectData.title);
    
    // Add a minimal style wrapper
    const finalHtml = `
      <div class="markdown-body documentation">
        ${enhancedContent}
      </div>
    `;
    
    // Generate a unique ID
    const documentationId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      id: documentationId,
      html: finalHtml,
      title: projectData.title || 'Project Documentation',
      projectId: projectData.id || null,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating documentation:", error);
    
    // Return a basic fallback documentation if generation fails
    return {
      id: `doc_${Date.now()}_fallback`,
      html: `
        <div class="markdown-body documentation">
          <h1>${projectData.title || 'Project Documentation'}</h1>
          <p>Documentation generation encountered an error. Please try again later.</p>
          <h2>Project Overview</h2>
          <p>${projectData.description || 'No description available.'}</p>
        </div>
      `,
      title: projectData.title || 'Project Documentation',
      projectId: projectData.id || null,
      generatedAt: new Date().toISOString()
    };
  }
}

/**
 * Enhances the documentation HTML with better formatting and structure
 */
function enhanceDocumentation(html: string, projectTitle: string): string {
  let enhancedHtml = html;
  
  // 1. Add language classes to code blocks for syntax highlighting
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```bash/g, '<pre><code class="language-bash">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)\$ /g, '<pre><code class="language-bash">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```javascript/g, '<pre><code class="language-javascript">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```typescript/g, '<pre><code class="language-typescript">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```json/g, '<pre><code class="language-json">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```html/g, '<pre><code class="language-html">$1');
  enhancedHtml = enhancedHtml.replace(/<pre><code>([^<]*?)```css/g, '<pre><code class="language-css">$1');
  
  // 2. Add classes to tables for styling
  enhancedHtml = enhancedHtml.replace(/<table>/g, '<table class="data-table">');
  
  // 3. Check if we have headings, if not, ensure we at least have the project title
  if (!/<h[1-6]/.test(enhancedHtml)) {
    enhancedHtml = `<h1>${projectTitle || 'Project Documentation'}</h1>${enhancedHtml}`;
  }
  
  // 4. Add IDs to headings for navigation
  enhancedHtml = enhancedHtml.replace(/<h([1-6])>(.*?)<\/h\1>/g, (match, level, text) => {
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} id="${id}">${text}</h${level}>`;
  });

  // 5. Remove any hyperlinks but keep their text
  enhancedHtml = enhancedHtml.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])[^"']*\1[^>]*>(.*?)<\/a>/g, '$2');
  
  // 6. Ensure each section has a proper ID and wrap existing headings in section tags if not already
  const headingMatches = enhancedHtml.matchAll(/<h([2-6])\s+id="([^"]+)">(.*?)<\/h\1>/g);
  const sections = Array.from(headingMatches);
  
  if (sections.length > 0) {
    // Process each h2-h6 section
    for (let i = 0; i < sections.length; i++) {
      const currentHeadingMatch = sections[i];
      const nextHeadingMatch = sections[i + 1];
      
      // Get the indices of the current and next heading
      const currentIndex = currentHeadingMatch.index || 0;
      
      // Compute the end index for the current section
      let endIndex = enhancedHtml.length;
      if (nextHeadingMatch && nextHeadingMatch.index !== undefined) {
        endIndex = nextHeadingMatch.index;
      }
      
      // Extract the heading level and id
      const level = currentHeadingMatch[1]; // The heading level (2-6)
      const id = currentHeadingMatch[2];    // The heading ID
      
      // If the heading is not already in a section with this ID
      const sectionStartTag = `<section id="${id}">`;
      const sectionEndTag = '</section>';
      
      // Check if it's already in a section
      const beforeHeading = enhancedHtml.substring(0, currentIndex);
      const isInSection = beforeHeading.lastIndexOf('<section') > beforeHeading.lastIndexOf('</section>');
      
      if (!isInSection) {
        // Extract the section content
        const sectionContent = enhancedHtml.substring(currentIndex, endIndex);
        
        // Replace the content with the wrapped version
        enhancedHtml = 
          enhancedHtml.substring(0, currentIndex) + 
          sectionStartTag + 
          sectionContent + 
          sectionEndTag + 
          enhancedHtml.substring(endIndex);
        
        // Adjust the indices of subsequent headings to account for the added tags
        const adjustment = sectionStartTag.length + sectionEndTag.length;
        for (let j = i + 1; j < sections.length; j++) {
          if (sections[j].index !== undefined) {
            sections[j].index! += adjustment;
          }
        }
      }
    }
  }
  
  return enhancedHtml;
}

/**
 * Helper function to convert Markdown to HTML
 */
function convertMarkdownToHTML(markdown: string, projectTitle: string): string {
  // Simple markdown to HTML conversion
  let html = markdown;
  
  // Make sure we have a title
  if (!html.startsWith('# ')) {
    html = `# ${projectTitle || 'Project Documentation'}\n\n${html}`;
  }
  
  // Process headings
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Process code blocks with language specification
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gm, (match, language, code) => {
    const languageClass = language ? `language-${language}` : '';
    return `<pre><code class="${languageClass}">${escapeHtml(code.trim())}</code></pre>`;
  });
  
  // Process inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Process lists
  // Unordered lists
  html = html.replace(/^[ \t]*[-*+][ \t]+(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\n)+/g, '<ul>$&</ul>');
  
  // Ordered lists
  html = html.replace(/^[ \t]*\d+\.[ \t]+(.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*?<\/li>\n)+/g, (match) => {
    // Only wrap in <ol> if not already wrapped in <ul>
    if (!match.startsWith('<ul>')) {
      return '<ol>' + match + '</ol>';
    }
    return match;
  });
  
  // Remove links but keep the text
  html = html.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Process emphasis
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Process horizontal rules
  html = html.replace(/^---$/gm, '<hr/>');
  
  // Process tables (basic support)
  const tableRegex = /^\|(.+)\|\r?\n\|(?:[-:]+\|)+\r?\n((?:\|.+\|\r?\n)+)/gm;
  html = html.replace(tableRegex, (match) => {
    const lines = match.split('\n');
    const headers = lines[0].split('|').filter(cell => cell.trim().length > 0).map(cell => `<th>${cell.trim()}</th>`).join('');
    
    let tableRows = '';
    for (let i = 2; i < lines.length; i++) {
      if (lines[i].trim().length > 0) {
        const cells = lines[i].split('|').filter(cell => cell.trim().length > 0).map(cell => `<td>${cell.trim()}</td>`).join('');
        tableRows += `<tr>${cells}</tr>`;
      }
    }
    
    return `<table class="data-table">
      <thead><tr>${headers}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>`;
  });
  
  // Process paragraphs
  // First, remove empty lines at the start of the content
  html = html.replace(/^\s*\n/, '');
  
  // Then process paragraphs, being careful not to wrap existing HTML elements
  const paragraphSplit = html.split(/\n\s*\n/);
  html = paragraphSplit.map(block => {
    // Skip if the block is, or begins with, an HTML tag
    if (/^\s*<\/?[a-z][\s\S]*>/i.test(block)) {
      return block;
    }
    // Skip if this is a heading or list
    if (/^<(h[1-6]|ul|ol|li|table|pre)[\s>]/i.test(block)) {
      return block;
    }
    return `<p>${block}</p>`;
  }).join('\n\n');
  
  // Process ASCII diagrams if they exist
  html = html.replace(/<pre><code>([\s\S]*?(?:\+---|--+\+|---+\>|<---+|\|[\s\S]*?\|)[\s\S]*?)<\/code><\/pre>/g, 
    '<pre class="ascii-diagram">$1</pre>');
  
  return html;
}

/**
 * Helper function to escape HTML entities in code blocks
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
} 