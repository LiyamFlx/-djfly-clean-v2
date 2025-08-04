import fs from 'fs';
import path from 'path';

// Define the pages to create with their respective paths and content
const pages = [
  // Main pages
  {
    path: 'src/pages/DocsPage.tsx',
    content: `import React from 'react';
import { createPage, ComingSoon } from '@/utils/pageUtils';

const DocsPage = createPage(
  'Documentation',
  <ComingSoon feature="Documentation" />
);

export default DocsPage;
`
  },
  
  // Legal pages
  {
    path: 'src/pages/legal/PrivacyPage.tsx',
    content: `import React from 'react';
import { createPage, ComingSoon } from '@/utils/pageUtils';

const PrivacyPage = createPage(
  'Privacy Policy',
  <ComingSoon feature="Privacy Policy" />
);

export default PrivacyPage;
`
  },
  {
    path: 'src/pages/legal/TermsPage.tsx',
    content: `import React from 'react';
import { createPage, ComingSoon } from '@/utils/pageUtils';

const TermsPage = createPage(
  'Terms of Service',
  <ComingSoon feature="Terms of Service" />
);

export default TermsPage;
`
  },
  
  // Support pages
  {
    path: 'src/pages/support/ContactPage.tsx',
    content: `import React from 'react';
import { createPage } from '@/utils/pageUtils';

const ContactPage = createPage(
  'Contact Us',
  <div className="space-y-6">
    <p className="text-gray-300">
      Have questions or feedback? We'd love to hear from you!
    </p>
    <div className="bg-gray-800/50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-4">Get in Touch</h3>
      <p className="text-gray-400 mb-4">
        Email us at{' '}
        <a 
          href="mailto:support@djfly.app" 
          className="text-electric-blue hover:underline"
        >
          support@djfly.app
        </a>
      </p>
      <p className="text-gray-400">
        We typically respond within 24-48 hours.
      </p>
    </div>
  </div>
);

export default ContactPage;
`
  },
  {
    path: 'src/pages/support/HelpPage.tsx',
    content: `import React from 'react';
import { createPage, ComingSoon } from '@/utils/pageUtils';

const HelpPage = createPage(
  'Help Center',
  <ComingSoon feature="Help Center" />
);

export default HelpPage;
`
  },
  
  // Auth pages
  {
    path: 'src/pages/auth/LoginPage.tsx',
    content: `import React from 'react';
import { createPage, ComingSoon } from '@/utils/pageUtils';

const LoginPage = createPage(
  'Login',
  <ComingSoon feature="Login" />,
  'max-w-md mx-auto mt-12'
);

export default LoginPage;
`
  },
  {
    path: 'src/pages/auth/SignupPage.tsx',
    content: `import React from 'react';
import { createPage, ComingSoon } from '@/utils/pageUtils';

const SignupPage = createPage(
  'Create Account',
  <ComingSoon feature="Sign Up" />,
  'max-w-md mx-auto mt-12'
);

export default SignupPage;
`
  },
  {
    path: 'src/pages/auth/ForgotPasswordPage.tsx',
    content: `import React from 'react';
import { createPage, ComingSoon } from '@/utils/pageUtils';

const ForgotPasswordPage = createPage(
  'Forgot Password',
  <ComingSoon feature="Password Recovery" />,
  'max-w-md mx-auto mt-12'
);

export default ForgotPasswordPage;
`
  },
  {
    path: 'src/pages/auth/ResetPasswordPage.tsx',
    content: `import React from 'react';
import { createPage, ComingSoon } from '@/utils/pageUtils';

const ResetPasswordPage = createPage(
  'Reset Password',
  <ComingSoon feature="Password Reset" />,
  'max-w-md mx-auto mt-12'
);

export default ResetPasswordPage;
`
  },
  
  // Error pages
  {
    path: 'src/pages/errors/NotFoundPage.tsx',
    content: `import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-club-gradient flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-electric-blue hover:bg-electric-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue/50 transition-colors duration-200"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
`
  }
];

// Create the files
pages.forEach(({ path: filePath, content }) => {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Write file if it doesn't exist
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Created: ${filePath}`);
  } else {
    console.log(`Skipped (exists): ${filePath}`);
  }
});

console.log('\nAll pages have been generated!');
