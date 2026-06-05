# MandirSetu (मंदिरसेतु) - Project Proposal & Specification Document
**The Ultimate Indian Temple Booking, E-Commerce & Spiritual Tourism Ecosystem**

---

## 1. Executive Summary

### 1.1 Vision & Mission
India hosts millions of temples, attracting billions of devotees and tourists annually. However, the pilgrimage ecosystem remains highly unorganized, fragmented, and prone to local exploitation. Devotees face major challenges with booking authentic priests (Pujaris), finding hygienic accommodations (Dharamshalas/Hotels), securing reliable transport, and purchasing authentic Temple Prasad.

**MandirSetu** is a unified digital bridge designed to connect devotees worldwide with authentic Indian temples and local pilgrimage ecosystems. By employing dedicated **Temple Agents** at each major temple, the platform ensures verified listing of local services, authentic Prasad e-commerce delivery, secure booking systems, and AI-driven personalized itineraries, bringing trust, convenience, and technology to spiritual travel.

### 1.2 Core Business Value
* **Authenticity:** Agent-verified vendors, ID-verified Pujaris, and direct-from-temple Prasad.
* **Local Empowerment:** Digitizing local micro-entrepreneurs, taxi drivers, ashrams, and small vendors.
* **End-to-End Convenience:** A devotee can plan their entire yatra—from home departure to return, including rituals and shopping—on a single dashboard.

---

## 2. Platform Architecture & User Roles

The platform runs on a robust, multi-tenant hierarchy to ensure seamless operations and quality control.

```
                  ┌──────────────────────────────┐
                  │      1. SUPER ADMIN          │
                  │  (Platform Owner Control)    │
                  └──────────────┬───────────────┘
                                 │ Approves & Appoints
                  ┌──────────────▼───────────────┐
                  │      2. TEMPLE AGENT         │
                  │   (One per Temple Cluster)   │
                  └──────────────┬───────────────┘
                                 │ Manages & Verifies
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  3A. PUJARIS     │   │ 3B. ACCOMMODATION│   │ 3C. LOCAL SHOPS  │
│ (Rituals & Puja) │   │ (Hotels/Ashrams) │   │ (Prasad & Items) │
└──────────────────┘   └──────────────────┘   └──────────────────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 ▼ Services Delivered To
                  ┌──────────────────────────────┐
                  │      4. END DEVOTEE          │
                  │   (Customer/Tourist Portal)  │
                  └──────────────────────────────┘
```

### 2.1 User Roles & Responsibilities

#### A. Super Admin (Platform Owner)
* **Temple Directory Management:** Add, edit, or remove temples from the directory.
* **Agent Hiring & Management:** Onboard regional agents, define their jurisdictions, track performance, and process payouts.
* **Financial Controller:** Set commission percentages for e-commerce and bookings, view real-time revenue, and manage vendor settlements.
* **Security & Audits:** Monitor ratings, reviews, customer complaints, and vendor authenticity logs.

#### B. Temple Agents (On-Ground Managers)
* **Service Onboarding:** Scout, verify, and register local Pujaris, Dharamshalas, Hotels, Homestays, Taxi operators, and souvenir vendors.
* **E-Commerce Operations:** Procurement of genuine temple Prasad, packing, generating shipping labels, and hand-off to courier services.
* **Inventory & Booking Supervision:** Ensure Pujari availability calendars, room availability, and taxi schedules are updated.
* **On-Ground Support:** Handle devotee issues locally and verify service quality.

#### C. Service Providers (Pujaris, Hotels, Taxis, Shopkeepers)
* **Provider Dashboard:** View active bookings, service timings, and order requests.
* **Earnings Report:** Track daily/weekly/monthly revenue and payout status.
* **Service Customization:** Customize Puja types, room details, cab variants, and item stock.

#### D. End Devotee (App/Web Users)
* **Search & Explore:** Detailed temple directory, history, rules, live crowd status, and yatra guidance.
* **Unified Booking Engine:** Book Pujaris for custom rituals, book hotels/ashrams, and hire local taxis.
* **Spiritual E-Commerce storefront:** Buy Prasad, puja samagri, rudraksha, and local spiritual products.
* **My Yatra Dashboard:** Complete itinerary timeline, booking tickets, live courier tracking, and customer support.

