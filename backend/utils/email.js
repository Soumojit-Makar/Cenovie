const nodemailer = require('nodemailer');

const COMPANY_NAME = 'Cenovie';
const COMPANY_TAGLINE = 'Premium IT, Software & Digital Solutions';
const COMPANY_LOCATION = 'Kolkata, West Bengal, India';
const COMPANY_EMAIL = 'main@cenovie.site';
const COMPANY_PHONE = '+91 7477407178';
const COMPANY_WEBSITE = 'https://cenovie.site';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || COMPANY_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const getResumeUrl = (url) => {
  if (!url) return '#';

  if (url.includes('/upload/') && !url.includes('/fl_attachment/')) {
    return url.replace('/upload/', '/upload/fl_attachment/');
  }

  return url;
};

// ─── Send Enquiry Admin Notification ─────────────────────────────────────────
const sendEnquiryToAdmin = async (enquiry, aiInsights) => {
  const transporter = createTransporter();

  const priorityColor = {
    hot: '#ef4444',
    warm: '#f97316',
    cold: '#64748b',
  };

  const priority = aiInsights?.priority || 'warm';

  await transporter.sendMail({
    from: `"${COMPANY_NAME} Website" <${COMPANY_EMAIL}>`,
    to: process.env.ADMIN_EMAIL || COMPANY_EMAIL,
    subject: `🔔 New Enquiry: ${enquiry.subject} [${priority.toUpperCase()}]`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #020617, #0f172a, #1e3a8a); padding: 28px; border-radius: 14px 14px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${COMPANY_NAME}</h1>
          <p style="color: #93c5fd; margin: 8px 0 0; font-size: 14px;">${COMPANY_TAGLINE}</p>
        </div>

        <div style="background: #ffffff; padding: 28px; border-radius: 0 0 14px 14px; border: 1px solid #e2e8f0;">
          <span style="background: ${priorityColor[priority]}; color: #ffffff; padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 700;">
            ${priority.toUpperCase()} LEAD
          </span>

          <h2 style="color: #0f172a; margin: 22px 0 18px; font-size: 20px;">New Website Enquiry</h2>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px; color: #64748b; width: 150px;">Name</td>
              <td style="padding: 10px; font-weight: 600;">${enquiry.name}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; color: #64748b;">Email</td>
              <td style="padding: 10px;"><a href="mailto:${enquiry.email}" style="color: #2563eb;">${enquiry.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #64748b;">Phone</td>
              <td style="padding: 10px;">${enquiry.phone || '—'}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; color: #64748b;">Company</td>
              <td style="padding: 10px;">${enquiry.company || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #64748b;">Subject</td>
              <td style="padding: 10px; font-weight: 600;">${enquiry.subject}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; color: #64748b;">Service Interest</td>
              <td style="padding: 10px;">${enquiry.serviceInterest || '—'}</td>
            </tr>
          </table>

          <div style="margin-top: 22px; padding: 18px; background: #f1f5f9; border-radius: 10px;">
            <p style="margin: 0 0 8px; color: #475569; font-size: 13px; font-weight: 700;">MESSAGE</p>
            <p style="margin: 0; color: #1e293b; line-height: 1.6;">${enquiry.message}</p>
          </div>

          ${
            aiInsights
              ? `
              <div style="margin-top: 22px; padding: 18px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px;">
                <p style="margin: 0 0 12px; color: #1d4ed8; font-size: 13px; font-weight: 700;">🤖 AI LEAD INSIGHTS</p>
                <p style="margin: 0 0 6px; color: #374151;"><strong>Intent:</strong> ${aiInsights.intent || '—'}</p>
                <p style="margin: 0 0 6px; color: #374151;"><strong>Recommended Service:</strong> ${aiInsights.recommendedService || '—'}</p>
                <p style="margin: 0; color: #374151;"><strong>Summary:</strong> ${aiInsights.summary || '—'}</p>
              </div>
            `
              : ''
          }

          <p style="margin-top: 24px; color: #94a3b8; font-size: 12px;">
            This enquiry was generated from the ${COMPANY_NAME} website.
          </p>
        </div>
      </div>
    `,
  });
};

// ─── Send Enquiry Acknowledgement to Customer ────────────────────────────────
const sendEnquiryAcknowledgement = async (enquiry, suggestedReply) => {
  const transporter = createTransporter();

  const replyText =
    suggestedReply ||
    `Thank you for reaching out to ${COMPANY_NAME}. We have received your enquiry regarding "${enquiry.subject}". Our team will review your requirement and contact you within 1–2 business days.`;

  await transporter.sendMail({
    from: `"${COMPANY_NAME}" <${COMPANY_EMAIL}>`,
    to: enquiry.email,
    subject: `We've received your enquiry — ${COMPANY_NAME}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #020617, #0f172a, #1e40af); padding: 34px; border-radius: 14px 14px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">${COMPANY_NAME}</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0; font-size: 14px;">${COMPANY_TAGLINE}</p>
        </div>

        <div style="background: #ffffff; padding: 34px; border-radius: 0 0 14px 14px; border: 1px solid #e2e8f0;">
          <p style="color: #1e293b; font-size: 16px;">Dear <strong>${enquiry.name}</strong>,</p>

          <p style="color: #475569; line-height: 1.7; font-size: 15px;">${replyText}</p>

          <p style="color: #475569; line-height: 1.7; font-size: 15px;">
            Our team specializes in premium website development, custom software, cloud solutions, automation, AI tools, and scalable digital platforms for growing businesses.
          </p>

          <div style="margin: 26px 0; padding: 18px; background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px;">
            <p style="margin: 0; color: #1e3a8a; font-weight: 700;">${COMPANY_NAME}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_LOCATION}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_EMAIL} | ${COMPANY_PHONE}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_WEBSITE}</p>
          </div>

          <p style="color: #94a3b8; font-size: 13px; margin-bottom: 0;">
            This is an automated acknowledgement from ${COMPANY_NAME}. Our team will contact you shortly.
          </p>
        </div>
      </div>
    `,
  });
};

// ─── Send Job Application Notification to Admin ──────────────────────────────
const sendApplicationToAdmin = async (application, jobTitle) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${COMPANY_NAME} Careers" <${COMPANY_EMAIL}>`,
    to: process.env.ADMIN_EMAIL || COMPANY_EMAIL,
    subject: `📝 New Job Application: ${jobTitle} — ${application.name}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #020617, #0f172a, #1e3a8a); padding: 28px; border-radius: 14px 14px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${COMPANY_NAME} Careers</h1>
          <p style="color: #93c5fd; margin: 8px 0 0;">New candidate application received</p>
        </div>

        <div style="background: #ffffff; padding: 28px; border-radius: 0 0 14px 14px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin: 0 0 18px;">New Job Application</h2>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px; color: #64748b; width: 140px;">Position</td>
              <td style="padding: 10px; font-weight: 700;">${jobTitle}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; color: #64748b;">Applicant</td>
              <td style="padding: 10px; font-weight: 600;">${application.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #64748b;">Email</td>
              <td style="padding: 10px;"><a href="mailto:${application.email}" style="color: #2563eb;">${application.email}</a></td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; color: #64748b;">Phone</td>
              <td style="padding: 10px;">${application.phone || '—'}</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #64748b;">Resume</td>
              <td style="padding: 10px;">
                <a href="${getResumeUrl(application.resumeUrl)}" target="_blank" style="color: #2563eb; font-weight: 600;">Download Resume</a>
              </td>
            </tr>
          </table>

          ${
            application.coverLetter
              ? `
              <div style="margin-top: 22px; padding: 18px; background: #f1f5f9; border-radius: 10px;">
                <p style="margin: 0 0 8px; color: #475569; font-size: 13px; font-weight: 700;">COVER LETTER</p>
                <p style="margin: 0; color: #1e293b; line-height: 1.6;">${application.coverLetter}</p>
              </div>
            `
              : ''
          }
        </div>
      </div>
    `,
  });
};

