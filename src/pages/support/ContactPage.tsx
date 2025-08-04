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
