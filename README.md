# Portfolio

AI automation & custom software portfolio — Next.js 14 · React Three Fiber (3D) · Framer Motion · Tailwind CSS · EmailJS.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

Production build: `npm run build` then `npm start`.

Requires Node.js 18.18 or newer.

## What's inside

- 3D hero (React Three Fiber core + orbit rings + particles), 3D tool carousel, 3D tilt cards, 3D cube, 3D testimonial coverflow
- Interactive automation pipeline (auto-runs, click any step), live terminal, ROI calculator, chatbot assistant
- 6 demo projects with videos (hover preview, full player modal with next/previous), filters and detail modals
- Consultation booking + contact form — both delivered to **haseebafzl99999@gmail.com** through EmailJS

All project videos live in `public/videos`, thumbnails in `public/projects`, logos in `public/logos`.

## EmailJS setup (5 minutes, free plan)

The forms work **before** setup too (they open the visitor's mail app addressed to the email above). To send silently from the site, connect EmailJS:

1. Create a free account at https://www.emailjs.com
2. **Email Services → Add New Service → Gmail** → connect the Gmail account. Copy the **Service ID**.
3. **Email Templates → Create New Template**, then set:
   - **To Email:** `{{to_email}}`  (or type `haseebafzl99999@gmail.com` directly)
   - **Reply To:** `{{reply_to}}`
   - **Subject:** `{{subject}}`
   - **Content:**

     ```
     New {{form_type}} from the Portfolio website

     Name: {{from_name}}
     Email: {{from_email}}
     Phone: {{phone}}
     Company: {{company}}
     Service: {{service}}
     Preferred date: {{preferred_date}}
     Preferred time: {{preferred_time}}

     Message:
     {{message}}

     Sent: {{sent_at}}
     Page: {{page_url}}
     ```

   Save and copy the **Template ID**.
4. **Account → General** → copy your **Public Key**.
5. Paste the three values into `.env.local`:

   ```
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
   ```

6. Restart `npm run dev`. Submit a form — the email arrives in the inbox above.

Optional: create a second template for consultations and set `NEXT_PUBLIC_EMAILJS_CONSULTATION_TEMPLATE_ID`. If left empty, the same template is used for both forms (the `{{form_type}}` line tells them apart).

The destination address is the `CONTACT_EMAIL` constant in `src/lib/emailjs.ts`.

## Where to edit content

| What | File |
| --- | --- |
| Services, tools, process, testimonials, "why us" | `src/lib/content.ts` |
| Projects (text, videos, images) | `src/lib/projects.ts` |
| Site name / SEO text | `src/lib/site.ts` |
| Colours | `tailwind.config.ts` |

The testimonials are sample text carried over from the original project — replace them with real client reviews before going live.

## Project structure

```
src/
  app/            layout, page, globals.css, manifest, robots, sitemap
  components/
    three/        HeroScene, ShapesScene (React Three Fiber)
    forms/        ContactForm, ConsultationForm (EmailJS)
    ui/           Tilt, SectionHeading, Logo
    ...           Hero, Services, Tools, AutomationWorkflow, Projects, ...
  lib/            content, projects, emailjs, hooks, site
public/           logos, projects, videos, icons, og-image
```
