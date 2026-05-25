import { PRIVACY_POLICY_HTML } from "./privacyPolicy";

export function Privacy() {
  return (
    <main className="privacy-page">
      <div 
        className="privacy-content"
        dangerouslySetInnerHTML={{ __html: PRIVACY_POLICY_HTML }} 
      />
    </main>
  )
}