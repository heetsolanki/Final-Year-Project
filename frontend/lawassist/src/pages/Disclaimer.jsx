import { LegalPageLayout, LegalSection } from "../components/layout/LegalPageLayout";
import { AlertTriangle, CheckCircle, Link2, Scale } from "lucide-react";

const Disclaimer = () => {
  return (
    <LegalPageLayout
      title="Disclaimer"
      description="The information provided on LawAssist is intended for general informational purposes related to consumer rights."
    >
      <LegalSection heading="No Legal Advice" icon={AlertTriangle}>
        <p>
          LawAssist provides legal information but does not provide professional
          legal advice. Users should consult a qualified legal professional
          before making legal decisions.
        </p>
      </LegalSection>

      <LegalSection heading="Accuracy of Information" icon={CheckCircle}>
        <p>
          While efforts are made to keep the information accurate and updated,
          the platform does not guarantee the completeness or accuracy of all
          legal information.
        </p>
      </LegalSection>

      <LegalSection heading="External Links" icon={Link2}>
        <p>
          LawAssist may include links to external websites for additional
          resources. These websites are not controlled by the platform.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of Liability" icon={Scale}>
        <p>
          LawAssist is not responsible for any loss or damages resulting from
          the use of information available on the platform.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
};

export default Disclaimer;
