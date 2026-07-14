# Live → Local Content Map

Every useful live-site item mapped to its destination in the new local build.

## Navigation
| Live Item | Local Destination | Action |
|-----------|-------------------|--------|
| Navbar (Home, Services, About, Contact) | New `Navbar` component | BUILD — add to layout |
| Mobile hamburger menu | New `Navbar` component | BUILD — responsive |
| Logo | Navbar + footer | BUILD — use crest.png |

## Homepage Content
| Live Item | Local Destination | Action |
|-----------|-------------------|--------|
| Hero heading/CTA | Hero text beats | DONE — rewritten for elevator |
| Stats (500+, 98%, 4 cities, 24/7) | Homepage stats bar or remove | FLAG claims, keep cities/24-7 |
| Industry tags | `Industries.tsx` | DONE — identical list |
| Process (4 steps) | `Process.tsx` | DONE — rewritten (Discovery→AI Audit→Build→Scale) |
| Services overview | New `/services` page | BUILD |
| About summary + 10yr experience | `About.tsx` + new `/about` page | BUILD — flag "10+ years" claim |
| AI-Powered Tools | Services page | BUILD |
| Testimonial (Vance C.) | `Proof.tsx` or new Testimonials section | BUILD — add to homepage |
| Executive Consulting ($25K+) | New section on homepage or Services | BUILD — flag claims |
| Solutions grid | Services page | FOLD into services content |
| Final CTA | `Cta.tsx` | DONE |
| Footer (links, locations, social) | New footer component | BUILD |

## Services Page
| Live Item | Local Destination | Action |
|-----------|-------------------|--------|
| AI Email Assistant | `/services` | BUILD |
| AI Avatar Video Ads | `/services` | BUILD |
| AI-Powered Websites | `/services` | BUILD |
| Social Media Management | `/services` | BUILD |
| Pricing (3 tiers) | `/services` | BUILD — flag for owner review |
| Website packages (3 tiers) | `/services` | BUILD — flag for owner review |
| FAQ (6 items) | `/services` | BUILD |

## About Page
| Live Item | Local Destination | Action |
|-----------|-------------------|--------|
| Mission statement | `/about` or About section | BUILD |
| Company story | `/about` | BUILD |
| Core values (3) | `/about` | BUILD |
| Locations (4 cities) | `/about` + footer | BUILD |

## Contact Page
| Live Item | Local Destination | Action |
|-----------|-------------------|--------|
| Contact form | `/contact` | BUILD — Formspree or similar |
| Phone: (425) 316-7268 | `/contact` + footer | BUILD |
| Address: 11335 NE 122nd Way | `/contact` | BUILD |
| "Book a Time Slot" | `/contact` | BUILD — CTA button |
| Social links | Footer | BUILD — need real URLs |

## New Sections (not on live site)
| Section | Destination | Action |
|---------|-------------|--------|
| AI Tools / Demos | `/work` or homepage | PREPARE — placeholder structure |
| AI Career Defense | Homepage section or `/career-defense` | PREPARE — placeholder |
| Work / Portfolio | `/work` | PREPARE — demo entries |
