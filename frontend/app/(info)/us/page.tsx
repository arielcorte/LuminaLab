export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      {/* Title */}
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">About Luminar Lab</h1>
        <p className="text-gray-600 leading-relaxed">
          Luminar Lab is an innovation platform that leverages blockchain to 
          provide global, tamper-proof certification, timestamping, and 
          traceability for patents. Our mission is to complement the traditional 
          intellectual property (IP) registration system with a unified, secure, 
          and globally accessible layer of digital verification.
        </p>
      </section>

      {/* Legal Basis */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Legal & Technical Foundation</h2>
        <p className="text-gray-600 leading-relaxed">
          Our approach is grounded in international IP frameworks defined by the 
          World Intellectual Property Organization (WIPO), including the Paris 
          Convention and the Patent Cooperation Treaty (PCT). WIPO PROOF 
          establishes a global precedent validating digital hashing and 
          timestamping as legally admissible evidence of authorship, integrity, 
          and creation date. Luminar Lab extends this model using decentralized 
          infrastructures for stronger, borderless verification.
        </p>
      </section>

      {/* Problems of Traditional System */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Why Traditional Patent Systems Need Reinforcement</h2>
        <p className="text-gray-600 leading-relaxed">
          Patent processes can take 12–36 months, leaving inventions exposed to 
          appropriation, parallel filings, and disputes. Because protection is 
          territorial, inventors must file separately in every jurisdiction, 
          increasing complexity and cost. There is no global unified registry, 
          which creates fragmentation, inconsistent recognition, and difficult 
          cross-border verifications.
        </p>
      </section>

      {/* Blockchain Solution */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Blockchain as a Global Unification Layer</h2>
        <p className="text-gray-600 leading-relaxed">
          Blockchain enables immutable evidence, cryptographic timestamps, global 
          accessibility, and full transparency of ownership history. These 
          characteristics align with existing digital evidence laws (e.g., 
          Argentina’s Digital Signature Law 25.506 and UNCITRAL’s model laws), 
          granting blockchain records full evidentiary validity.
        </p>
      </section>

      {/* KYC + Complementarity */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">KYC and Compliance-First Design</h2>
        <p className="text-gray-600 leading-relaxed">
          Luminar Lab integrates a strict KYC framework requiring official patent 
          certificates, notarized assignment documents, and verified identity, 
          ensuring only legitimate holders interact with the platform. Our system 
          does not replace official patent offices—rather, it complements them by 
          providing an immutable, globally accessible certification and management 
          layer.
        </p>
      </section>

      {/* Smart Contracts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Automated Royalty Management</h2>
        <p className="text-gray-600 leading-relaxed">
          Smart contracts allow co-owners to define royalty shares and automate 
          distributions with transparent, auditable transactions. Luminar Lab 
          charges a 5% service fee only for users who opt into automated 
          revenue-sharing and license management, ensuring sustainability without 
          compromising accessibility.
        </p>
      </section>

      {/* Global Interoperability */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Towards a Unified Global IP Ecosystem</h2>
        <p className="text-gray-600 leading-relaxed">
          By consolidating patent ownership records, jurisdictional information, 
          licensing agreements, and transaction histories into a single 
          verifiable source of truth, Luminar Lab reduces litigation risks, 
          simplifies international collaboration, streamlines prior-art searches, 
          and democratizes access to global protection.
        </p>
      </section>

      {/* Compliance */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Data Protection & Compliance</h2>
        <p className="text-gray-600 leading-relaxed">
          The platform complies with GDPR, Argentina’s Law 25.326, and international 
          data-protection standards via strong encryption, minimal data retention, 
          role-based access control, and periodic security audits.
        </p>
      </section>

      {/* Disclaimer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Limitations & Responsibilities</h2>
        <p className="text-gray-600 leading-relaxed">
          Luminar Lab provides technological certification—not official patent 
          titles—and does not guarantee patentability. Users remain responsible for 
          the accuracy of information and for complying with local IP regulations. 
          All terms include liability limitations and dispute resolution clauses.
        </p>
      </section>

      {/* Final Closing */}
      <section className="pt-6 border-t">
        <p className="text-gray-700 font-medium">
          Luminar Lab — Technological innovation advancing global intellectual property.
        </p>
      </section>
    </div>
  );
}