---

## 3. Comprehensive Feature List

### 3.1 Core Modules

#### A. Temple Directory & Information Portal
* **Rich Profiles:** Multi-media galleries, historical background, best times to visit, dress code, VIP darshan rules, and map navigation.
* **Interactive Map:** Route visualizers showing nearby parking spots, footwear counters, and restrooms.

#### B. Verified Pujari (Priest) Booking
* **Sankalp Form:** Devotees enter Gotra, Family Member Names, and Puja Purpose.
* **Custom Puja Packages:** Options for physical attendance or **Virtual Puja** (Live Streaming / Video Recording).
* **Calendar Sync:** Real-time slot selection to avoid overbooking.

#### C. Hospitality & Ashram Booking
* **Ashrams & Dharamshalas:** Focus on affordable, clean boarding options that are rarely listed on standard OTAs (like MakeMyTrip/Goibibo).
* **Premium Hotels:** Tie-ups with local hotels for tourist convenience.
* **Amenities Filter:** Wheelchair accessibility, senior-citizen friendly rooms, pure vegetarian dining, and proximity to temple gates.

#### D. Local Cab & Guide Booking
* **Verified Drivers:** Local drivers familiar with routes, offering standard non-manipulated pricing.
* **Local Tour Guides:** Certified guides to explain temple histories and mythology.

#### E. E-Commerce (Direct Prasad & Temple Souvenirs)
* **Genuine Prasad Delivery:** Devotees can order holy Prasad from famous temples, which is packaged fresh by the Temple Agent and shipped within 24 hours.
* **Puja Kits (Samagri):** Customized pre-packaged kits for different festivals (e.g., Maha Shivratri Kit, Diwali Puja Kit).
* **Local Handicrafts:** Spiritual books, idols, rudrakshas, and regional temple souvenirs.

---

### 3.2 Premium & Innovative Features (The Competitive Edge)

To make **MandirSetu** a state-of-the-art, premium application that stands out globally, we will integrate the following cutting-edge modules:

#### 1. AI-Driven Pilgrimage Planner ("AI Yatra Planner")
* **How it works:** The user enters their starting location, destination temple(s), budget, trip duration, and special needs (e.g., traveling with infants or elderly parents).
* **AI Output:** Generates a customized yatra schedule combining transportation (taxis), verified stays (hotels/ashrams), and timed Pujari bookings. It auto-calculates total costs and allows booking the entire bundle in a single transaction.

#### 2. Virtual Puja & Live Stream Darshan
* **Live Sankalp:** For devotees unable to travel (elderly, NRIs), the Pujari performs the Puja live via interactive video streaming (using WebRTC/Agora). The devotee joins virtually to recite the prayers.
* **Prasad Courier:** Post virtual puja, the physical Prasad is couriered to the devotee's address.

#### 3. Real-Time Crowd & Queue Analytics
* **Queue Waiting Time:** Using input from Temple Agents and crowd-sourced user data, the app displays estimated wait times for general and VIP queues.
* **Best Time to Visit:** Smart graph predictions suggesting peak and off-peak hours.

#### 4. Prasad Subscription Box (MandirBox)
* **Monthly/Festive Subscription:** Devotees subscribe to receive holy Prasad from a different prominent temple every month (e.g., Vaishno Devi in January, Tirupati Balaji in February, Kedarnath in Shivratri month).

#### 5. Digital Locker & Emergency SOS
* **Yatra Documents Locker:** Cloud storage within the app for ID cards, medical certificates, and booking vouchers.
* **SOS Button:** In case of emergency (medical issue, lost traveler), a one-click button sends GPS coordinates to the local Temple Agent, taxi driver, and emergency contacts.

#### 6. Multilingual & Audio Guide System
* **Voice Guide:** Built-in audio guides in Hindi, Sanskrit, English, Tamil, Telugu, and other regional languages explaining temple architecture and legends.

---

## 4. Technical Stack & Deployment Strategy

