// Add to app/layout.tsx <head> for Google rich results
// This tells Google exactly what PhishGuard is, enabling rich snippets

export function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "PhishGuard",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any (REST API)",
        "description": "Phishing URL analyzer API. Fuses VirusTotal, URLhaus, GreyNoise, WHOIS, SSL, and DNS into one risk score. Free tier: 50 analyses/day.",
        "url": "https://phishguard.dev",
        "offers": [
          {
            "@type": "Offer",
            "name": "Free",
            "price": "0",
            "priceCurrency": "USD",
            "description": "50 URL analyses per day, forever free"
          },
          {
            "@type": "Offer",
            "name": "Pro",
            "price": "19",
            "priceCurrency": "USD",
            "description": "5,000 URL analyses per day"
          },
          {
            "@type": "Offer",
            "name": "Business",
            "price": "79",
            "priceCurrency": "USD",
            "description": "50,000 URL analyses per day"
          }
        ],
        "author": {
          "@type": "Person",
          "name": "Soham Shah",
          "url": "https://linkedin.com/in/shahsoham2003"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I check if a URL is phishing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Use PhishGuard API: POST the URL to api.phishguard.dev/v1/analyze with your API key. You get a risk score 0-100 and a MALICIOUS/SUSPICIOUS/CLEAN verdict in under 2 seconds."
            }
          },
          {
            "@type": "Question",
            "name": "Is PhishGuard free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. The free tier gives 50 URL analyses per day forever, no credit card required. Paid plans start at $19/month for 5,000 analyses/day."
            }
          },
          {
            "@type": "Question",
            "name": "What sources does PhishGuard check?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PhishGuard checks VirusTotal (87+ AV engines), URLhaus (Abuse.ch), GreyNoise IP intelligence, WHOIS domain age, SSL certificate validity, DNS records, and URL feature analysis (homograph detection, suspicious TLDs, keyword analysis)."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
