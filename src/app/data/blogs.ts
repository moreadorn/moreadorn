export interface BlogPost {
  id: string;
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  image: string;
  gallery?: string[];
  author: string;
  date: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "total-landed-cost",
    category: "Guide",
    readTime: "7 min read",
    title: "How to Calculate Total Landed Cost",
    excerpt:
      "Beyond unit price — understanding shipping, duties, and hidden fees that affect your real margins.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&h=800&fit=crop",
    ],
    author: "Moreadorn Trade Desk",
    date: "April 12, 2026",
    content: [
      "Total Landed Cost (TLC) is the complete cost of a product once it has arrived at the buyer's doorstep — including the unit price, shipping, insurance, duties, taxes, and any handling or compliance fees. Many first-time importers focus on the per-unit invoice, only to discover their margins evaporate by the time the goods clear customs.",
      "The first component is product cost: what you pay the manufacturer per unit. This is usually FOB (Free On Board), meaning the supplier delivers to your designated port. From there, you absorb international shipping, which varies dramatically by mode — air freight is fastest but expensive, sea freight is slow but economical, and express courier sits in between.",
      "Next is duties and taxes, which depend on the product's HS code (Harmonized System), the trade agreements between origin and destination countries, and the declared value. A misclassified HS code can cost you thousands or trigger customs holds. Always verify with a licensed customs broker or your import agent.",
      "Don't forget insurance (typically 0.3% to 1% of cargo value), customs clearance fees, last-mile delivery, and any required certifications or testing. For specialized goods like food, electronics, or chemicals, additional FDA, FCC, or REACH compliance can add real cost.",
      "Our recommendation: build a TLC spreadsheet for every shipment before you place the order. Multiply unit price × quantity, add freight (get quotes for sea, air, and express), add 10-15% buffer for duties and clearance, then divide by total units to get your true landed cost per unit. That's the number to compare against your selling price.",
    ],
  },
  {
    id: "customs-documentation",
    category: "Compliance",
    readTime: "5 min read",
    title: "Navigating Customs Documentation",
    excerpt:
      "A practical breakdown of commercial invoices, packing lists, and certificates of origin.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&h=800&fit=crop",
    ],
    author: "Compliance Team",
    date: "April 28, 2026",
    content: [
      "Customs paperwork is where many first-time importers get stuck. The good news: there are only three documents you absolutely must understand — the commercial invoice, the packing list, and the certificate of origin. Get these three right, and most shipments clear without delays.",
      "The commercial invoice is the legal sales document between buyer and seller. It must show the full description of goods, HS codes, unit prices, total value, currency, terms of sale (Incoterms), and both parties' contact details. Customs uses this to assess duty value, so accuracy matters — never under-declare to save on duties; it's fraud and the penalties are severe.",
      "The packing list itemizes exactly what's in each carton or pallet. Include carton numbers, gross and net weights, dimensions, and quantity per carton. This document helps customs verify the shipment matches the invoice and helps your warehouse team unload efficiently.",
      "The certificate of origin (COO) declares where the goods were manufactured. For trade agreement benefits (e.g., reduced duties under FTAs), you need a preferential COO issued by the chamber of commerce or designated authority in the origin country. For routine shipments, a non-preferential COO is sufficient.",
      "Additional documents you may need depending on the product and destination: bill of lading or airway bill (transport contract), insurance certificate, phytosanitary certificate (for plants), fumigation certificate (for wood packaging), and import permits for restricted goods. Always check with the destination country's customs authority before shipping unfamiliar products.",
    ],
  },
  {
    id: "bulk-sourcing-best-practices",
    category: "Strategy",
    readTime: "9 min read",
    title: "Bulk Sourcing Best Practices",
    excerpt:
      "Negotiating MOQs, sample orders, and quality terms — what experienced buyers do differently.",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
    ],
    author: "Moreadorn Trade Desk",
    date: "May 1, 2026",
    content: [
      "Bulk sourcing is part art, part science. The buyers who consistently get great prices, on-time delivery, and reliable quality follow a few practices that set them apart from one-off importers.",
      "Start with a clear product brief. The more specific you are about specifications — material, dimensions, tolerances, packaging, certifications — the more accurate the quote. Vague briefs invite vague quotes, and surprises later. Include reference photos, target unit price, target quantity, and delivery deadline.",
      "Always order samples before committing to bulk. Most experienced buyers will pay sample fees (often refundable on bulk order) and ship samples to multiple suppliers in parallel to compare. Test the samples thoroughly: dimensions, durability, finish, packaging integrity, and any function-specific tests.",
      "Negotiate MOQs (Minimum Order Quantities) creatively. If a supplier's standard MOQ is too high for your launch, ask about: sharing a production run with another buyer, paying a higher per-unit price for lower MOQ, or starting with a trial order at higher unit cost with a written commitment to scale.",
      "Lock down quality terms in writing. A purchase order or contract should specify: acceptable defect rates (AQL), inspection rights (yours or a third party's), what happens if the shipment fails inspection (rework, replacement, refund), and the latest acceptable shipping date. Vague quality terms lead to disputes.",
      "Payment terms matter as much as price. Standard for first-time orders is 30% advance + 70% before shipment, paid via T/T or L/C. As trust builds, suppliers may offer 30/70 against B/L or even open account terms. Never pay 100% upfront for a first order.",
    ],
  },
  {
    id: "shipping-modes-explained",
    category: "Logistics",
    readTime: "6 min read",
    title: "Sea vs Air vs Express: Choosing the Right Shipping Mode",
    excerpt:
      "Understanding the trade-offs in cost, speed, and reliability for each shipping option.",
    image: "/image/export3.jpg",
    gallery: [
      "https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&h=800&fit=crop",
    ],
    author: "Logistics Team",
    date: "March 22, 2026",
    content: [
      "Choosing how to ship goods internationally comes down to three factors: cost, speed, and reliability. The right answer depends on the value of your goods, how time-sensitive the delivery is, and how much you can afford to tie up in inventory transit.",
      "Sea freight is the workhorse of international trade. It's the cheapest mode per kilogram and handles the largest volumes. Full Container Load (FCL) gives you a dedicated 20ft or 40ft container; Less than Container Load (LCL) shares container space with other shipments. Transit times: 25-45 days port-to-port. Best for non-urgent bulk goods.",
      "Air freight is 5-10x faster than sea but 5-10x more expensive. Use it for high-value, time-sensitive, or perishable goods — fashion, electronics, samples, or any shipment where stockout cost exceeds shipping cost. Transit: 5-10 days door-to-door including customs.",
      "Express courier (DHL, FedEx, UPS) is door-to-door in 3-5 business days and includes customs clearance. The most expensive option per kg, but unbeatable for samples, urgent replacements, or small consignments under 100 kg.",
      "A common mistake: choosing the cheapest mode and getting hit with stockout costs from a slow shipment. A second mistake: choosing the fastest mode for low-value goods where shipping eats your margin. Build a simple decision matrix — cargo value × time-sensitivity — and pick accordingly.",
    ],
  },
  {
    id: "incoterms-2020",
    category: "Compliance",
    readTime: "8 min read",
    title: "Incoterms 2020: A Buyer's Reference",
    excerpt:
      "FOB, CIF, DDP, EXW — what each term actually means for buyer responsibility and cost.",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&h=800&fit=crop",
    ],
    author: "Compliance Team",
    date: "February 18, 2026",
    content: [
      "Incoterms (International Commercial Terms) define exactly where seller responsibility ends and buyer responsibility begins for an international shipment. The 2020 revision is the current standard, published by the International Chamber of Commerce. Knowing your Incoterms protects you from disputes and unexpected costs.",
      "EXW (Ex Works) is the most seller-friendly: the buyer takes possession at the seller's factory gate and arranges everything from there — pickup, export clearance, freight, import clearance, last-mile. Cheapest invoice price but most work for the buyer.",
      "FOB (Free On Board) is the most common for sea freight: the seller delivers goods on board the vessel at the named port. Risk transfers to the buyer when goods cross the ship's rail. Buyer arranges main carriage, insurance, and import clearance.",
      "CIF (Cost, Insurance, Freight) means the seller arranges and pays for shipping and minimum insurance to the destination port. Risk still transfers at the origin port, but buyer doesn't have to coordinate freight. Convenient but the seller's freight quote is usually higher than buyer's.",
      "DDP (Delivered Duty Paid) is the most buyer-friendly: seller handles everything, including destination duties and delivery to the buyer's door. Highest invoice price but zero hassle. Be careful — some sellers underestimate destination duties and try to recover later.",
      "Our recommendation for first-time buyers: start with DDP or CIF until you build relationships with freight forwarders and customs brokers. Once you know your destination's customs landscape, switch to FOB to control freight costs and provider quality.",
    ],
  },
  {
    id: "supplier-verification",
    category: "Strategy",
    readTime: "7 min read",
    title: "How to Verify a New Manufacturer",
    excerpt:
      "A six-step due diligence framework to avoid scams and qualify reliable production partners.",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop",
    ],
    author: "Sourcing Team",
    date: "March 5, 2026",
    content: [
      "Sourcing scams cost importers millions every year. The good news: a basic due diligence process catches most red flags before money changes hands. Here's a six-step framework that experienced buyers use.",
      "Step 1: Verify business registration. In China, check the manufacturer's business license on the State Administration for Industry and Commerce database. In India, verify GSTIN and IEC (Importer Exporter Code). Genuine manufacturers welcome verification; scammers stall.",
      "Step 2: Request factory photos and live video tour. A reputable factory will share photos of their floor, machinery, and warehouse. Better — schedule a live video walk-through. If they refuse, walk away.",
      "Step 3: Check trading history. Ask for references from current and past clients in your country or region. Call them. A factory that's been exporting for 5+ years to your destination has navigated customs and quality issues you'd otherwise discover the hard way.",
      "Step 4: Verify certifications. ISO 9001, BSCI, SEDEX, REACH, RoHS — whatever applies to your product. Don't trust certificate scans; they're easy to fake. Verify directly with the certifying body or via their public database.",
      "Step 5: Order a paid sample. Free samples or unusually low sample fees can be a red flag — legitimate manufacturers value their time. Inspect the sample for build quality, finish, and adherence to specs. Compare against what you'd accept in a bulk order.",
      "Step 6: Start with a small pilot order. Even after passing all checks, your first order should be small — enough to validate quality at production scale, but small enough that a problem doesn't sink your business. Scale up only after a successful pilot.",
    ],
  },
  {
    id: "minimum-order-strategy",
    category: "Strategy",
    readTime: "6 min read",
    title: "MOQ Negotiation: Getting Smaller First Orders",
    excerpt:
      "Practical tactics for new buyers to start small without paying premium pricing.",
    image:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=800&fit=crop",
    ],
    author: "Moreadorn Trade Desk",
    date: "January 30, 2026",
    content: [
      "Minimum Order Quantities are how factories cover setup costs and ensure production runs are profitable. For new buyers without proven volume, standard MOQs can be a barrier — but they're rarely as fixed as they appear.",
      "Tactic 1: Pay a higher per-unit price. Most factories will accept a smaller order if you cover their fixed costs. Expect to pay 15-30% more per unit, but you can launch with 30-50% of the standard MOQ.",
      "Tactic 2: Combine SKUs. If a factory's MOQ is 1,000 units per SKU, ask if it can be 1,000 across multiple SKUs (e.g., 250 each of 4 colors). Many will agree if total run volume justifies the setup.",
      "Tactic 3: Share a production run. Some sourcing platforms or trade communities help match buyers wanting the same product. You and another buyer split a production run, hitting MOQ together.",
      "Tactic 4: Stock items vs. custom. Factories with stock inventory have far lower MOQs than custom-manufactured goods. Identify what's standard in their catalog and start there.",
      "Tactic 5: Long-term commitment. If you can credibly commit to repeat orders (a written PO schedule for 3-6 months), some factories will accept a small first order at standard pricing as a relationship investment.",
    ],
  },
  {
    id: "quality-control-process",
    category: "Quality",
    readTime: "8 min read",
    title: "Pre-Shipment Inspection: What to Demand",
    excerpt:
      "The quality checkpoints that catch defects before goods leave the factory floor.",
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&h=800&fit=crop",
    ],
    author: "Quality Team",
    date: "March 14, 2026",
    content: [
      "Pre-shipment inspection (PSI) is your last line of defense against defective goods leaving the factory. Done well, it catches 90%+ of issues before your money has crossed an ocean. Done poorly — or not at all — you discover problems when goods arrive at your warehouse, with no leverage left.",
      "Use AQL (Acceptable Quality Limit) sampling per ISO 2859-1. The standard is AQL 2.5 for major defects and AQL 4.0 for minor defects. The inspector samples a statistically valid subset — for example, 80 units from a 1,000-unit shipment — and the lot passes or fails based on defect counts.",
      "Specify what's a major vs minor defect in writing, before production. Major defects affect function, safety, or cosmetics in a way that makes the product unsellable. Minor defects are noticeable flaws that don't affect function. Without a clear definition, inspectors and factories disagree.",
      "Hire a third-party inspector, not the factory's own QC. Third-party firms (SGS, Bureau Veritas, AsiaInspection, etc.) typically charge $200-400 per inspection day and provide a detailed photo report within 24 hours. The cost is a fraction of receiving a defective shipment.",
      "Inspect against your purchase order specifications, not the factory's interpretation. Bring the PO, the approved sample, and the spec sheet to the inspection. The inspector compares actual production to documented specs, not vague descriptions.",
      "If the inspection fails, you have leverage: the factory must rework or replace defective units before goods ship. After goods leave the factory, your leverage drops to near zero. Always inspect before final payment is released.",
    ],
  },
  {
    id: "trade-agreements-overview",
    category: "Compliance",
    readTime: "10 min read",
    title: "Free Trade Agreements: Hidden Savings",
    excerpt:
      "How to leverage FTAs to reduce import duties — and the paperwork that makes it work.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1554224155-1696413565d3?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
    ],
    author: "Compliance Team",
    date: "February 8, 2026",
    content: [
      "Free Trade Agreements (FTAs) reduce or eliminate import duties between participating countries. If you're sourcing from a country that has an FTA with your destination, you may be paying duties you don't have to.",
      "Examples: India-UAE CEPA reduces duties on most goods between the two countries; the EU has FTAs with dozens of countries; the USMCA covers North America. Some FTAs eliminate duties entirely on qualifying goods, others reduce them significantly.",
      "To claim FTA benefits, you need a preferential certificate of origin from the exporting country, issued by the chamber of commerce or designated authority. The certificate verifies the goods were manufactured in the FTA country (not just shipped from there) and meet rules of origin.",
      "Rules of origin matter: a product assembled in country A from components made in country B may not qualify if the value-added in A doesn't meet the FTA threshold (often 30-50%). Verify with your customs broker before assuming benefits apply.",
      "The savings can be substantial. A 10% duty on a $100,000 shipment is $10,000. Multiply across multiple shipments per year and FTA documentation pays for itself dozens of times over.",
      "Practical tip: when comparing supplier quotes from different countries, factor in destination duties. A slightly higher quote from an FTA country may net out cheaper than the lowest quote from a non-FTA country.",
    ],
  },
  {
    id: "container-shipping-guide",
    category: "Logistics",
    readTime: "5 min read",
    title: "FCL vs LCL: Container Shipping Decisions",
    excerpt:
      "When to commit to a full container and when LCL makes more sense.",
    image:
      "https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1494412519320-aa613df615a4?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1200&h=800&fit=crop",
    ],
    author: "Logistics Team",
    date: "April 5, 2026",
    content: [
      "Sea freight comes in two flavors: Full Container Load (FCL) and Less than Container Load (LCL). The choice affects cost, transit time, and risk of damage.",
      "FCL means you book the entire container — typically 20ft (about 28-30 cbm capacity) or 40ft (58-65 cbm). The container is sealed at origin and opened at destination, with no other cargo inside. Faster transit, lower handling, and predictable pricing.",
      "LCL means your cargo shares a container with other shipments. You pay per cubic meter (cbm) or per kg, whichever is greater. LCL is economical for shipments under ~15 cbm, but freight forwarder fees are higher per cbm and transit can be slower due to consolidation/deconsolidation.",
      "Rule of thumb: if your shipment is over 15 cbm, FCL usually wins on price even if you don't fully fill the container. Below 15 cbm, LCL is typically cheaper. Below 2 cbm, consider air freight or express courier instead.",
      "FCL has a hidden benefit: less handling means less damage. LCL cargo gets palletized, depalletized, and handled multiple times during consolidation, which increases damage risk. For fragile goods, the cost premium of FCL is often worth it.",
    ],
  },
  {
    id: "sustainable-sourcing",
    category: "Sustainability",
    readTime: "7 min read",
    title: "Building a Sustainable Supply Chain",
    excerpt:
      "Practical steps to reduce environmental impact and meet rising buyer expectations.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&h=800&fit=crop",
    ],
    author: "Sustainability Team",
    date: "January 18, 2026",
    content: [
      "Sustainability is no longer a nice-to-have. End consumers, retail buyers, and regulators are all pushing for verifiable supply chain transparency and reduced environmental impact. The good news: sustainable practices often align with cost savings.",
      "Start with measurement. You can't improve what you don't measure. Track the carbon footprint of your shipments — there are free calculators that estimate emissions per kg per route. This becomes the baseline for improvement.",
      "Optimize packaging. Many shipments use 20-40% more packaging than necessary. Reducing carton sizes, eliminating plastic where paper works, and using recycled materials cuts both cost and footprint.",
      "Consolidate shipments. Three smaller shipments per month emit far more than one larger monthly shipment. Better forecasting and inventory planning cut both shipping cost and emissions.",
      "Choose suppliers with sustainability certifications: BSCI, SEDEX, Fair Trade, GOTS for textiles, FSC for paper/wood products. Certifications provide third-party verification of environmental and social practices.",
      "Be transparent with your end customers. Increasingly, buyers reward brands that share supply chain details — country of origin, factory names (where contractually allowed), shipping mode, and emissions. Transparency builds trust and commands a price premium.",
    ],
  },
  {
    id: "payment-terms-guide",
    category: "Strategy",
    readTime: "6 min read",
    title: "Payment Terms in International Trade",
    excerpt:
      "T/T, L/C, escrow, and open account — protecting your money on every order.",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&h=800&fit=crop",
    ],
    author: "Trade Finance Team",
    date: "April 19, 2026",
    content: [
      "How you pay matters as much as what you pay. The right payment structure protects your money and gives you leverage if something goes wrong.",
      "T/T (Telegraphic Transfer / wire transfer) is the most common method. Standard for first orders: 30% advance to start production, 70% before shipment against shipping documents. Cheap and fast, but you bear all the risk if the supplier fails to deliver.",
      "L/C (Letter of Credit) is your bank's guarantee that the supplier will be paid only when shipping documents prove goods have been shipped per the contract. Expensive (1-3% in bank fees) and paperwork-heavy, but eliminates supplier risk for first-time orders or large amounts.",
      "Escrow services hold your funds until you confirm receipt and quality. Common on Alibaba and similar platforms. Useful for first orders with unverified suppliers, but transaction fees can be 2-5%.",
      "Open account terms (pay 30/60/90 days after shipment) are extended only after a track record. Suppliers offer them to reward consistent buyers and stay competitive — they're worth asking about after 3-5 successful orders.",
      "Avoid 100% advance payment for a first order. If a supplier insists, that's a red flag. Reputable manufacturers know that requiring full upfront payment is a deal-breaker for serious buyers.",
    ],
  },
];
