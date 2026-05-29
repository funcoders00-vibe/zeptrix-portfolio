

import smtplib
import logging



from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List

from config import settings
from models import ContactSubmission, SERVICE_LABELS

logger = logging.getLogger(__name__)

CURRENCY_SYMBOLS = {"INR": "₹", "USD": "$"}


def _fmt_budget(submission: ContactSubmission) -> str:
    sym = CURRENCY_SYMBOLS.get(submission.currency, submission.currency + " ")
    return f"{sym}{submission.budget:,.2f}"


def _build_html(submission: ContactSubmission) -> str:
    label = SERVICE_LABELS.get(submission.service, submission.service.value)
    budget_fmt = _fmt_budget(submission)
    created_fmt = submission.created_at.strftime("%d %b %Y, %I:%M %p UTC")

    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/>
<style>
  body{{font-family:'Segoe UI',sans-serif;background:#0d0d0d;margin:0;padding:0;}}
  .wrap{{max-width:620px;margin:30px auto;background:#111;border-radius:16px;
         overflow:hidden;border:1px solid #1e1e2e;}}
  .header{{background:linear-gradient(135deg,#6c63ff,#3d5af1);
           padding:32px 36px;color:#fff;}}
  .header h2{{margin:0;font-size:22px;font-weight:700;letter-spacing:.5px;}}
  .header p{{margin:6px 0 0;font-size:13px;opacity:.8;}}
  .body{{padding:30px 36px;}}
  .row{{display:flex;border-bottom:1px solid #1e1e2e;padding:12px 0;font-size:14px;}}
  .row:last-child{{border-bottom:none;}}
  .label{{width:180px;font-weight:600;color:#888;flex-shrink:0;}}
  .value{{color:#e0e0e0;word-break:break-word;}}
  .badge{{display:inline-block;background:rgba(108,99,255,.15);color:#6c63ff;
          border:1px solid rgba(108,99,255,.3);border-radius:20px;
          padding:3px 12px;font-size:12px;font-weight:600;}}
  .footer{{background:#0a0a0a;padding:18px 36px;font-size:12px;
           color:#555;text-align:center;border-top:1px solid #1e1e2e;}}
  a{{color:#6c63ff;}}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h2>⚡ New Lead — Zeptrix</h2>
    <p>Submitted on {created_fmt}</p>
  </div>
  <div class="body">
    <div class="row"><span class="label">Reference ID</span>
      <span class="value" style="font-family:monospace;font-size:12px">{submission.id}</span></div>
    <div class="row"><span class="label">Name</span>
      <span class="value">{submission.name}</span></div>
    <div class="row"><span class="label">Email</span>
      <span class="value"><a href="mailto:{submission.email}">{submission.email}</a></span></div>
    <div class="row"><span class="label">Phone</span>
      <span class="value">{submission.phone}</span></div>
    <div class="row"><span class="label">Service</span>
      <span class="value"><span class="badge">{label}</span></span></div>
    <div class="row"><span class="label">Budget</span>
      <span class="value">{budget_fmt}</span></div>
    <div class="row"><span class="label">Project Details</span>
      <span class="value">{submission.description}</span></div>
  </div>
  <div class="footer">
    Automated notification from Zeptrix contact form · Do not reply directly
  </div>
</div>
</body></html>"""


def _build_plain(submission: ContactSubmission) -> str:
    label = SERVICE_LABELS.get(submission.service, submission.service.value)
    return (
        f"New Lead — Zeptrix\n"
        f"{'='*40}\n"
        f"ID          : {submission.id}\n"
        f"Name        : {submission.name}\n"
        f"Email       : {submission.email}\n"
        f"Phone       : {submission.phone}\n"
        f"Service     : {label}\n"
        f"Budget      : {_fmt_budget(submission)}\n"
        f"Description : {submission.description}\n"
        f"Submitted   : {submission.created_at.strftime('%d %b %Y, %I:%M %p UTC')}\n"
    )


def send_notification_email(submission: ContactSubmission) -> None:
    # Create a SAFE COPY of recipients
    print("EMAIL SERVICE FILE LOADED")
    print(__file__)
    recipients: List[str] = list(settings.ORG_RECIPIENTS)
    
    # Debug prints
    print("SETTINGS RECIPIENTS:", settings.ORG_RECIPIENTS)
    print("LOCAL RECIPIENTS:", recipients)
    print("JOINED RECIPIENTS:", ", ".join(recipients))

    if not recipients:
        logger.warning("No ORG_RECIPIENTS configured — skipping notification.")
        return

    logger.info(
        "Preparing notification email for submission %s to %s recipient(s): %s",
        submission.id,
        len(recipients),
        ", ".join(recipients),
    )

    label = SERVICE_LABELS.get(submission.service, submission.service.value)

    msg = MIMEMultipart("alternative")

    # Subject
    msg["Subject"] = f"[Zeptrix Lead] {submission.name} — {label}"

    # Sender
    msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"

    # Receiver
    msg["To"] = ", ".join(recipients)

    # Reply-To (very important)
    msg["Reply-To"] = submission.email

    # Email body
    plain_body = _build_plain(submission)
    html_body = _build_html(submission)

    msg.attach(MIMEText(plain_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    # Debug email content
    print("EMAIL FROM:", settings.EMAIL_FROM)
    print("EMAIL TO:", recipients)
    print("EMAIL SUBJECT:", msg["Subject"])

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as srv:
            srv.ehlo()

            # Enable TLS
            srv.starttls()

            # Login
            srv.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

            # Send mail
            result = srv.sendmail(settings.EMAIL_FROM, recipients, msg.as_string())

            print("SMTP RESULT:", result)
            print("FINAL RECIPIENTS:", recipients)

        logger.info(
            "Notification sent for submission %s via %s:%s",
            submission.id,
            settings.SMTP_HOST,
            settings.SMTP_PORT,
        )

    except smtplib.SMTPException as exc:
        logger.error(
            "SMTP failure for %s: %s",
            submission.id,
            exc,
        )
        raise