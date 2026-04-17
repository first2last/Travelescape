// ────────────────────────────────────────────────────────────────────
// EmailJS Configuration for TravelScape OTP Auth
// ────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS:
//  1. Go to https://www.emailjs.com/ and create a free account.
//  2. Click "Add New Service" → connect your Gmail / Outlook.
//     Copy the SERVICE_ID shown (e.g. "service_abc123").
//  3. Click "Email Templates" → "Create New Template".
//     Paste this body in the template:
//
//       Subject: TravelScape – Your OTP Code
//       To:      {{to_email}}
//       Body:
//         Hi {{to_name}},
//         Your TravelScape one-time login code is: {{otp}}
//         This code expires in 10 minutes.
//
//     Save the template. Copy the TEMPLATE_ID (e.g. "template_xyz789").
//  4. Go to "Account" → "Public Key". Copy it (e.g. "AbCdEfGhIjK123").
//  5. Replace the placeholder values below with your real credentials.
// ────────────────────────────────────────────────────────────────────

export const EMAILJS_SERVICE_ID  = 'service_w49ewjq';
export const EMAILJS_TEMPLATE_ID = 'template_wumcfjg';
export const EMAILJS_PUBLIC_KEY  = 'GkXJEptC87cGGuMCf';
