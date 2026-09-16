import type { Lesson } from "../types";
import { diagramFigure } from "../figures";

export const mathsLessons: Lesson[] = [
  {
    id: "number-sense-essentials",
    domainId: "number-sense",
    title: "Feel the size of a number",
    minutes: 12,
    intro:
      "Number sense is not speed-times-tables. It is knowing whether 47 × 19 should land near 900 or near 9,000 before you touch a calculator. Estimation, place value, and order of operations are the same skill: keep the digits in the rooms they belong.",
    figure: diagramFigure(
      "number-line",
      "Number line from 0 to 4 with a mark at one half, labelled as the same tick as 0.5.",
      "Places are rooms. 1/2 and 0.5 share a tick; 1/2 + 1/3 is not “2/5”.",
    ),
    sections: [
      {
        heading: "Place value is an address",
        paragraphs: [
          "The digit 7 in 7, 70, and 0.7 is the same mark with three jobs. In 706, the 7 is seven hundreds — not “seven at the front.” If you line numbers up to add, you are lining up places, not left edges.",
          "A number like 3.04 is three ones and four hundredths. The zero is not decoration; it holds the tenths chair empty. Drop it and you have 3.4, which is ten times larger in the fractional part.",
        ],
        callout: {
          type: "tip",
          text: "Say the place out loud: “three and four hundredths.” If you cannot name the place, you are guessing the size.",
        },
      },
      {
        heading: "Estimate before you compute",
        paragraphs: [
          "Round to one or two friendly digits, do the easy sum, then ask: is the exact answer allowed to wander far? 198 × 6 is near 200 × 6 = 1,200. If your exact work spits out 118, a place fell off.",
          "On a receipt, estimation is a lie detector. Four coffees at $4.80 is not $192. It is near 5 × 4 = $20. GST later. The wild error is almost always a decimal in the wrong room.",
        ],
        bullets: [
          "Round to a nearby 10, 100, or 1.",
          "Do the easy version.",
          "Compute exactly.",
          "Ask whether exact and estimate still live in the same neighbourhood.",
        ],
      },
      {
        heading: "Order of operations is a queue, not a vibe",
        paragraphs: [
          "Brackets first, then powers, then multiply and divide left to right, then add and subtract left to right. People remember BODMAS/PEMDAS and still add before they multiply because the + sign feels friendly.",
          "3 + 4 × 5 is 23, not 35. The 4 × 5 is a packet. You do not open the packet until the multiply is done. Calculators that look cheap sometimes do left-to-right only — know yours.",
        ],
        table: {
          headers: ["Expression", "What to do"],
          rows: [
            ["3 + 4 × 5", "Multiply first → 3 + 20 = 23"],
            ["(3 + 4) × 5", "Brackets first → 7 × 5 = 35"],
            ["12 ÷ 3 × 2", "Left to right → 4 × 2 = 8"],
            ["2³ × 3", "Power first → 8 × 3 = 24"],
          ],
        },
        callout: {
          type: "watch",
          text: "Division and multiplication are the same priority. Do not always “do the × before the ÷.” Left to right.",
        },
      },
      {
        heading: "Negative numbers are a direction",
        paragraphs: [
          "A negative is not “a small positive.” It is the other way on a number line. −3 °C in Canberra is colder than 0, not a temperature that forgot its minus. Subtracting a negative is adding: you reversed a reverse.",
          "Bank overdrafts, elevations below sea level, and “I owe you” are the same model. Keep the sign glued to the number until the operation is finished.",
        ],
      },
    ],
    keyTakeaways: [
      "A digit’s job is its place, not its looks.",
      "Estimate first; the exact answer must live nearby.",
      "Multiply/divide before add/subtract; same-priority ops run left to right.",
      "A minus is a direction. Subtracting a negative flips it to add.",
    ],
  },
  {
    id: "fractions-essentials",
    domainId: "fractions",
    title: "Same pizza, different cuts",
    minutes: 14,
    intro:
      "A fraction is a division written as a stack. The denominator names the size of the piece. The numerator counts how many of those pieces you have. Once that picture is solid, adding unlike fractions stops being a luck spell.",
    sections: [
      {
        heading: "What the two numbers actually mean",
        paragraphs: [
          "3/4 is three pieces when the whole was cut into four equal parts. Equal is the word that does the work. Three-quarters of a 2-litre bottle is not three-quarters of a teaspoon.",
          "A fraction bigger than 1 is allowed. 7/4 is one whole and three-quarters. Improper is a style of writing, not a crime.",
        ],
        callout: {
          type: "tip",
          text: "Read 3/4 as “three of the fourths,” not “three over four” as if they were unrelated.",
        },
      },
      {
        heading: "Equivalent fractions are the same amount",
        paragraphs: [
          "2/4 is 1/2 because you cut every piece in half and took twice as many. Multiply (or divide) top and bottom by the same non-zero number and the value does not move. That is the only legal way to rename a fraction.",
          "Simplifying is the same idea in reverse. 12/18 ÷ 6/6 = 2/3. You are not making it smaller. You are writing the same pile with fewer digits.",
        ],
        table: {
          headers: ["Fraction", "Twin"],
          rows: [
            ["1/2", "2/4, 3/6, 50/100"],
            ["2/3", "4/6, 8/12"],
            ["3/4", "6/8, 75/100"],
            ["5/1", "5"],
          ],
        },
      },
      {
        heading: "Adding needs a common cut",
        paragraphs: [
          "1/2 + 1/3 is not 2/5. You cannot add pieces of different sizes any more than you can add 1 hour to 1 minute and call it 2. Rename both with a common denominator — 6 works — then add the numerators: 3/6 + 2/6 = 5/6.",
          "Subtraction is the same rule. Multiplication is easier than people fear: multiply tops, multiply bottoms. 2/3 × 3/4 = 6/12 = 1/2. You took two-thirds of three-quarters.",
        ],
        bullets: [
          "Rename to the same denominator.",
          "Add or subtract the numerators only.",
          "Simplify if a common factor is sitting there grinning.",
        ],
      },
      {
        heading: "Division is “how many of these fit”",
        paragraphs: [
          "1 ÷ 1/4 asks how many quarters fit in a whole: 4. The shortcut “keep, change, flip” is invert-and-multiply: 1 × 4/1 = 4. It is not a superstition. You are asking for the number of those sized pieces.",
          "A mixed number is a whole plus a fraction. Convert to improper before you multiply: 1½ = 3/2. Then proceed.",
        ],
        callout: {
          type: "watch",
          text: "Never add denominators. They name the cut. Adding 2 and 3 because you saw 1/2 + 1/3 is the classic trap.",
        },
      },
    ],
    keyTakeaways: [
      "Denominator = piece size. Numerator = how many pieces.",
      "Rename by multiplying or dividing top and bottom by the same number.",
      "Add and subtract only after a common denominator.",
      "Dividing by a fraction is multiplying by its reciprocal.",
    ],
  },
  {
    id: "percentages-essentials",
    domainId: "percentages",
    title: "Per hundred, then the till",
    minutes: 13,
    intro:
      "Percent means per hundred. 17% is 17/100, which is 0.17. Once you treat “of” as multiply, discounts, GST, and “what percent is this of that” stop being three different sports.",
    sections: [
      {
        heading: "Percent, decimal, fraction — same clothes",
        paragraphs: [
          "25% = 0.25 = 1/4. 10% = 0.1 = 1/10. 1% is one hundredth, so 1% of $80 is $0.80. Mental 10% is “move the point one place left.” 5% is half of that. 15% is 10% plus 5%.",
          "Australia’s GST is 10% on most goods. A $55 item with GST included has $5 of GST sitting inside it, not $5.50 added on top. Inclusive vs exclusive is the whole fight.",
        ],
        table: {
          headers: ["Percent", "As a decimal"],
          rows: [
            ["10%", "0.10"],
            ["15%", "0.15"],
            ["20%", "0.20"],
            ["50%", "0.50"],
            ["100%", "1"],
            ["150%", "1.50"],
          ],
        },
      },
      {
        heading: "“Of” means multiply",
        paragraphs: [
          "20% of 80 is 0.2 × 80 = 16. Increase 80 by 20% is 80 × 1.20 = 96. Decrease by 20% is 80 × 0.80 = 64. The multiplier is 1 plus-or-minus the rate.",
          "A 20% discount then another 20% off is not 40% off. Second discount hits the already-reduced price: 0.8 × 0.8 = 0.64, so 36% off all up. Shops love that confusion.",
        ],
        callout: {
          type: "exam",
          text: "Successive percentages multiply. They do not add unless someone is being sloppy on purpose.",
        },
      },
      {
        heading: "Finding the original",
        paragraphs: [
          "If a jumper is $64 after 20% off, that $64 is 80% of the original. Original = 64 ÷ 0.8 = $80. Dividing by the multiplier undoes the change.",
          "“What percent is 18 of 24?” is 18 ÷ 24 × 100 = 75%. Part divided by whole, then × 100. Which number is the whole is the only judgement call.",
        ],
      },
      {
        heading: "Word problems are just a story around of",
        paragraphs: [
          "A team won 12 of 20 games. Win rate 60%. Interest, tips, and “marked up 30% then discounted 10%” are still multiply, then maybe multiply again. Draw the start amount, write the multiplier, go.",
          "If a number went from 50 to 65, the change is +15, which is 15/50 = 30% increase. Percent change uses the start as the whole, not the end.",
        ],
        bullets: [
          "Name the start amount.",
          "Write the multiplier (1.1 for +10%, 0.75 for −25%).",
          "Multiply. If you need the original, divide by the multiplier.",
        ],
      },
    ],
    keyTakeaways: [
      "Percent is hundredths. 10% is a one-place shift.",
      "“Of” = multiply. Increase uses 1 + rate.",
      "GST-inclusive 10% means the price is 110% of the pre-GST amount.",
      "Percent change divides by the original, not the new value.",
    ],
  },
  {
    id: "algebra-foundations-essentials",
    domainId: "algebra-foundations",
    title: "Keep both sides honest",
    minutes: 14,
    intro:
      "Algebra is a pair of scales. Whatever you do to one side, you do to the other, because the equals sign is a claim that two piles weigh the same. Letters are numbers that have not introduced themselves yet — not a different species.",
    sections: [
      {
        heading: "An equation is a balance",
        paragraphs: [
          "x + 7 = 20 says a mystery plus seven equals twenty. Subtract 7 from both sides: x = 13. You are not “moving the 7 and flipping the sign” as a magic trick. You are undoing the +7 on both piles.",
          "If you only subtract from the left, the claim breaks. The two sides were equal; they must stay equal.",
        ],
        callout: {
          type: "tip",
          text: "Name the operation glued to x, then undo it on both sides. + undoes with −. × undoes with ÷.",
        },
      },
      {
        heading: "Like terms and the silent 1",
        paragraphs: [
          "3x means 3 lots of x. x means 1x. 3x + 2x = 5x because they are the same unit. 3x + 2 is not 5x — that is adding apples to a crate count. You can only fold terms that match.",
          "Distribute: 3(x + 4) = 3x + 12. The 3 hits both residents of the bracket. Forgetting the 4 is the usual leak.",
        ],
        table: {
          headers: ["Write this", "As"],
          rows: [
            ["x + x + x", "3x"],
            ["3(x + 2)", "3x + 6"],
            ["2x − x", "x"],
            ["x / 5", "(1/5)x"],
          ],
        },
      },
      {
        heading: "Two-step and the trap of dividing too early",
        paragraphs: [
          "2x + 6 = 20. Undo add first: 2x = 14, then x = 7. If you divide by 2 first you must divide every term: x + 3 = 10, still x = 7. Both legal. Mixing them — dividing only the 2x — is not.",
          "A word problem is an equation in costume. “I think of a number, double it, add 5, get 21” is 2n + 5 = 21. Translate, then balance.",
        ],
      },
      {
        heading: "Inequalities keep the same idea, mostly",
        paragraphs: [
          "x + 3 > 10 → x > 7. The scale is still honest. Multiply or divide both sides by a negative and the inequality sign flips: −2x > 8 → x < −4. You turned the number line around.",
          "You do not need that every day in Year 8, but it stops the “just move it” reflex from lying to you later.",
        ],
        callout: {
          type: "watch",
          text: "Check by substituting. If x = 7 in 2x + 6 = 20, you get 20 = 20. If not, you dropped a term.",
        },
      },
    ],
    keyTakeaways: [
      "Equals means the two sides weigh the same.",
      "Undo operations on both sides, not one.",
      "Only like terms combine. Distribute to every term in the bracket.",
      "Plug the answer back in. Algebra without a check is a rumour.",
    ],
  },
  {
    id: "geometry-measure-essentials",
    domainId: "geometry-measure",
    title: "Shape with a reason",
    minutes: 13,
    intro:
      "Geometry is not naming triangles for sport. It is knowing why a rectangle’s area is base × height, why a straight line is 180°, and why a 3-4-5 triangle is a builder’s friend. Measure first, formula second.",
    sections: [
      {
        heading: "Angles that have to add up",
        paragraphs: [
          "A full turn is 360°. A straight line is 180°. A right angle is 90°. If two angles sit on a straight line, they are supplementary — they add to 180. Vertically opposite angles (the X made by two crossing lines) are equal. That is not a style choice. The lines force it.",
          "A triangle’s interior angles add to 180°. If you know two, the third is not a mystery. Equilateral: all 60°. Right-angled: the other two add to 90°.",
        ],
        table: {
          headers: ["Fact", "Measure"],
          rows: [
            ["Full turn", "360°"],
            ["Straight line", "180°"],
            ["Right angle", "90°"],
            ["Triangle sum", "180°"],
          ],
        },
      },
      {
        heading: "Area is covering, perimeter is wrapping",
        paragraphs: [
          "Perimeter is the fence. Area is the grass. A 4 by 6 rectangle has perimeter 20 and area 24. Doubling every side doubles the fence but quadruples the grass — scale is sneaky.",
          "Triangle area is half a rectangle: ½ × base × height, and the height is perpendicular to the base, not whichever slant looks tall. Circle: C = 2πr, A = πr². Radius is centre to edge. Diameter is twice that.",
        ],
        callout: {
          type: "tip",
          text: "Units: cm vs cm². If someone reports area in centimetres, they have wrapped the paddock instead of covering it.",
        },
      },
      {
        heading: "Pythagoras is a right-angle test",
        paragraphs: [
          "On a right triangle, a² + b² = c², where c is the hypotenuse — the side opposite the right angle, the longest. 3-4-5 and 5-12-13 are whole-number families. A 6 m and 8 m garden bed has a 10 m diagonal. If it does not, the corner is not square.",
          "If a² + b² is not c², it is not right-angled. Builders still pull diagonals of a rectangle to check this.",
        ],
      },
      {
        heading: "Scale drawings and similar shapes",
        paragraphs: [
          "Similar shapes have the same angles and sides in proportion. A map at 1:100,000 means 1 cm on paper is 1 km in the paddock (because 100,000 cm = 1 km). Multiply by the scale factor; do not add it.",
          "If a model is 1/20 of the real boat, lengths × 20. Areas × 20². Volumes × 20³. That last one is why a “twice as tall” tank is eight times the water.",
        ],
        bullets: [
          "1. Check it is a right angle (or that you need one).",
          "2. Name the hypotenuse.",
          "3. Square, add, square-root — or square, subtract, square-root if a leg is missing.",
        ],
      },
    ],
    keyTakeaways: [
      "Straight line 180°, triangle 180°, full turn 360°.",
      "Perimeter fences; area covers. Height is perpendicular.",
      "a² + b² = c² only for right triangles; c is the hypotenuse.",
      "Scale multiplies lengths. Area scales by the square, volume by the cube.",
    ],
  },
];
