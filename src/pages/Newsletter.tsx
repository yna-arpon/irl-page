import { SignupPage } from "../components/SignupPage";
import { AIRTABLE_WAITLIST_BASE_ID } from "../utils/airtable";

export function Newsletter() {
  return (
    <SignupPage
      // TODO: switch back to AIRTABLE_NEWSLETTER_BASE_ID once that base/table is sorted out
      baseId={AIRTABLE_WAITLIST_BASE_ID}
      blobPosition="bl"
      title="IRL: The Unplugged Update"
      subtitle="Join a community rethinking its relationship with phones. Stories, research, and updates from people building a more present life."
      buttonLabel="Subscribe"
      loadingLabel="Subscribing..."
      finePrint="Unsubscribe anytime."
      successTitle="You're subscribed."
      successSubtitle="Watch your inbox for our next issue."
    />
  );
}
