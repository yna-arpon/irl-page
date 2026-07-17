import { SignupPage } from "../components/SignupPage";
import { AIRTABLE_WAITLIST_BASE_ID } from "../utils/airtable";

export function Waitlist() {
  return (
    <SignupPage
      baseId={AIRTABLE_WAITLIST_BASE_ID}
      source="Waitlist"
      blobPosition="tr"
      title="Be first to try irl."
      subtitle="We'll let you know the moment beta opens — nothing else."
      buttonLabel="Join waitlist"
      loadingLabel="Saving..."
      finePrint="30+ people already on the list. No spam, ever."
      successTitle="You're in."
      successSubtitle="We'll reach out when the beta opens."
    />
  );
}
