# 🇳🇬 Nigerian Postcode Lookup Widget

A lightweight React + TypeScript widget that lets anyone search Nigerian postcodes by area, LGA, or code — built on the NIPOST national postcode API.

## 🎯 Problem

Nigeria's new alphanumeric postcode system is a national asset, but most developers and businesses don't have an easy way to integrate it into their products. Addresses remain hard to standardize, deliveries get delayed, and emergency services struggle to locate people.

## 💡 Solution

A clean, embeddable React widget that:
- Searches postcodes by area name, LGA, or postcode code
- Returns structured JSON (postcode, area, LGA, state)
- Includes a copy-to-clipboard button
- Works on mobile and desktop
- Is open source and free to use

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Axios
- **API:** NIPOST Postcode API (`https://api.postcode.gov.ng/v1`)
- **Styling:** Custom CSS (no dependencies)
- **Hosting:** Netlify

## 🚀 Live Demo

[https://lawal-postcode-lookup.netlify.app](https://lawal-postcode-lookup.netlify.app)

## 🔌 How Developers Can Use This

```bash
git clone https://github.com/bishopkhadir/postcode-lookup
cd postcode-lookup
npm install
npm run dev