# Next step: Factory spec sheet for the remaining sports products

Aapne option nahi chuna, is liye maine yeh chuna: abhi "Factory spec sheet" aur "Buyer questions" sirf Hoodies, Tracksuits aur Basketball pages par hain. Ab baaki sports products par bhi lagayenge.

## Kya hoga
1. Naye product types ke liye specs (kapra, GSM, printing tareeqa, tayyari ka waqt, branding, sizes) aur 3 buyer sawal-jawab:
   - Soccer / Football uniforms
   - American football uniforms
   - Ice hockey uniforms
   - Jerseys (crew neck wagera) aur baaki aam sportswear ke liye ek general set
2. Har product page par yeh sections khud aa jayenge, jaise hoodie page par aate hain.
3. Har buyer sawal ke jawab ke neeche us product ke mulk wale page (USA / UK / Europe / Australia) ka chhota link, taake Google ko pages ka aapas mein jod dikhe.

## Technical details
- Extend `src/lib/b2b-content.ts` with SOCCER, AMERICAN_FOOTBALL, ICE_HOCKEY and a GENERAL fallback; matching order keeps american football before soccer/football.
- Update `src/lib/b2b-content.test.ts` with one assertion per new type.
- No database change.

## Note
GSM aur tayyari ke din aam factory values hongi; asal numbers aap confirm karein.
