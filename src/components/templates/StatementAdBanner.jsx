import React from 'react';

export default function StatementAdBanner({ institution }) {
  // Institution-specific promotional banner configurations
  const adConfigs = {
    apex_national: {
      tag: 'FINANCIAL WELLNESS ADVISOR',
      title: 'Earn 4.85% APY on High-Yield Savings',
      description: 'Transfer your surplus checking balance automatically into an Apex High-Yield Savings account. No monthly maintenance fees or lockup periods.',
      badge: 'LIMITED TIME OFFER',
      callToAction: 'Log in to apexnationalbank.com/savings to open today.',
      accentBg: 'from-blue-900 to-slate-900',
      badgeBg: 'bg-blue-500 text-white'
    },
    chase_sim: {
      tag: 'CHASE FREEDOM UNLIMITED®',
      title: 'Earn Unlimited 1.5% Cash Back on Every Purchase',
      description: 'Plus earn 3% back on dining & drugstores, and 5% back on Chase Travel. $200 bonus offer after spending $500 in your first 3 months.',
      badge: 'SPECIAL MEMBER PROMOTION',
      callToAction: 'Visit chase.com/freedom or text APPLY to 24273.',
      accentBg: 'from-sky-900 to-blue-950',
      badgeBg: 'bg-sky-400 text-slate-950'
    },
    bofa_sim: {
      tag: 'BANK OF AMERICA PREFERRED REWARDS®',
      title: 'Unlock Up to a 75% Rewards Bonus on Your Credit Cards',
      description: 'Get extra perks on checking, savings, and investments when you maintain an active balance with Bank of America & Merrill.',
      badge: 'PREFERRED MEMBER PRIVILEGE',
      callToAction: 'Explore your tier status at bankofamerica.com/preferred.',
      accentBg: 'from-amber-900 to-red-950',
      badgeBg: 'bg-amber-400 text-slate-950'
    },
    wells_sim: {
      tag: 'WELLS FARGO HOME MORTGAGE',
      title: 'Refinance & Save with Exclusive Relationship Discounts',
      description: 'Existing Wells Fargo checking members receive up to $1,000 credit towards closing costs on custom home mortgage refinancing.',
      badge: 'MEMBER EXCLUSIVE',
      callToAction: 'Schedule an appointment at wellsfargo.com/mortgage.',
      accentBg: 'from-red-950 to-amber-900',
      badgeBg: 'bg-red-500 text-white'
    },
    navy_fed_sim: {
      tag: 'NAVY FEDERAL CAR LOANS',
      title: 'Auto Loan Rates as Low as 4.49% APR',
      description: 'Get pre-approved in minutes with 100% financing options, flexible repayment terms, and no payment for 90 days for qualified members.',
      badge: 'ACTIVE DUTY & VETERAN ADVANTAGE',
      callToAction: 'Apply instantly on the Navy Federal Mobile App.',
      accentBg: 'from-blue-950 to-sky-900',
      badgeBg: 'bg-cyan-400 text-slate-950'
    }
  };

  const ad = adConfigs[institution.id] || adConfigs.apex_national;

  return (
    <div className="my-4 p-4 rounded-md bg-gradient-to-r text-white shadow-sm print:border print:border-slate-300 print:bg-slate-50 print:text-slate-900 page-break-inside-avoid font-sans"
         style={{ backgroundImage: `linear-gradient(to right, ${institution.primaryColor || '#0f172a'}, ${institution.accentColor || '#2563eb'})` }}>
      <div className="flex justify-between items-start mb-1.5">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-200 opacity-90">
          {ad.tag}
        </span>
        <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${ad.badgeBg}`}>
          {ad.badge}
        </span>
      </div>

      <h4 className="text-xs font-black tracking-tight text-white mb-1">
        {ad.title}
      </h4>

      <p className="text-[10px] leading-relaxed text-slate-200 mb-2">
        {ad.description}
      </p>

      <div className="text-[9px] font-semibold text-slate-100 flex items-center justify-between border-t border-white/20 pt-1.5 mt-1.5">
        <span>{ad.callToAction}</span>
        <span className="font-mono text-[8px] opacity-75">PROMO REF: #{institution.routingNumber.slice(-4)}-2026</span>
      </div>
    </div>
  );
}
