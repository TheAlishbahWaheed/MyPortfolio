// ============================================================
// EMAILJS CONFIG — fill these in with your own free EmailJS account
// (https://www.emailjs.com) and the contact form, the resume modal,
// and the resume-download owner alert will all send real email. Until
// you do, contact.js and resume.js automatically fall back to their
// original front-end-only demo behaviour, so nothing breaks in the
// meantime.
//
// Setup (~5 minutes):
// 1. Create a free account at emailjs.com.
// 2. Add an Email Service — pick Gmail — and connect your Gmail
//    account (alishbaw026@gmail.com). Copy its "Service ID" below.
// 3. Create a template for the contact form with variables
//    {{from_name}}, {{from_email}}, {{subject}}, {{message}} →
//    copy its "Template ID" into CONTACT_TEMPLATE_ID.
// 4. Create a second template for resume requests with a variable
//    {{visitor_email}}, and in that template's settings attach your
//    resume.pdf as a static attachment → copy its "Template ID" into
//    RESUME_TEMPLATE_ID. (This is what actually gets the PDF into the
//    visitor's inbox — EmailJS attaches whatever file you upload in
//    the template dashboard on every send.)
// 5. Create a THIRD template — this is the one that notifies YOU —
//    with a "To email" field hardcoded to alishbaw026@gmail.com (not
//    a variable, so it always comes to you no matter who downloads)
//    and a body using {{visitor_email}} and {{sent_at}}, e.g.:
//      Subject: New resume download — {{visitor_email}}
//      Body:    {{visitor_email}} just downloaded your resume from
//               the portfolio site, at {{sent_at}}.
//    Copy its "Template ID" into OWNER_NOTIFY_TEMPLATE_ID below.
// 6. Copy your account's "Public Key" from Account → API Keys below.
// ============================================================
window.EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',
  serviceId: 'YOUR_SERVICE_ID',
  contactTemplateId: 'YOUR_CONTACT_TEMPLATE_ID',
  resumeTemplateId: 'YOUR_RESUME_TEMPLATE_ID',
  ownerNotifyTemplateId: 'YOUR_OWNER_NOTIFY_TEMPLATE_ID',
};