A modern, highly performant stack will be used to ensure scalability, security, and low latency.

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | **React.js (SPA)** | Fast, interactive, single-page application for seamless dashboards and smooth consumer transitions. |
| **Styling** | **Tailwind CSS** | Premium utility-first styling for quick, customized, clean, and fully responsive layouts. |
| **State Management** | **Redux Toolkit / Context API** | To manage cart state, booking configurations, and user authentication across the app. |
| **Backend Server** | **Node.js with Express.js** | Event-driven, asynchronous environment capable of handling high volumes of concurrent booking requests. |
| **Database** | **MongoDB (Mongoose ODM)** | Flexible JSON-like document model, ideal for dynamic temple profiles, varying hotel room configurations, and complex order objects. |
| **Authentication** | **JWT (JSON Web Tokens)** | Secure, stateless authentication for logins, with role-based routing (Admin, Agent, Vendor, User). |
| **Cloud Hosting** | **Vercel** | Optimized hosting for React.js frontend ensuring edge delivery and lightning-fast loading speeds. |
| **Cloud Infrastructure** | **AWS (Amazon Web Services)** | Reliable backend infrastructure: <br>- **AWS EC2 / Elastic Beanstalk:** Hosting Node.js backend. <br>- **AWS S3:** Storing high-res temple images, videos, and virtual puja recordings. <br>- **AWS CloudFront:** CDN to deliver static assets globally with low latency. |
| **Payment Gateway** | **Razorpay API / Paytm SDK** | To process UPI payments, credit/debit cards, net banking, and automatic split-payouts to vendors. |
| **Live Streaming** | **Agora.io / AWS IVS** | Ultra-low latency video streaming protocol for Live Darshan and Virtual Puja interactions. |
| **Logistics Integration** | **Shiprocket API** | Multi-courier aggregator to fetch shipping costs, print labels, and track couriers in real-time. |
| **Notifications** | **Firebase Cloud Messaging / Twilio** | Push notifications, WhatsApp updates, and SMS alerts for booking confirmations and dispatch details. |

---

## 5. Monetization & Revenue Model

How the platform generates sustainable and high-margin revenue:

1. **Service Booking Commissions (10% - 15%):**
   * Charging a standard platform fee on bookings made for Hotels, Dharamshalas, Pujaris, and Taxis.
2. **E-Commerce Markup:**
   * Buying local Prasad and handicrafts wholesale through agents, and selling with packaging and curation margins.
3. **AI Yatra Planner Service Fee:**
   * Offering the automated AI planner for a nominal premium fee (e.g., ₹99 per customized itinerary) or keeping it free for premium VIP package purchasers.
4. **Virtual Puja Premium Ticketing:**
   * Hosting and managing live digital pujas, keeping a platform facilitation fee.
5. **Advertisements & Sponsorships:**
   * Allowing verified local hotels, restaurants, and shops to place banners on specific temple pages (highly targeted local ads).

---

## 6. Project Roadmap & Phases

```
┌────────────────────────────────────────────────────────┐
│  PHASE 1: Project Initialization & DB Design           │
│  - System Design & API Endpoints mapping.              │
│  - MongoDB Database Modeling (Users, Temples, Agents).  │
│  - Setup Express Server, JWT Authentication, Mailers.   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  PHASE 2: Agent & Admin Panel Development              │
│  - Super Admin Dashboard (Stats, Agent Onboarding).    │
│  - Agent Dashboard (Temple profile, add hotel/pujari). │
│  - Media Uploading APIs (AWS S3).                      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  PHASE 3: Consumer Storefront & Booking Engine         │
│  - Consumer Portal (Explore Temples, Search Services). │
│  - Shopping Cart, checkout flow, Order placements.     │
│  - Hotel Room Booking calendar & Pujari Slot selection.│
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  PHASE 4: Payment, Logistics & AI Integrations         │
│  - Razorpay payment gateway split payouts config.      │
│  - Shiprocket courier tracking integration.            │
│  - AI Pilgrimage Planner algorithm implementation.      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  PHASE 5: QA, Deployment & Launch                      │
│  - Security auditing, load testing for heavy booking.  │
│  - Hosting React on Vercel, Node API on AWS.           │
│  - Handover and marketing setup.                       │
└────────────────────────────────────────────────────────┘
```

---
**Prepared For:** [Client Name / Investor]  
**Technology & Concept Partner:** Developer Team  
**Date:** June 2026
