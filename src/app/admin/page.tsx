import { db } from "@/lib/db";
import { partners, referrals } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import ReviewOutreachForm from "@/components/ReviewOutreachForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const allPartners = await db.select().from(partners).orderBy(desc(partners.id)).all();
  const allReferrals = await db.select().from(referrals).orderBy(desc(referrals.id)).all();

  // Build a map of partner names by ID for referral display
  const partnerMap = new Map(allPartners.map((p) => [p.id, p]));

  return (
    <main className="bg-navy min-h-screen">
      {/* Header */}
      <div className="bg-dark-teal border-b border-blue/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/brand/secondary_orange.svg"
              alt="Moving Mountains"
              width={160}
              height={36}
            />
            <span className="subheading text-blue text-xs">ADMIN</span>
          </div>
          <Link href="/" className="text-blue text-sm hover:text-orange transition-colors">
            &larr; Back to site
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-dark-teal border border-blue/10 p-6">
            <p className="heading text-orange text-3xl">{allPartners.length}</p>
            <p className="subheading text-blue text-xs mt-1">PARTNERS</p>
          </div>
          <div className="bg-dark-teal border border-blue/10 p-6">
            <p className="heading text-orange text-3xl">{allReferrals.length}</p>
            <p className="subheading text-blue text-xs mt-1">REFERRALS</p>
          </div>
          <div className="bg-dark-teal border border-blue/10 p-6">
            <p className="heading text-orange text-3xl">
              ${allReferrals.length * 100}
            </p>
            <p className="subheading text-blue text-xs mt-1">DISCOUNTS GIVEN</p>
          </div>
          <div className="bg-dark-teal border border-blue/10 p-6">
            <p className="heading text-orange text-3xl">
              {allPartners.filter((p) => {
                const d = new Date(p.createdAt);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length}
            </p>
            <p className="subheading text-blue text-xs mt-1">NEW THIS MONTH</p>
          </div>
        </div>

        {/* Review Outreach Agent */}
        <div className="mb-12 bg-dark-teal border border-orange/20 p-8">
          <h2 className="heading text-orange text-2xl mb-2">5-STAR REVIEW OUTREACH AGENT</h2>
          <p className="text-blue text-sm mb-6">
            Paste a 5-star review below. The agent will match the reviewer to a completed job,
            research who their realtor/builder/complex was, and send them the outreach text sequence.
          </p>
          <ReviewOutreachForm />
        </div>

        {/* Partners Table */}
        <div className="mb-12">
          <h2 className="heading text-white text-2xl mb-6">PARTNERS</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue/20">
                  <th className="subheading text-blue text-xs text-left py-3 px-4">NAME</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">COMPANY</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">BROKERAGE</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">EMAIL</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">PHONE</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">REFERRALS</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">PAGE</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">SIGNED UP</th>
                </tr>
              </thead>
              <tbody>
                {allPartners.map((partner) => {
                  const refCount = allReferrals.filter((r) => r.partnerId === partner.id).length;
                  return (
                    <tr key={partner.id} className="border-b border-blue/10 hover:bg-dark-teal/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {partner.headshotUrl && (
                            <Image
                              src={partner.headshotUrl}
                              alt=""
                              width={32}
                              height={32}
                              className="w-8 h-8 object-cover"
                            />
                          )}
                          <span className="text-white text-sm font-medium">
                            {partner.firstName} {partner.lastName}
                          </span>
                        </div>
                      </td>
                      <td className="text-tan text-sm py-3 px-4">{partner.companyName}</td>
                      <td className="text-tan text-sm py-3 px-4">{partner.brokerage}</td>
                      <td className="text-blue text-sm py-3 px-4">{partner.email}</td>
                      <td className="text-blue text-sm py-3 px-4">{partner.phone}</td>
                      <td className="py-3 px-4">
                        <span className="heading text-orange text-lg">{refCount}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/partner/${partner.slug}`}
                          className="text-orange text-sm hover:underline"
                          target="_blank"
                        >
                          View
                        </Link>
                      </td>
                      <td className="text-blue/60 text-xs py-3 px-4">
                        {new Date(partner.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
                {allPartners.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-blue/40 text-sm text-center py-8">
                      No partners yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Referrals Table */}
        <div>
          <h2 className="heading text-white text-2xl mb-6">REFERRALS</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-blue/20">
                  <th className="subheading text-blue text-xs text-left py-3 px-4">CLIENT NAME</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">EMAIL</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">PHONE</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">MOVE DATE</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">MESSAGE</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">REFERRED BY</th>
                  <th className="subheading text-blue text-xs text-left py-3 px-4">SUBMITTED</th>
                </tr>
              </thead>
              <tbody>
                {allReferrals.map((ref) => {
                  const partner = partnerMap.get(ref.partnerId);
                  return (
                    <tr key={ref.id} className="border-b border-blue/10 hover:bg-dark-teal/50">
                      <td className="text-white text-sm font-medium py-3 px-4">
                        {ref.firstName} {ref.lastName}
                      </td>
                      <td className="text-blue text-sm py-3 px-4">{ref.email}</td>
                      <td className="text-blue text-sm py-3 px-4">{ref.phone}</td>
                      <td className="text-tan text-sm py-3 px-4">{ref.moveDate || "—"}</td>
                      <td className="text-tan/70 text-sm py-3 px-4 max-w-xs truncate">
                        {ref.message || "—"}
                      </td>
                      <td className="py-3 px-4">
                        {partner ? (
                          <span className="text-orange text-sm">
                            {partner.firstName} {partner.lastName}
                          </span>
                        ) : (
                          <span className="text-blue/40 text-sm">Unknown</span>
                        )}
                      </td>
                      <td className="text-blue/60 text-xs py-3 px-4">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
                {allReferrals.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-blue/40 text-sm text-center py-8">
                      No referrals yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
