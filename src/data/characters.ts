
export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  abilities: string[];
  relatedStory: string;
}

export const characters: Character[] = [
  {
    id: "the-kid",
    name: "The Kid (The Videogamer)",
    role: "Protagonist",
    description: "A college student with extraordinary guts but little physical potential. Despite being isolated and having few friends, he possesses a peculiar gaming-related superpower that allows him to change reality through video games.",
    abilities: [
      "Reality manipulation through video games",
      "Quick-save/quick-load in real situations",
      "Game mechanic utilization in real world",
      "Remarkable persistence"
    ],
    relatedStory: "videogamer-1"
  },
  {
    id: "evil-videogamer",
    name: "The Evil Videogamer",
    role: "Antagonist",
    description: "An alternate timeline version of the Kid who has discovered and mastered his powers. He rules over a dimensional city where he keeps people as slaves.",
    abilities: [
      "Advanced gaming powers",
      "Reality manipulation",
      "Dimensional travel",
      "Power enhancement through serums"
    ],
    relatedStory: "videogamer-1"
  },
  {
    id: "ai-drone",
    name: "AI Drone",
    role: "Supporting Character",
    description: "Created by an archaeologist to find and help the Kid. It contains all the research about the ancient powers and seeks to prevent the Variant from stealing the Kid's abilities.",
    abilities: [
      "Advanced AI capabilities",
      "Research database storage",
      "Flight and tracking",
      "Communication"
    ],
    relatedStory: "videogamer-1"
  },
  {
    id: "archaeologist",
    name: "The Archaeologist",
    role: "Supporting Character",
    description: "A researcher who discovered the ancient texts about the powers bestowed by the saint. He created the AI drone as a backup when he was captured by the Variant.",
    abilities: [
      "Historical research expertise",
      "Advanced technology creation",
      "Pattern recognition"
    ],
    relatedStory: "videogamer-1"
  },
  {
    id: "infatuator",
    name: "Kid's Ex (The Infatuator)",
    role: "Antagonist",
    description: "Originally a girl who bullied someone with powers, she was cursed to become a ghost that absorbs powers from apprentices. Her castle appears normal from the outside but contains a realm as large as a city inside.",
    abilities: [
      "Infatuation induction",
      "Reality manipulation",
      "Power absorption",
      "Dimensional space control"
    ],
    relatedStory: "videogamer-2"
  },
  {
    id: "the-creator",
    name: "The Creator",
    role: "Mysterious Entity",
    description: "The powerful being who granted powers to the first saint. He has the ability to bestow and revoke powers, and occasionally intervenes when the powers are being misused.",
    abilities: [
      "Power bestowal",
      "Power removal",
      "Timeline manipulation",
      "Resurrection"
    ],
    relatedStory: "videogamer-3"
  },
  {
    id: "aryansh",
    name: "Aryansh (The Racingcode)",
    role: "Antagonist",
    description: "A famous awarded writer who possesses unique powers. His abilities allow him to program and alter the timeline's simulation, effectively changing reality through code.",
    abilities: [
      "Timeline programming",
      "Reality code manipulation",
      "Simulation control",
      "World alteration"
    ],
    relatedStory: "videogamer-3"
  },
  {
    id: "bully-girl",
    name: "Bully Senior Girl",
    role: "Antagonist",
    description: "The daughter of a minister who made a vlog of the Kid's fight against zombies. Her unofficial documentation of the events angered the Creator, leading him to temporarily revoke the Kid's powers. Despite initially being a bully, her life was saved by the Kid's selfless sacrifice.",
    abilities: [
      "Vlogging and documentation",
      "Political connections",
      "Resourcefulness",
      "Survival instinct"
    ],
    relatedStory: "videogamer-3"
  },
  {
    id: "atom",
    name: "Atom (The Pyscho)",
    role: "Protagonist",
    description: "A college student who was once a mathematics and science topper. Introverted and sometimes perceived as arrogant, he sacrificed himself in the White Room to help his former classmate escape, only to be granted supernatural powers after death. Following the MINI COLLAB incident, he suffers from relentless nightmares and guilt over the deaths he believes he caused. His powers have evolved to include memory projection and the ability to absorb abilities from other power lineages through confrontation.",
    abilities: [
      "Creating white room battle dimensions",
      "Teleportation of targets into the white room",
      "Memory projection and sharing",
      "Self-sacrifice capability",
      "Tactical thinking under pressure",
      "Power absorption through truth confrontation",
      "Dark room manifestation (courtroom-like dimension)"
    ],
    relatedStory: "atom-1"
  },
  {
    id: "pandey",
    name: "Pandey",
    role: "Supporting Character",
    description: "Atom's former classmate and competitive rival. After being trapped in the White Room with Atom, she reluctantly survived by accepting his sacrifice, using his remains to escape the dimension. Later placed in mental health care after the traumatic experience.",
    abilities: [
      "Survival instinct",
      "Adaptability",
      "Mental resilience",
      "Problem-solving under extreme conditions"
    ],
    relatedStory: "atom-1"
  },
  {
    id: "pushp",
    name: "Pushp",
    role: "Supporting Character",
    description: "A prisoner who witnessed Atom's powers firsthand when Atom shared his memories. Initially resistant, he was compelled to help Atom train his abilities after being threatened. He later vouched for Atom's powers to authorities, helping to get his case reopened.",
    abilities: [
      "Adaptability under pressure",
      "Witnessing supernatural phenomena",
      "Persuasion skills",
      "Survival instinct"
    ],
    relatedStory: "atom-2"
  },
  {
    id: "origin-psycho",
    name: "Origin Psycho (The White Room Master)",
    role: "Antagonist",
    description: "The original mastermind behind the White Room dimension and the brother of the Origin Lawyer. He possessed the power to force people into deadly battles within his white room dimension until one died. After witnessing Atom's sacrifice, he granted his powers to Atom before being killed by him. His philosophy of using power through force and domination opposed his sister's belief in truth and justice. Their ideological split created two opposing power lineages that would later clash through their successors.",
    abilities: [
      "White Room creation and control",
      "Forced battle initiation",
      "Dimensional manipulation",
      "Power bestowal",
      "Death-based power activation"
    ],
    relatedStory: "atom-1"
  },
  {
    id: "kusam",
    name: "Kusam (The Lawyer)",
    role: "Antagonist",
    description: "An NRI student who enrolled in Atom's college batch after her family perished in the MINI COLLAB disaster. Initially appearing as a fellow survivor seeking connection, she was actually the heir to the Origin Lawyer's powers, passed down through her grandmother's spirit. She spent months observing and getting close to Atom as part of a long-term plan to either force him to stop the Videogamer or absorb his abilities herself. Her complex emotions included both love for Atom's past sacrifices and a desire for vengeance. She possessed the power to create a Dark Room - a courtroom-like dimension where truth becomes a weapon.",
    abilities: [
      "Dark Room creation (courtroom dimension)",
      "Truth-based combat and damage infliction",
      "Emotional manipulation and observation",
      "Strategic long-term planning",
      "Power inheritance through ancestral connection",
      "Reality perception beyond normal timelines"
    ],
    relatedStory: "atom-3"
  },
  {
    id: "origin-lawyer",
    name: "Origin Lawyer (Kusam's Grandmother)",
    role: "Supporting Character",
    description: "The sister of the Origin Psycho and the original holder of the Lawyer powers. Known for her role as an arbiter of truth and justice, she believed in using power through honesty and moral confrontation rather than force. After a major philosophical dispute with her brother, they separated, creating two opposing power lineages. She appeared to Kusam in a dream after the MINI COLLAB disaster to pass on her powers and reveal the truth about reality manipulation caused by the Videogamer's time resets. Her legacy lives on through Kusam's abilities to weaponize truth in the Dark Room dimension.",
    abilities: [
      "Truth arbitration and justice enforcement",
      "Dark Room dimensional creation",
      "Post-death spiritual communication",
      "Power inheritance bestowal",
      "Reality perception and knowledge",
      "Truth-based combat techniques"
    ],
    relatedStory: "atom-3"
  },
  {
    id: "yuvi",
    name: "Yuvi (The Dictator)",
    role: "Protagonist",
    description: "A man born with the supernatural ability to command absolute obedience. After witnessing the chaos of a democratic society, he seized control of India at age 19 and transformed it into a dictatorship focused on basic needs rather than freedoms. His harsh but effective rule eliminated poverty, corruption, and religious conflict at the cost of personal liberty.",
    abilities: [
      "Absolute verbal command",
      "Strategic governance",
      "Unwavering determination",
      "Tactical brilliance",
      "Moral restructuring of society"
    ],
    relatedStory: "dictator-1"
  },
  {
    id: "zark-muckerberg",
    name: "Zark Muckerberg",
    role: "Antagonist",
    description: "The elusive technology mogul behind the world's most addictive social media platforms. He represents the destructive aspects of unchecked technology and capitalism that Yuvi sought to eliminate. Protected by advanced security systems and AI technology, he remained the only significant threat to Yuvi's regime until their final confrontation.",
    abilities: [
      "Technological genius",
      "Vast digital empire control",
      "AI-driven security systems",
      "Global influence through social media",
      "Strategic manipulation"
    ],
    relatedStory: "dictator-1"
  },
  {
    id: "yuvis-son",
    name: "Yuvi's Son",
    role: "Supporting Character",
    description: "Created through IVF technology to be Yuvi's perfect successor, he was raised by monks in China away from modern influences. Despite his sheltered upbringing, he developed exceptional discipline, wisdom beyond his years, and mastery of various martial arts. His tragic execution at the hands of Zark Muckerberg became the catalyst for Yuvi's final vengeance.",
    abilities: [
      "Mastery of all martial arts",
      "Exceptional discipline",
      "Advanced wisdom beyond his years",
      "Physical and mental balance",
      "Strategic thinking under pressure"
    ],
    relatedStory: "dictator-1"
  },
  {
    id: "yuvis-son-beast",
    name: "Yuvi's Son in Beast Form",
    role: "Antagonist",
    description: "The resurrected form of Yuvi's son, brought back through a flawed revival process that was contaminated by Atom's traumatic memories. The revival, intended to restore the perfect heir, instead created a beast-like creature with a dead brain, incapable of receiving commands or maintaining human consciousness. In the White Room, he regained his original form and mental clarity, understanding the terrible fate that awaited him outside.",
    abilities: [
      "Beast-like physical transformation",
      "Immunity to verbal commands",
      "Extraordinary martial arts mastery (in human form)",
      "Mental clarity restoration in White Room",
      "Self-sacrifice determination",
      "Enhanced physical strength in beast form"
    ],
    relatedStory: "collab-1"
  },
  {
    id: "reviver",
    name: "Reviver (The Paradox)",
    role: "Protagonist",
    description: "A mysterious figure with surgical detachment who possesses the ability to revive the dead and repair the heaviest wounds of any creature. His name reflects function rather than identity, but he's also known as 'Paradox' due to his unique temporal situation. Though he belongs to the present, he has experienced time travel and witnessed future events as his past, giving him disturbing memories of what's to come. This temporal displacement explains his detached demeanor and the concerning visions that seem foreign to others.",
    abilities: [
      "Revival of the dead",
      "Healing fellow's severe wounds",
      "Time travel experience",
      "Future event glimpses",
      "Surgical precision",
      "Temporal paradox navigation"
    ],
    relatedStory: "collab-1"
  },
  {
    id: "reviver-clone",
    name: "Reviver's Clone",
    role: "Supporting Character",
    description: "A perfect structural duplicate of Reviver created by the Scientist under Yuvi's instruction. Unlike the original, this clone is devoid of the concerning scars and disturbing memories that raised suspicions about Reviver's past. The clone possesses the same revival abilities but operates with automated precision, performing healing gestures without the complex background of the original. After the failed mission, the clone joined the Scientist's research projects.",
    abilities: [
      "Identical revival abilities to original Reviver",
      "Memory-free operation",
      "Scientific collaboration",
      "Precise reconstruction capabilities"
    ],
    relatedStory: "collab-1"
  },
  {
    id: "noe-chu",
    name: "Noe-Chu (The Mr. Effort)",
    role: "Protagonist",
    description: "A legendarily unlucky boy who gained superpowers after consuming cosmic candies. His powers are triggered by misfortune and bad luck, making him an accidental hero who saves the day through a series of unfortunate events and clumsy mishaps.",
    abilities: [
      "Effort manipulation",
      "Accidental heroism",
      "Positive Chaos creation",
      "Fourth Wall breaking"
    ],
    relatedStory: "mreffort-1"
  },
  {
    id: "professor-yoshimitsu",
    name: "Yoshimitsu (The teacher)",
    role: "Antagonist",
    description: "A bitter science teacher with a hairstyle resembling a bored pineapple. After failing to win a Nobel Prize for his 'edible magnets,' he created a laser powered by used batteries and concentrated jealousy to cancel probability-based powers, turning Mr. Effort temporarily into Mr. Sloth.",
    abilities: [
      "Scientific genius",
      "Probability manipulation",
      "Power neutralization",
      "Invention creation",
      "Jealousy conversion"
    ],
    relatedStory: "mreffort-1"
  },
  {
    id: "the-writer",
    name: "Noe Chu's Varient (The Writer)",
    role: "Antagonist",
    description: "A variant of Noe Chu in another universe. The creator of Mr. Effort's story who unexpectedly finds his fictional character appearing in his real world. He has the power to control narrative and fate through his writing, but struggles with the moral implications of his storytelling when confronted by his own creation.",
    abilities: [
      "Reality manipulation through writing",
      "Character creation",
      "Plot control",
      "Fourth wall breaking",
      "Narrative authority"
    ],
    relatedStory: "mreffort-2"
  },
  {
    id: "sevlon-bhoi",
    name: "Sevlon Bhoi",
    role: "Supporting Character",
    description: "A reckless driver who accidentally hits and kills the Writer. He appears briefly in the story, providing a comedic but critical moment that changes the course of Mr. Effort's fate.",
    abilities: [
      "Reckless driving",
      "Unwitting intervention",
      "Accidental heroism"
    ],
    relatedStory: "mreffort-2"
  },
  {
    id: "the-professor",
    name: "The Professor",
    role: "Antagonist",
    description: "A once-visionary scientist who abandoned his pursuit of transcending the limitations of life and death. Consumed by bitterness and jealousy when his former student succeeded where he had given up, he orchestrated a brutal assault that nearly killed the student and led to a global catastrophe.",
    abilities: [
      "Scientific genius",
      "Engineering expertise",
      "Teleportation device creation",
      "Opportunistic entrepreneurship",
      "Multiversal travel technology"
    ],
    relatedStory: "scientist-1"
  },
  {
    id: "the-student",
    name: "The Scientist",
    role: "Protagonist",
    description: "A brilliant and determined scientist who refused to abandon his vision of transcending natural limitations. After years of relentless research, he succeeded in creating human duplication technology, only to be betrayed by his former mentor and lose his memory in an attack.",
    abilities: [
      "Human duplication technology",
      "Biological engineering",
      "Vaccine development",
      "Extreme persistence",
      "Cellular compatibility with his clone"
    ],
    relatedStory: "scientist-1"
  }
];
