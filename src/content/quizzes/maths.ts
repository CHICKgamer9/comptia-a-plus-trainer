import type { Quiz } from "../types";

function q(
  id: string,
  prompt: string,
  choices: [string, string, string, string],
  correctIndex: number,
  explanation: string,
) {
  return { id, prompt, choices, correctIndex, explanation };
}

export const mathsQuizzes: Quiz[] = [
  {
    id: "number-sense-quiz",
    domainId: "number-sense",
    title: "Number sense",
    questions: [
      q("ns1", "Which is the best estimate for 198 × 6?", ["118", "1,200", "12,000", "80"], 1, "200 × 6 = 1,200. The exact 1,188 must live next door, not in a different place-value suburb."),
      q("ns2", "What is 3 + 4 × 5?", ["35", "12", "23", "60"], 2, "Multiply first: 4 × 5 = 20, then +3 = 23."),
      q("ns3", "12 ÷ 3 × 2 equals", ["2", "8", "18", "0.5"], 1, "Same priority: left to right. 12 ÷ 3 = 4, then × 2 = 8."),
      q("ns4", "In 3.04, the 4 sits in the", ["tenths", "hundredths", "tens", "thousandths"], 1, "3.04 is 3 ones and 4 hundredths. The 0 holds the tenths place empty."),
      q("ns5", "7 − (−3) is", ["4", "10", "−10", "21"], 1, "Subtracting a negative is adding. 7 + 3 = 10."),
      q("ns6", "A receipt shows 4 coffees at $4.80 as $192. What went wrong?", ["GST was applied four times", "A decimal place jumped", "They subtracted instead", "Nothing — that’s 10% off"], 1, "4 × $4.80 is near $20. $192 is 10× too big: the point moved."),
      q("ns7", "(3 + 4) × 5 equals", ["23", "12", "35", "3"], 2, "Brackets first: 7 × 5 = 35. Different packet from 3 + 4 × 5."),
      q("ns8", "Which number is coldest?", ["−1 °C", "0 °C", "2 °C", "−8 °C"], 3, "More negative is further below zero. −8 is colder than −1."),
    ],
  },
  {
    id: "fractions-quiz",
    domainId: "fractions",
    title: "Fractions",
    questions: [
      q("fr1", "1/2 + 1/3 equals", ["2/5", "5/6", "1/5", "2/6"], 1, "Common denominator 6: 3/6 + 2/6 = 5/6. You do not add denominators."),
      q("fr2", "Which is equivalent to 2/4?", ["1/4", "1/2", "4/2", "2/8"], 1, "Divide top and bottom by 2: 1/2. Same pile, fewer digits."),
      q("fr3", "2/3 × 3/4 equals", ["6/7", "5/12", "1/2", "8/9"], 2, "2×3 over 3×4 = 6/12 = 1/2."),
      q("fr4", "How many quarters fit in 1?", ["1/4", "3", "4", "0"], 2, "1 ÷ 1/4 = 4. Invert and multiply: 1 × 4/1."),
      q("fr5", "7/4 is", ["illegal", "one and three-quarters", "less than 1", "7.4"], 1, "Improper fractions are allowed. 7/4 = 1 3/4."),
      q("fr6", "To add unlike fractions you first", ["add the denominators", "rename to a common denominator", "multiply the numerators only", "convert to percent always"], 1, "Same-sized pieces, then add how many."),
      q("fr7", "1½ as an improper fraction is", ["1/2", "3/2", "2/3", "5/2"], 1, "1 + 1/2 = 2/2 + 1/2 = 3/2."),
      q("fr8", "Simplifying 12/18 gives", ["6/9", "2/3", "12/18 is already simplest", "3/2"], 1, "Divide by 6: 2/3. 6/9 still wants another cut."),
    ],
  },
  {
    id: "percentages-quiz",
    domainId: "percentages",
    title: "Percentages",
    questions: [
      q("pe1", "20% of 80 is", ["16", "20", "60", "4"], 0, "0.2 × 80 = 16. “Of” means multiply."),
      q("pe2", "Increase 80 by 20%.", ["96", "100", "64", "16"], 0, "80 × 1.20 = 96. The 16 is the increase, not the new total."),
      q("pe3", "A jumper is $64 after 20% off. Original price?", ["$51.20", "$80", "$84", "$320"], 1, "$64 is 80% of original. 64 ÷ 0.8 = $80."),
      q("pe4", "GST in Australia is usually", ["15%", "10%", "20%", "2%"], 1, "10% on most goods and services. Inclusive prices already contain it."),
      q("pe5", "20% off, then another 20% off, is", ["40% off", "36% off", "20% off", "80% off"], 1, "0.8 × 0.8 = 0.64 remaining → 36% off. Successive percents multiply."),
      q("pe6", "18 is what percent of 24?", ["75%", "18%", "133%", "6%"], 0, "18/24 × 100 = 75%."),
      q("pe7", "A value goes from 50 to 65. Percent increase?", ["15%", "30%", "23%", "65%"], 1, "Change 15 over original 50 = 30%."),
      q("pe8", "10% of $80, mentally, is", ["$8", "$10", "$0.80", "$88"], 0, "Move the decimal one place left: $8. 1% would be $0.80."),
    ],
  },
  {
    id: "algebra-foundations-quiz",
    domainId: "algebra-foundations",
    title: "Algebra",
    questions: [
      q("al1", "Solve x + 7 = 20.", ["13", "27", "7", "20"], 0, "Subtract 7 from both sides: x = 13."),
      q("al2", "2x + 6 = 20. x is", ["13", "7", "8", "14"], 1, "2x = 14, x = 7. Undo +6 first, then divide."),
      q("al3", "3(x + 4) expands to", ["3x + 4", "3x + 12", "x + 12", "7x"], 1, "3 hits both terms: 3x + 12."),
      q("al4", "3x + 2x equals", ["5x", "6x", "5x²", "3x2"], 0, "Like terms: 5 lots of x."),
      q("al5", "3x + 2 equals", ["5x", "3x + 2 (done)", "6x", "x = 2/3"], 1, "Unlike terms. You cannot fold the 2 into x."),
      q("al6", "If 2n + 5 = 21, n is", ["8", "13", "10.5", "16"], 0, "2n = 16, n = 8."),
      q("al7", "Which check confirms x = 7 in 2x + 6 = 20?", ["2×7 + 6 = 20", "2 + 7 + 6 = 20", "7×20 = 2", "20 − 7 = 2"], 0, "Substitute: 14 + 6 = 20. Algebra without a check is a rumour."),
      q("al8", "Multiply both sides of −2x > 8 by −1/2. The inequality", ["stays >", "flips to <", "becomes =", "disappears"], 1, "Multiply or divide by a negative and the sign flips: x < −4."),
    ],
  },
  {
    id: "geometry-measure-quiz",
    domainId: "geometry-measure",
    title: "Geometry",
    questions: [
      q("ge1", "Angles on a straight line add to", ["90°", "180°", "360°", "100°"], 1, "A straight line is a half-turn: 180°."),
      q("ge2", "A triangle’s interior angles add to", ["90°", "180°", "270°", "360°"], 1, "Always 180°, Euclidean classroom geometry."),
      q("ge3", "Area of a 4 by 6 rectangle is", ["20", "24", "10", "48"], 1, "4 × 6 = 24. 20 would be the perimeter."),
      q("ge4", "A 3-4-5 triangle’s hypotenuse is", ["3", "4", "5", "7"], 2, "3² + 4² = 9 + 16 = 25 = 5². Longest side opposite the right angle."),
      q("ge5", "Triangle area uses", ["base × slant", "½ × base × perpendicular height", "3 × side", "πr²"], 1, "Height is perpendicular to the chosen base."),
      q("ge6", "If every length of a shape doubles, area", ["doubles", "stays", "×4", "×8"], 2, "Area scales with the square of the scale factor."),
      q("ge7", "A map 1:100,000. 1 cm on paper is", ["1 m", "1 km", "100 km", "1 cm in real life"], 1, "100,000 cm = 1 km."),
      q("ge8", "Circle area is", ["2πr", "πr²", "πd", "r²"], 1, "C = 2πr. A = πr². Mixing those is the classic trap."),
    ],
  },
];
