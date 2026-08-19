// Each topic has: id, categoryId, title, readTime (minutes), vibe, body (array of paragraphs), closingFact
export const topics = [
  // ── Science & Nature ──────────────────────────────
  {
    id: 'sci-001',
    categoryId: 'science',
    title: "Why Saturn's Rings Are Disappearing",
    readTime: 4,
    vibe: 'learn',
    body: [
      "Saturn's rings aren't permanent. NASA confirmed they're being pulled into the planet by gravity as a dusty rain of ice particles, a process called 'ring rain.' At the current rate, the entire ring system will be gone in about 300 million years — a blink in cosmic time.",
      "The rings are made up of billions of chunks of ice and rock, ranging from tiny grains to pieces the size of a house. They're held in place by a delicate balance between Saturn's gravity pulling them inward and their orbital speed flinging them outward.",
      "What's tipping the scales? Ultraviolet light from the Sun and plasma clouds from micrometeorite impacts charge the ice particles, making them respond to Saturn's magnetic field lines. Those field lines funnel the particles down into the atmosphere, where they vaporize.",
      "Cassini spacecraft data showed the rings are losing material at a rate that would fill an Olympic swimming pool every 30 minutes. Some scientists now believe the rings formed only 100 million years ago — meaning dinosaurs might have looked up at a ringless Saturn."
    ],
    closingFact: "If you could somehow stand on Saturn's cloud tops, the ring rain would look like a faint, shimmering curtain falling from the sky."
  },
  {
    id: 'sci-002',
    categoryId: 'science',
    title: "Trees Talk to Each Other Underground",
    readTime: 3,
    vibe: 'fun',
    body: [
      "Beneath every forest is a hidden network. Tree roots connect to each other through fungi in a system scientists call the 'mycorrhizal network' — nicknamed the Wood Wide Web. Through this network, trees share nutrients, water, and even chemical warning signals.",
      "When a tree is attacked by insects, it can send chemical signals through the fungal network to its neighbors, prompting them to produce defensive chemicals before the bugs even arrive. Mother trees — the largest, oldest trees — actively nurture their seedlings by sending them extra carbon and nutrients through the network.",
      "The fungi get something in return: sugars that the trees produce through photosynthesis. It's a trade system that's been running for at least 450 million years, predating the dinosaurs by hundreds of millions of years."
    ],
    closingFact: "A single tree can be connected to hundreds of other trees through its fungal network, spanning an area larger than a football field."
  },

  // ── Technology & AI ───────────────────────────────
  {
    id: 'tech-001',
    categoryId: 'technology',
    title: "The First Computer Bug Was an Actual Bug",
    readTime: 3,
    vibe: 'fun',
    body: [
      "On September 9, 1947, a team at Harvard found that their Mark II computer was producing errors. After hours of investigation, they traced the problem to a moth trapped inside a relay. Grace Hopper, one of the engineers, taped the moth to the logbook with a note: 'First actual case of bug being found.'",
      "The term 'bug' for a technical glitch already existed — Thomas Edison used it as far back as 1878. But this was the first literal one. Grace Hopper went on to become one of the most influential figures in computing history, inventing the first compiler and helping develop COBOL, a language still running banking systems today.",
      "That original moth is now preserved at the Smithsonian's National Museum of American History. And 'debugging,' the process Hopper popularized, became the universal term for finding and fixing software errors."
    ],
    closingFact: "Grace Hopper was also the oldest serving officer in the US Navy when she retired at age 79. A Navy destroyer, the USS Hopper, is named after her."
  },
  {
    id: 'tech-002',
    categoryId: 'technology',
    title: "Why Your Phone Battery Dies Faster in the Cold",
    readTime: 3,
    vibe: 'practical',
    body: [
      "Your phone isn't lying — batteries genuinely perform worse in cold weather. Lithium-ion batteries work by moving lithium ions between two electrodes through a liquid electrolyte. When the temperature drops, that electrolyte gets thicker, slowing the ions down like trying to swim through honey.",
      "Below about 0°C (32°F), the internal resistance of the battery spikes. The phone's circuitry sees this as reduced capacity and may shut down even when the battery indicator shows 20-30% remaining. The charge is still there — the battery just can't deliver it fast enough.",
      "The fix? Keep your phone close to your body in a pocket when it's cold outside. Avoid charging in freezing conditions, as that can cause lithium plating — a permanent deposit of metallic lithium on the electrode that reduces battery life forever."
    ],
    closingFact: "NASA's Mars rovers use heaters to keep their batteries above -20°C. Without them, a single Martian night would kill the battery permanently."
  },

  // ── History ───────────────────────────────────────
  {
    id: 'hist-001',
    categoryId: 'history',
    title: "The City That Was Buried Twice",
    readTime: 4,
    vibe: 'learn',
    body: [
      "Pompeii is famous for being destroyed by Mount Vesuvius in 79 AD. But fewer people know it was essentially buried a second time — this time by neglect and looting after its rediscovery in 1748.",
      "When the King of Naples authorized excavations, the goal wasn't preservation — it was treasure hunting. Workers tunneled into buildings, stripped frescoes from walls, carted off statues, and left the structures to collapse. Anything deemed 'not interesting enough' was reburied.",
      "It took until the 1860s for Giuseppe Fiorelli to introduce systematic archaeology at Pompeii. He's the one who invented the technique of pouring plaster into the cavities left by decomposed bodies, creating the haunting casts that visitors see today. Each cast captures the exact position someone died in, down to the folds in their clothing.",
      "Today, about a third of Pompeii remains unexcavated. Archaeologists deliberately leave it buried — modern preservation technology isn't good enough yet, and everything exposed to air and weather is slowly deteriorating."
    ],
    closingFact: "A recently excavated snack bar in Pompeii still had traces of food in its serving pots: duck, goat, fish, and snails."
  },
  {
    id: 'hist-002',
    categoryId: 'history',
    title: "The Woman Who Sold the Eiffel Tower",
    readTime: 3,
    vibe: 'fun',
    body: [
      "In 1925, con artist Victor Lustig read a newspaper article about the Eiffel Tower being expensive to maintain. He forged government letterhead, invited six scrap metal dealers to a secret meeting at a hotel, and told them the tower was being sold for scrap.",
      "Lustig identified the most insecure dealer — André Poisson — and privately assured him the deal was real, subtly requesting a bribe to 'smooth things along.' Poisson paid both the bribe and the purchase price. By the time he realized the scam, Lustig had fled to Austria.",
      "The wildest part? Lustig came back and did it again with a new group of dealers. The second victim actually went to the police, but the story was so embarrassing that newspapers barely covered it. Lustig was eventually caught in 1935 — not for the Eiffel Tower scam, but for counterfeiting."
    ],
    closingFact: "Lustig also once scammed Al Capone out of $5,000 using a 'money-doubling machine' — and lived to tell the tale."
  },

  // ── Psychology & Mind ─────────────────────────────
  {
    id: 'psych-001',
    categoryId: 'psychology',
    title: "Why You Remember Things That Never Happened",
    readTime: 4,
    vibe: 'think',
    body: [
      "False memories are shockingly easy to create. In a landmark 1995 study, psychologist Elizabeth Loftus convinced 25% of participants that they had been lost in a shopping mall as children — an event that never happened. With each retelling, the fake memories became more vivid and detailed.",
      "Your brain doesn't store memories like a video camera. Instead, it reconstructs them each time you recall something, filling in gaps with assumptions, emotions, and information picked up after the event. Every act of remembering is an act of imagination.",
      "This is why eyewitness testimony is so unreliable. The Innocence Project found that mistaken eyewitness identification was a factor in about 69% of wrongful convictions later overturned by DNA evidence. People genuinely believed they were telling the truth.",
      "Even 'flashbulb memories' — those vivid snapshots of where you were during a major event — shift over time. Studies of people's memories of 9/11 showed significant changes within just one year, though confidence in the memories remained high."
    ],
    closingFact: "You can implant a false memory in someone in about 3 sessions of suggestive conversation. The brain genuinely cannot tell the difference between a real and constructed memory."
  },
  {
    id: 'psych-002',
    categoryId: 'psychology',
    title: "The Doorway Effect: Why You Forget Why You Walked Into a Room",
    readTime: 3,
    vibe: 'practical',
    body: [
      "It happens to everyone: you walk into a room and immediately forget why you're there. This isn't a sign of aging or absent-mindedness — it's your brain doing exactly what it's designed to do.",
      "Researchers at Notre Dame call this the 'doorway effect.' Your brain uses physical boundaries (like doorways) as 'event boundaries' that partition your experience into episodes. When you cross a threshold, your brain files away the previous episode and starts a fresh one, sometimes losing the thread of what you were doing.",
      "The effect is real and measurable. In experiments, people carrying objects through doorways were significantly worse at remembering what they were carrying compared to people who walked the same distance within a single room. Virtual doorways in video games triggered the same memory lapse."
    ],
    closingFact: "Walking back through the original doorway can sometimes trigger the lost memory because your brain re-accesses the previous 'episode.' So yes — going back to the room you started in actually works."
  },

  // ── Business & Money ──────────────────────────────
  {
    id: 'biz-001',
    categoryId: 'business',
    title: "Why IKEA Makes You Walk Through the Entire Store",
    readTime: 3,
    vibe: 'practical',
    body: [
      "IKEA's winding, one-way layout isn't bad design — it's intentional psychology. The path is called a 'forced path' or 'Gruen transfer' layout, and it's designed to expose you to the maximum number of products while creating a sense of discovery.",
      "The technique works because of the 'Gruen effect': when you're overwhelmed by sensory stimulation in a carefully designed environment, you shift from purposeful shopping to impulse browsing. You came for a bookshelf, but now you're looking at candles.",
      "IKEA also uses 'bulla bulla' — a Swedish merchandising technique where bins are intentionally filled with lots of small, cheap items piled together, creating a sense of abundance and value. Those bins near the checkout account for a massive chunk of revenue."
    ],
    closingFact: "IKEA sells about 150 million meatballs per year. The restaurant isn't a side feature — it's a strategic tool to keep you in the store longer."
  },
  {
    id: 'biz-002',
    categoryId: 'business',
    title: "The Psychology Behind 'Free Shipping Over $50'",
    readTime: 3,
    vibe: 'think',
    body: [
      "You've done it: your cart is at $38, so you add a $15 item you don't need to get free shipping. You just spent $15 to save $6 on shipping. Retailers know this math doesn't work in your favor — and they're counting on it.",
      "The free shipping threshold is calibrated using data on average order values. If the average order is $40, the threshold gets set at $50-60 — just high enough to push you to add something, but not so high you abandon the cart entirely.",
      "Amazon's Prime membership took this a step further by removing the per-order calculation entirely. Once you've paid the annual fee, 'free' shipping feels like a reward for every order, which increases purchase frequency by an average of 40%. The shipping isn't free — you prepaid for it."
    ],
    closingFact: "Studies show that 'Free shipping' is more motivating than an equivalent discount. Getting $6.99 shipping free feels better than getting $6.99 off the product price, even though the result is identical."
  },

  // ── Health & Body ─────────────────────────────────
  {
    id: 'health-001',
    categoryId: 'health',
    title: "Why Your Eyes Twitch (And When to Worry)",
    readTime: 3,
    vibe: 'practical',
    body: [
      "That random eyelid twitch — called myokymia — is almost always harmless. It's caused by involuntary firing of the orbicularis oculi muscle, usually triggered by fatigue, stress, caffeine, or staring at screens too long.",
      "The twitch feels dramatic from the inside, but if you look in a mirror, you'll barely see anything. That's because the movement is incredibly small — usually less than a millimeter. Most episodes last a few seconds to a few minutes and resolve on their own.",
      "The fix is boring but effective: sleep more, cut back on caffeine, reduce screen time, and manage stress. If a twitch persists for more than a few weeks, spreads to other parts of your face, or causes your eye to close completely, that's when you should see a doctor — those are signs of different, less common conditions."
    ],
    closingFact: "Your eyes twitch more on your dominant side. If you're right-handed, your right eye is statistically more likely to twitch."
  },
  {
    id: 'health-002',
    categoryId: 'health',
    title: "The 2-Minute Rule for Building Any Habit",
    readTime: 3,
    vibe: 'practical',
    body: [
      "Most habit-building advice fails because it asks too much too soon. James Clear's '2-Minute Rule' flips the script: when you start a new habit, it should take less than two minutes to do. Want to read more? Just read one page. Want to exercise? Just put on your shoes.",
      "The point isn't the activity — it's the identity. Each time you read one page, you're casting a vote for being 'a reader.' Each time you put on your running shoes, you're reinforcing 'I'm someone who exercises.' The behavior follows the identity, not the other way around.",
      "Once the 2-minute version is automatic (usually 2-3 weeks), you naturally expand. One page becomes a chapter. Putting on shoes becomes a 10-minute walk. The gateway habit pulls you into the full behavior because you've already started — and starting is the hardest part."
    ],
    closingFact: "Stanford researcher BJ Fogg found that 'flossing one tooth' was the most effective gateway habit for building a full flossing routine. The absurd simplicity is the point."
  },

  // ── Art & Design ──────────────────────────────────
  {
    id: 'art-001',
    categoryId: 'art',
    title: "Why the Mona Lisa Became the World's Most Famous Painting",
    readTime: 4,
    vibe: 'learn',
    body: [
      "The Mona Lisa wasn't always famous. For centuries, it was considered a good painting — not a great one. Art historians ranked it below many of Leonardo's other works. What changed everything was a theft.",
      "On August 21, 1911, Italian handyman Vincenzo Peruggia walked into the Louvre, lifted the painting off the wall, hid it under his coat, and walked out. The theft made international headlines for weeks. Newspapers ran the story daily. The empty wall where the painting had hung became a tourist attraction itself — people came to see where it wasn't.",
      "When the painting was recovered two years later, it went on a tour that drew massive crowds. The theft had turned it into a celebrity. From that point, the Mona Lisa's fame became self-reinforcing: it's famous because it's famous.",
      "Leonardo's technique is genuinely remarkable — the sfumato shading, the ambiguous expression, the atmospheric perspective. But dozens of Renaissance paintings have similar technical brilliance. The Mona Lisa got something the others didn't: a crime story."
    ],
    closingFact: "The Mona Lisa has its own mailbox at the Louvre. It receives fan letters, love notes, and even flowers from visitors."
  },
  {
    id: 'art-002',
    categoryId: 'art',
    title: "Why Red Is the Most Powerful Color",
    readTime: 3,
    vibe: 'think',
    body: [
      "Red is the first color humans named. In every language studied by linguists Berlin and Kay, if a language has only two color terms, they're always black/white. If it has three, the third is always red. No exceptions across all documented languages.",
      "The reason is likely biological: red is the color of blood, fire, and ripe fruit — all critical survival signals. Our eyes are more sensitive to red wavelengths than any other color. Babies can distinguish red before they can see blue or green.",
      "This deep wiring shows up everywhere in modern life. Red cars get more speeding tickets (drivers subconsciously drive them faster). Sports teams wearing red win more often in combat sports. Red price tags trigger faster purchasing decisions than any other color."
    ],
    closingFact: "Matadors' capes don't need to be red — bulls are colorblind to red. The cape is red so the audience can see the blood splatter less."
  },

  // ── Philosophy ────────────────────────────────────
  {
    id: 'phil-001',
    categoryId: 'philosophy',
    title: "The Ship of Theseus: Are You the Same Person You Were 10 Years Ago?",
    readTime: 4,
    vibe: 'think',
    body: [
      "The ancient Greeks asked: if you replace every plank on a ship one at a time, is it still the same ship? And if you build a new ship from all the old planks, which one is the 'real' Ship of Theseus?",
      "Your body faces the same question. Most of your cells are replaced every 7-10 years. Your skeleton is entirely new every decade. Your skin replaces itself every 2-4 weeks. Your stomach lining, every few days. Physically, you share almost no atoms with the person you were a decade ago.",
      "But it gets stranger. Your memories — the thing most people would say makes them 'them' — are also constantly being rewritten. Each time you recall something, your brain reconstructs and subtly alters it. The memory you have of your 10th birthday is not the original memory. It's a copy of a copy of a copy.",
      "So what makes you 'you'? Philosophers split into camps: some say it's continuity of consciousness (the unbroken stream of experience), others say it's psychological connectedness (your current self is connected to past selves through chains of memory and intention). There's no settled answer."
    ],
    closingFact: "Thomas Hobbes extended the paradox: what if someone follows behind the ship, collecting every replaced plank, and builds a second ship? Which one is the original?"
  },
  {
    id: 'phil-002',
    categoryId: 'philosophy',
    title: "Why We Buy Things We Don't Need (and Epicurus Knew Why)",
    readTime: 3,
    vibe: 'practical',
    body: [
      "Epicurus, the Greek philosopher born in 341 BC, is often misquoted as a hedonist who wanted endless pleasure. He actually argued the opposite: most of what people chase — luxury, status, excess — actively makes them less happy.",
      "He divided human desires into three categories: natural and necessary (food, shelter, friendship), natural but unnecessary (fancy food, big houses), and neither natural nor necessary (fame, power, wealth). Unhappiness, he argued, comes from confusing the categories — treating unnecessary desires as if they were essential.",
      "Modern psychology backs him up. Studies on 'hedonic adaptation' show that lottery winners return to their baseline happiness within months. The thrill of a new purchase fades in days. But strong friendships, freedom from anxiety, and time for reflection — Epicurus's essentials — consistently correlate with lasting well-being."
    ],
    closingFact: "Epicurus lived in a small garden commune with friends, eating simple meals. His school was called 'The Garden' and was one of the first to admit women and enslaved people as students."
  },

  // ── World & Society ───────────────────────────────
  {
    id: 'world-001',
    categoryId: 'world',
    title: "The Country That Banned Homework",
    readTime: 3,
    vibe: 'fun',
    body: [
      "Finland consistently ranks among the top countries in global education — and its students get almost no homework. Finnish kids start school at age 7, have the shortest school days in the developed world, and spend more time at recess than in most other countries.",
      "The Finnish model is built on trust: trust in teachers (who are required to have a master's degree), trust in students (minimal standardized testing), and trust that play and rest are as important as study. There's no competition between schools because there are no school rankings.",
      "The results speak clearly. Finnish 15-year-olds consistently outperform students from countries with longer school hours, more homework, and intense testing regimes. The gap is especially large in reading and science, where Finland frequently ranks in the top 5 globally."
    ],
    closingFact: "In Finland, teachers are selected from the top 10% of graduates. Teaching is considered as prestigious as medicine or law."
  },
  {
    id: 'world-002',
    categoryId: 'world',
    title: "Why Japan Has So Many Vending Machines",
    readTime: 3,
    vibe: 'fun',
    body: [
      "Japan has roughly 5 million vending machines — about one for every 23 people. That's the highest density in the world. You can buy not just drinks, but eggs, rice, ramen, flowers, umbrellas, surgical masks, and even Buddhist charms.",
      "Three factors explain the density: extremely low crime rates (vandalism and theft are negligible), high labor costs (machines are cheaper than staff), and a culture that values convenience and efficiency. Vending machines fill the gap in areas where a convenience store isn't practical.",
      "Japanese vending machines are also weirdly advanced. Many use facial recognition to suggest drinks based on your estimated age and gender. They switch between hot and cold beverages seasonally. Some serve as emergency information displays during earthquakes and connect to Wi-Fi networks."
    ],
    closingFact: "After the 2011 earthquake and tsunami, Japanese vending machine operators opened their machines for free to help survivors access drinks and food."
  },

  // ── Food & Travel ─────────────────────────────────
  {
    id: 'food-001',
    categoryId: 'food',
    title: "Why Airplane Food Tastes Bad (It's Not the Chef's Fault)",
    readTime: 3,
    vibe: 'learn',
    body: [
      "At 35,000 feet, your sense of taste drops by about 30%. The low humidity (around 12%, drier than most deserts) dries out your nasal passages, and the low cabin pressure reduces your ability to detect sweet and salty flavors. Your tongue literally works differently at altitude.",
      "Airlines compensate by overseasoning food with extra salt, sugar, and umami flavors. Tomato juice is weirdly popular on planes precisely because umami perception is one of the few taste dimensions that isn't diminished by altitude — it's actually enhanced. Lufthansa serves more tomato juice than beer.",
      "The noise also matters. Researchers at Cornell found that loud engine noise (around 85 decibels) further suppresses sweet taste perception while boosting umami sensitivity. So the constant drone of the engines is literally changing what your food tastes like."
    ],
    closingFact: "Singapore Airlines has a dedicated chef who taste-tests every dish in a pressurized simulator at altitude before it goes on the menu."
  },
  {
    id: 'food-002',
    categoryId: 'food',
    title: "The Island Where People Forget to Die",
    readTime: 4,
    vibe: 'learn',
    body: [
      "Ikaria, a small Greek island in the Aegean Sea, has one of the highest concentrations of people over 90 in the world. Residents are four times more likely to reach 90 than Americans, with significantly lower rates of cancer, heart disease, and dementia.",
      "There's no single magic ingredient — it's a lifestyle. Ikarians eat a Mediterranean diet rich in greens, olive oil, and herbal teas made from local herbs (rosemary, sage, oregano) that are packed with antioxidants. They drink moderate amounts of local wine. They nap almost every day.",
      "But the social structure might matter most. Ikarians have strong community bonds, no concept of retirement (people stay active and productive into their 90s), and a relaxed attitude toward time — clocks and schedules are treated as suggestions. Chronic stress, which accelerates aging, barely exists.",
      "Researcher Dan Buettner identified Ikaria as one of five 'Blue Zones' — regions where people live measurably longer. The common thread across all Blue Zones isn't diet or exercise specifically. It's belonging: strong social networks, sense of purpose, and daily routines that naturally incorporate movement."
    ],
    closingFact: "One Ikarian man, Stamatis Moraitis, was diagnosed with terminal lung cancer in 1976 and given 9 months to live. He moved back to Ikaria to die. He lived another 45 years."
  },

  // ── Sports ────────────────────────────────────────
  {
    id: 'sport-001',
    categoryId: 'sports',
    title: "Why Marathon Runners Hit 'The Wall' at Mile 20",
    readTime: 3,
    vibe: 'learn',
    body: [
      "Almost every marathon runner describes the same experience: around mile 20 (32 km), running suddenly becomes dramatically harder. Your legs feel like concrete. Your pace drops. Your brain starts negotiating with you to stop. This is 'the wall,' and it has a precise biological cause.",
      "Your body stores about 2,000 calories of glycogen (quick-access energy) in your muscles and liver. At marathon pace, you burn roughly 100 calories per mile. Do the math: around mile 20, your glycogen tanks hit empty. Your body has to switch to burning fat, which is a slower, less efficient process.",
      "The mental collapse is real too. When glycogen drops, your brain — which runs almost entirely on glucose — starts sending distress signals. The pain, despair, and urge to quit aren't just physical fatigue. They're your brain rationing its own fuel supply."
    ],
    closingFact: "Elite runners train their bodies to burn fat earlier in a race, effectively pushing 'the wall' back. Some ultra-marathon runners can run for 24+ hours by becoming extremely efficient fat burners."
  },
  {
    id: 'sport-002',
    categoryId: 'sports',
    title: "The Athlete Who Won Olympic Gold With a Broken Neck",
    readTime: 3,
    vibe: 'fun',
    body: [
      "In the 1956 Melbourne Olympics, Soviet gymnast Larysa Latynina competed with a hairline fracture in her vertebra. She won gold. Over her career, she collected 18 Olympic medals — a record that stood for 48 years until Michael Phelps broke it in 2012.",
      "But the most jaw-dropping Olympic injury story belongs to Japanese gymnast Shun Fujimoto at the 1976 Montreal Games. During the floor exercise, he broke his kneecap. He told no one. He then performed on the pommel horse and rings — dismounting from 8 feet in the air and landing on his broken knee. He scored a 9.7.",
      "When asked why he didn't withdraw, Fujimoto said the Japanese team was in a tight race with the Soviets, and his withdrawal would have cost them the gold. Japan won by 0.4 points. Fujimoto never competed again — the landing caused permanent damage."
    ],
    closingFact: "Doctors later said that if Fujimoto's kneecap had shifted even slightly during his rings dismount, he could have lost the ability to walk permanently."
  },

  // ── Entertainment ─────────────────────────────────
  {
    id: 'ent-001',
    categoryId: 'entertainment',
    title: "Why Pixar Movies Make Adults Cry",
    readTime: 3,
    vibe: 'think',
    body: [
      "Pixar doesn't make you cry by accident. The studio follows a specific emotional architecture: they spend the first act building a world you care about, the second act threatening it, and the third act making you earn the resolution. The tears come from relief as much as sadness.",
      "The opening of 'Up' — the 4-minute wordless montage of Carl and Ellie's life together — works because it compresses an entire lifetime into a series of small, universal moments: shared meals, painting a nursery, failed pregnancy, growing old. No dialogue, no exposition. Just recognition.",
      "Pixar's co-founder Ed Catmull has said the studio's real secret is not avoiding failure, but failing fast and early. Every Pixar movie goes through periods where the story fundamentally doesn't work. 'Inside Out' was rewritten from scratch halfway through production when they realized the original version wasn't landing emotionally."
    ],
    closingFact: "The opening montage of 'Up' was storyboarded in a single afternoon by a team of four artists. It went through almost no revisions — one of the only sequences in Pixar history that worked on the first try."
  },
  {
    id: 'ent-002',
    categoryId: 'entertainment',
    title: "The Video Game That Took 15 Years to Make",
    readTime: 3,
    vibe: 'fun',
    body: [
      "Duke Nukem Forever was announced in 1997 and released in 2011 — a 15-year development cycle that became the gaming industry's most famous punchline. The game changed engines three times, switched studios, survived a lawsuit, and was declared dead multiple times.",
      "The core problem was perfectionism mixed with chasing trends. Every time a new game raised the bar (Half-Life 2, Halo, Call of Duty), the team would scrap work and start over to keep up. The project became a black hole of feature creep.",
      "When it finally launched, reviews were brutal. The game that took 15 years to make felt like it was designed in 2004. The lesson the industry took away: shipping something good is better than endlessly chasing perfection. 'Perfect is the enemy of done' became a mantra."
    ],
    closingFact: "The Guinness World Record for longest development time for a video game initially went to Duke Nukem Forever. It has since been broken by several games that are still in development."
  },
];
