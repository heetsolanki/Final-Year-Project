import { LegalPageLayout, LegalSection } from "../components/layout/LegalPageLayout";
import { Lock, Database, Zap, Shield, Cookie, Users, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="Your privacy is important to us. This Privacy Policy explains how LawAssist collects, uses, and protects your personal information when you use our platform."
    >
      <LegalSection number="1" heading="Introduction" icon={Lock}>
        <p>
          LawAssist respects the privacy of all users who access the platform.
          We are committed to protecting personal data and ensuring transparency
          in how information is collected and used.
        </p>
      </LegalSection>

      <LegalSection number="2" heading="Information We Collect" icon={Database}>
        <p>We may collect the following types of information:</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li className="text-gray-700">Name and email address during account registration</li>
          <li className="text-gray-700">Login credentials required for authentication</li>
          <li className="text-gray-700">Queries submitted by users regarding consumer rights</li>
          <li className="text-gray-700">
            Basic usage data such as pages visited and interaction with the
            platform
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="3" heading="How We Use Information" icon={Zap}>
        <p>The information we collect may be used to:</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li className="text-gray-700">Provide legal information related to consumer rights</li>
          <li className="text-gray-700">
            Improve the functionality and performance of the platform
          </li>
          <li className="text-gray-700">Maintain the security of user accounts</li>
          <li className="text-gray-700">Respond to user queries and feedback</li>
        </ul>
      </LegalSection>

      <LegalSection number="4" heading="Data Security" icon={Shield}>
        <p>
          LawAssist implements appropriate technical and organizational measures
          to protect user data stored in the system. Access to personal
          information is restricted to authorized administrators.
        </p>
      </LegalSection>

      <LegalSection number="5" heading="Cookies" icon={Cookie}>
        <p>
          The platform may use cookies to improve user experience, manage
          authentication sessions, and analyze website performance.
        </p>
      </LegalSection>

      <LegalSection number="6" heading="User Rights" icon={Users}>
        <p>Users have the right to:</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li className="text-gray-700">Access the personal data associated with their account</li>
          <li className="text-gray-700">Request corrections to inaccurate information</li>
          <li className="text-gray-700">Request deletion of their personal data</li>
        </ul>
      </LegalSection>

      <LegalSection number="7" heading="Contact Information" icon={Mail}>
        <p>
          For questions regarding this Privacy Policy or your personal data,
          users may contact the platform administrator through the contact page.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
};

export default PrivacyPolicy;