// ─── Send Job Application Acknowledgement to Candidate ───────────────────────
const sendApplicationAcknowledgement = async (application, jobTitle) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${COMPANY_NAME} Careers" <${COMPANY_EMAIL}>`,
    to: application.email,
    subject: `Application received — ${jobTitle} at ${COMPANY_NAME}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #020617, #0f172a, #1e40af); padding: 34px; border-radius: 14px 14px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">${COMPANY_NAME}</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0;">Careers & Talent Team</p>
        </div>

        <div style="background: #ffffff; padding: 34px; border-radius: 0 0 14px 14px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin: 0 0 18px;">Application Received</h2>

          <p style="color: #1e293b; font-size: 16px;">Dear <strong>${application.name}</strong>,</p>

          <p style="color: #475569; line-height: 1.7;">
            Thank you for applying for the <strong>${jobTitle}</strong> position at <strong>${COMPANY_NAME}</strong>.
          </p>

          <p style="color: #475569; line-height: 1.7;">
            Our HR team will review your application carefully. If your profile matches the role requirements, we will contact you for the next step.
          </p>

          <p style="color: #475569; line-height: 1.7;">
            We appreciate your interest in joining ${COMPANY_NAME} and being part of our premium technology team.
          </p>

          <div style="margin: 26px 0; padding: 18px; background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px;">
            <p style="margin: 0; color: #1e3a8a; font-weight: 700;">${COMPANY_NAME}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_TAGLINE}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_LOCATION}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_EMAIL} | ${COMPANY_PHONE}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_WEBSITE}</p>
          </div>

          <p style="color: #475569; line-height: 1.7;">
            Warm regards,<br />
            <strong>${COMPANY_NAME} HR Team</strong>
          </p>
        </div>
      </div>
    `,
  });
};
const sendApplicationStatusUpdate = async (application, jobTitle, newStatus) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${COMPANY_NAME} Careers" <${COMPANY_EMAIL}>`,
    to: application.email,
    subject: `Application Update: ${jobTitle} — ${newStatus.toUpperCase()}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #020617, #0f172a, #1e40af); padding: 34px; border-radius: 14px 14px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">${COMPANY_NAME}</h1>
          <p style="color: #bfdbfe; margin: 10px 0 0;">Careers & Talent Team</p>
        </div>

        <div style="background: #ffffff; padding: 34px; border-radius: 0 0 14px 14px; border: 1px solid #e2e8f0;">
          <h2 style="color: #0f172a; margin: 0 0 18px;">Application Status Update</h2>

          <p style="color: #1e293b; font-size: 16px;">Dear <strong>${application.name}</strong>,</p>

          <p style="color: #475569; line-height: 1.7;">
            We wanted to update you on the status of your application for the <strong>${jobTitle}</strong> position at <strong>${COMPANY_NAME}</strong>.
          </p>

          <p style="color: #475569; line-height: 1.7;">
            Your application status has been updated to: <strong>${newStatus.toUpperCase()}</strong>.
          </p>

          <p style="color: #475569; line-height: 1.7;">
            If you have any questions or would like feedback, please feel free to reply to this email.
          </p>

          <div style="margin: 26px 0; padding: 18px; background: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px;">
            <p style="margin: 0; color: #1e3a8a; font-weight: 700;">${COMPANY_NAME}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_TAGLINE}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_LOCATION}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_EMAIL} | ${COMPANY_PHONE}</p>
            <p style="margin: 6px 0 0; color: #1d4ed8;">${COMPANY_WEBSITE}</p>
          </div>

          <p style="color: #475569; line-height: 1.7;">
            Warm regards,<br />
            <strong>${COMPANY_NAME} HR Team</strong>
          </p>
        </div>
      </div>
    `,
  });
};


module.exports = {
  sendEnquiryToAdmin,
  sendEnquiryAcknowledgement,
  sendApplicationToAdmin,
  sendApplicationAcknowledgement,
  sendApplicationStatusUpdate,
};