import { LegalPageLayout, LegalSection } from "../components/layout/LegalPageLayout";
import { CheckCircle, Users, BadgeCheck, Lock, Copyright, AlertCircle, Trash2, RefreshCw } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      description="These Terms and Conditions govern the use of the LawAssist platform. By accessing or using the platform, you agree to comply with these terms."
    >
      <LegalSection heading="Acceptance of Terms" icon={CheckCircle}>
        <p>
          By using LawAssist, users agree to follow the rules and guidelines
          outlined in these Terms and Conditions.
        </p>
      </LegalSection>

      <LegalSection heading="User Responsibilities" icon={Users}>
        <p>Users must:</p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li className="text-gray-700">
            Provide accurate and truthful information when registering
          </li>
          <li className="text-gray-700">Use the platform only for lawful purposes</li>
          <li className="text-gray-700">Avoid misuse or unauthorized access to the system</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Expert Responsibilities" icon={BadgeCheck}>
        <p>
          Experts who register on the platform must provide accurate
          professional information during the verification process and maintain
          ethical communication when responding to user queries.
        </p>
      </LegalSection>

      <LegalSection heading="Account Security" icon={Lock}>
        <p>
          Users are responsible for maintaining the confidentiality of their
          login credentials and for all activities that occur under their
          account.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual Property" icon={Copyright}>
        <p>
          All content on the platform, including design, text, features, and
          functionality, is the property of LawAssist unless otherwise stated.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of Liability" icon={AlertCircle}>
        <p>
          LawAssist provides legal information related to consumer rights for
          educational purposes only. The platform is not responsible for
          decisions made based on information available on the website.
        </p>
      </LegalSection>

      <LegalSection heading="Account Termination" icon={Trash2}>
        <p>
          LawAssist reserves the right to suspend or terminate accounts that
          violate platform rules or engage in misuse of the system.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to Terms" icon={RefreshCw}>
        <p>
          LawAssist may update these Terms and Conditions periodically.
          Continued use of the platform indicates acceptance of any updates.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
};

export default TermsAndConditions;
