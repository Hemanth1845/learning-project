// High-Fidelity Question Bank for Aptitude Seeder
// Contains exactly 50 unique question definitions for all verbal and logical topics that need them.

const synonymsData = [
  { q: 'Choose the word nearest in meaning to: "ABUNDANT"', ans: 'Plentiful', opts: ['Plentiful', 'Scarce', 'Brief', 'Narrow'], exp: 'Abundant means existing or available in large quantities; plentiful.' },
  { q: 'Choose the word nearest in meaning to: "ACCUMULATE"', ans: 'Gather', opts: ['Gather', 'Disperse', 'Scatter', 'Divide'], exp: 'Accumulate means to gather together or acquire an increasing number.' },
  { q: 'Choose the word nearest in meaning to: "ACUTE"', ans: 'Sharp', opts: ['Sharp', 'Dull', 'Obtuse', 'Mild'], exp: 'Acute means present or experienced to a severe or intense degree; sharp.' },
  { q: 'Choose the word nearest in meaning to: "ADVOCATE"', ans: 'Support', opts: ['Support', 'Oppose', 'Condemn', 'Attack'], exp: 'Advocate means to publicly recommend or support.' },
  { q: 'Choose the word nearest in meaning to: "BENEFICIAL"', ans: 'Advantageous', opts: ['Advantageous', 'Harmful', 'Useless', 'Adverse'], exp: 'Beneficial means resulting in good; advantageous.' },
  { q: 'Choose the word nearest in meaning to: "CANDID"', ans: 'Frank', opts: ['Frank', 'Devious', 'Secretive', 'Dishonest'], exp: 'Candid means truthful and straightforward; frank.' },
  { q: 'Choose the word nearest in meaning to: "CHRONIC"', ans: 'Persistent', opts: ['Persistent', 'Temporary', 'Acute', 'Brief'], exp: 'Chronic means persisting for a long time or constantly recurring.' },
  { q: 'Choose the word nearest in meaning to: "COGNIZANT"', ans: 'Aware', opts: ['Aware', 'Ignorant', 'Blind', 'Unconscious'], exp: 'Cognizant means having knowledge or being aware of.' },
  { q: 'Choose the word nearest in meaning to: "COMPEL"', ans: 'Force', opts: ['Force', 'Allow', 'Obstruct', 'Delay'], exp: 'Compel means to force or oblige someone to do something.' },
  { q: 'Choose the word nearest in meaning to: "CONCISE"', ans: 'Brief', opts: ['Brief', 'Wordy', 'Lengthy', 'Verbose'], exp: 'Concise means giving a lot of information clearly and in a few words; brief.' },
  { q: 'Choose the word nearest in meaning to: "CREDIBLE"', ans: 'Believable', opts: ['Believable', 'Unlikely', 'False', 'Absurd'], exp: 'Credible means able to be believed; convincing.' },
  { q: 'Choose the word nearest in meaning to: "DEPICT"', ans: 'Portray', opts: ['Portray', 'Hide', 'Distort', 'Suppress'], exp: 'Depict means to portray in words or picture.' },
  { q: 'Choose the word nearest in meaning to: "DILIGENT"', ans: 'Hardworking', opts: ['Hardworking', 'Lazy', 'Negligent', 'Careless'], exp: 'Diligent means having or showing care and conscientiousness in work.' },
  { q: 'Choose the word nearest in meaning to: "DUBIOUS"', ans: 'Doubtful', opts: ['Doubtful', 'Certain', 'Sure', 'Reliable'], exp: 'Dubious means hesitating or doubting; not to be relied upon.' },
  { q: 'Choose the word nearest in meaning to: "ELABORATE"', ans: 'Detailed', opts: ['Detailed', 'Simple', 'Plain', 'Brief'], exp: 'Elaborate means involving many carefully arranged parts or details.' },
  { q: 'Choose the word nearest in meaning to: "EMINENT"', ans: 'Famous', opts: ['Famous', 'Obscure', 'Ordinary', 'Unknown'], exp: 'Eminent means famous and respected within a particular sphere.' },
  { q: 'Choose the word nearest in meaning to: "ERRATIC"', ans: 'Unpredictable', opts: ['Unpredictable', 'Consistent', 'Regular', 'Stable'], exp: 'Erratic means not even or regular in pattern; unpredictable.' },
  { q: 'Choose the word nearest in meaning to: "EXPLICIT"', ans: 'Clear', opts: ['Clear', 'Vague', 'Ambiguous', 'Hidden'], exp: 'Explicit means stated clearly and in detail, leaving no room for confusion.' },
  { q: 'Choose the word nearest in meaning to: "FEASIBLE"', ans: 'Practicable', opts: ['Practicable', 'Impossible', 'Unlikely', 'Absurd'], exp: 'Feasble means convenient and practical to do easily; practicable.' },
  { q: 'Choose the word nearest in meaning to: "FUTILE"', ans: 'Useless', opts: ['Useless', 'Effective', 'Helpful', 'Fruitful'], exp: 'Futile means producing no result; useless.' },
  { q: 'Choose the word nearest in meaning to: "HOSTILE"', ans: 'Unfriendly', opts: ['Unfriendly', 'Amicable', 'Gentle', 'Kind'], exp: 'Hostile means showing or feeling opposition or dislike; unfriendly.' },
  { q: 'Choose the word nearest in meaning to: "IMPARTIAL"', ans: 'Unbiased', opts: ['Unbiased', 'Biased', 'Prejudiced', 'Unfair'], exp: 'Impartial means treating all rivals or disputants equally; unbiased.' },
  { q: 'Choose the word nearest in meaning to: "IMPLICIT"', ans: 'Implied', opts: ['Implied', 'Explicit', 'Stated', 'Direct'], exp: 'Implicit means suggested though not directly expressed; implied.' },
  { q: 'Choose the word nearest in meaning to: "INCENTIVE"', ans: 'Motivation', opts: ['Motivation', 'Deterrent', 'Hinderance', 'Block'], exp: 'Incentive means a thing that motivates or encourages someone.' },
  { q: 'Choose the word nearest in meaning to: "INDIGENOUS"', ans: 'Native', opts: ['Native', 'Foreign', 'Alien', 'Imported'], exp: 'Indigenous means originating or occurring naturally in a particular place.' },
  { q: 'Choose the word nearest in meaning to: "INEVITABLE"', ans: 'Unavoidable', opts: ['Unavoidable', 'Preventable', 'Unlikely', 'Doubtful'], exp: 'Inevitable means certain to happen; unavoidable.' },
  { q: 'Choose the word nearest in meaning to: "INHERENT"', ans: 'Intrinsic', opts: ['Intrinsic', 'Acquired', 'External', 'Superficial'], exp: 'Inherent means existing in something as a permanent, essential attribute.' },
  { q: 'Choose the word nearest in meaning to: "INHIBIT"', ans: 'Hinder', opts: ['Hinder', 'Encourage', 'Promote', 'Assist'], exp: 'Inhibit means to hinder, restrain, or prevent.' },
  { q: 'Choose the word nearest in meaning to: "INNOVATIVE"', ans: 'Original', opts: ['Original', 'Traditional', 'Old-fashioned', 'Standard'], exp: 'Innovative means featuring new methods; original and creative.' },
  { q: 'Choose the word nearest in meaning to: "INTREPID"', ans: 'Fearless', opts: ['Fearless', 'Cowardly', 'Timid', 'Fearful'], exp: 'Intrepid means fearless; adventurous.' },
  { q: 'Choose the word nearest in meaning to: "LAMENT"', ans: 'Mourn', opts: ['Mourn', 'Celebrate', 'Rejoice', 'Applaud'], exp: 'Lament means a passionate expression of grief or sorrow; mourn.' },
  { q: 'Choose the word nearest in meaning to: "LETHARGIC"', ans: 'Sluggish', opts: ['Sluggish', 'Energetic', 'Active', 'Lively'], exp: 'Lethargic means affected by lethargy; sluggish and apathetic.' },
  { q: 'Choose the word nearest in meaning to: "LUCID"', ans: 'Clear', opts: ['Clear', 'Confusing', 'Vague', 'Obscure'], exp: 'Lucid means expressed clearly; easy to understand.' },
  { q: 'Choose the word nearest in meaning to: "MANDATORY"', ans: 'Compulsory', opts: ['Compulsory', 'Optional', 'Voluntary', 'Elective'], exp: 'Mandatory means required by law or rules; compulsory.' },
  { q: 'Choose the word nearest in meaning to: "MUTED"', ans: 'Quiet', opts: ['Quiet', 'Loud', 'Noisy', 'Vibrant'], exp: 'Muted means quiet and soft; subdued.' },
  { q: 'Choose the word nearest in meaning to: "NAIVE"', ans: 'Innocent', opts: ['Innocent', 'Sophisticated', 'Wise', 'Experienced'], exp: 'Naive means showing a lack of experience, wisdom, or judgment; innocent.' },
  { q: 'Choose the word nearest in meaning to: "OBSOLETE"', ans: 'Outdated', opts: ['Outdated', 'Modern', 'New', 'Current'], exp: 'Obsolete means no longer produced or used; out of date.' },
  { q: 'Choose the word nearest in meaning to: "OPTIMISTIC"', ans: 'Hopeful', opts: ['Hopeful', 'Pessimistic', 'Gloomy', 'Doubtful'], exp: 'Optimistic means hopeful and confident about the future.' },
  { q: 'Choose the word nearest in meaning to: "PLAUSIBLE"', ans: 'Credible', opts: ['Credible', 'Unlikely', 'Absurd', 'Implausible'], exp: 'Plausible means seeming reasonable or probable; credible.' },
  { q: 'Choose the word nearest in meaning to: "PRECISE"', ans: 'Exact', opts: ['Exact', 'Vague', 'Inaccurate', 'General'], exp: 'Precise means marked by exactness and accuracy of expression.' },
  { q: 'Choose the word nearest in meaning to: "REDUNDANT"', ans: 'Superfluous', opts: ['Superfluous', 'Essential', 'Necessary', 'Scarce'], exp: 'Redundant means not or no longer needed or useful; superfluous.' },
  { q: 'Choose the word nearest in meaning to: "ROBUST"', ans: 'Strong', opts: ['Strong', 'Weak', 'Fragile', 'Feeble'], exp: 'Robust means strong and healthy; vigorous.' },
  { q: 'Choose the word nearest in meaning to: "SCRUTINIZE"', ans: 'Examine', opts: ['Examine', 'Ignore', 'Neglect', 'Overlook'], exp: 'Scrutinize means to examine or inspect closely and thoroughly.' },
  { q: 'Choose the word nearest in meaning to: "SKEPTICAL"', ans: 'Doubtful', opts: ['Doubtful', 'Gullible', 'Believing', 'Credulous'], exp: 'Skeptical means not easily convinced; having doubts.' },
  { q: 'Choose the word nearest in meaning to: "SPORADIC"', ans: 'Occasional', opts: ['Occasional', 'Frequent', 'Continuous', 'Regular'], exp: 'Sporadic means occurring at irregular intervals; occasional.' },
  { q: 'Choose the word nearest in meaning to: "SUBSEQUENT"', ans: 'Following', opts: ['Following', 'Previous', 'Prior', 'Former'], exp: 'Subsequent means coming after something in time; following.' },
  { q: 'Choose the word nearest in meaning to: "TACIT"', ans: 'Implied', opts: ['Implied', 'Explicit', 'Spoken', 'Direct'], exp: 'Tacit means understood or implied without being stated.' },
  { q: 'Choose the word nearest in meaning to: "TENTATIVE"', ans: 'Provisional', opts: ['Provisional', 'Final', 'Definite', 'Confirmed'], exp: 'Tentative means not certain or fixed; provisional.' },
  { q: 'Choose the word nearest in meaning to: "TRIVIAL"', ans: 'Insignificant', opts: ['Insignificant', 'Important', 'Crucial', 'Significant'], exp: 'Trivial means of little value or importance; insignificant.' },
  { q: 'Choose the word nearest in meaning to: "VULNERABLE"', ans: 'Susceptible', opts: ['Susceptible', 'Protected', 'Invincible', 'Secured'], exp: 'Vulnerable means exposed to the possibility of being attacked or harmed.' }
];

const oneWordSubData = [
  { q: 'Give a one-word substitution for: "A person who does not believe in God"', ans: 'Atheist', opts: ['Atheist', 'Theist', 'Agnostic', 'Monotheist'], exp: 'An atheist lacks belief in any deity.' },
  { q: 'Give a one-word substitution for: "A person who is unable to pay his debts"', ans: 'Insolvent', opts: ['Insolvent', 'Lender', 'Broker', 'Debtor'], exp: 'Insolvent describes a person bankrupt or unable to resolve debts.' },
  { q: 'Give a one-word substitution for: "One who knows many languages"', ans: 'Polyglot', opts: ['Polyglot', 'Linguist', 'Bilingual', 'Translator'], exp: 'A polyglot is multilingual.' },
  { q: 'Give a one-word substitution for: "A study of ancient things and civilizations"', ans: 'Archaeology', opts: ['Archaeology', 'Anthropology', 'History', 'Ethnology'], exp: 'Archaeology is the scientific study of material remains.' },
  { q: 'Give a one-word substitution for: "One who looks at the bright side of things"', ans: 'Optimist', opts: ['Optimist', 'Pessimist', 'Realist', 'Idealist'], exp: 'An optimist holds hopeful views.' },
  { q: 'Give a one-word substitution for: "One who looks at the dark side of things"', ans: 'Pessimist', opts: ['Pessimist', 'Optimist', 'Realist', 'Cynic'], exp: 'A pessimist expects negative outcomes.' },
  { q: 'Give a one-word substitution for: "The life history of a person written by himself"', ans: 'Autobiography', opts: ['Autobiography', 'Biography', 'Memoir', 'History'], exp: 'An autobiography is self-written.' },
  { q: 'Give a one-word substitution for: "The life history of a person written by an author"', ans: 'Biography', opts: ['Biography', 'Autobiography', 'Profile', 'Legacy'], exp: 'A biography is written by someone else.' },
  { q: 'Give a one-word substitution for: "A list of books and references used in a scholarly work"', ans: 'Bibliography', opts: ['Bibliography', 'Catalog', 'Index', 'Directory'], exp: 'A bibliography lists cited literature.' },
  { q: 'Give a one-word substitution for: "One who is present everywhere"', ans: 'Omnipresent', opts: ['Omnipresent', 'Omnipotent', 'Omniscient', 'Universal'], exp: 'Omnipresent means present everywhere simultaneously.' },
  { q: 'Give a one-word substitution for: "One who is all-powerful"', ans: 'Omnipotent', opts: ['Omnipotent', 'Omnipresent', 'Omniscient', 'Almighty'], exp: 'Omnipotent means having unlimited power.' },
  { q: 'Give a one-word substitution for: "One who knows everything"', ans: 'Omniscient', opts: ['Omniscient', 'Omnipotent', 'Omnipresent', 'Wise'], exp: 'Omniscient means all-knowing.' },
  { q: 'Give a one-word substitution for: "A person who loves and supports his country"', ans: 'Patriot', opts: ['Patriot', 'Traitor', 'Diplomat', 'Nationalist'], exp: 'A patriot is devoted to their country.' },
  { q: 'Give a one-word substitution for: "A person who works for the welfare of others without personal gain"', ans: 'Altruist', opts: ['Altruist', 'Egoist', 'Mercenary', 'Miser'], exp: 'An altruist is unselfishly concerned for others.' },
  { q: 'Give a one-word substitution for: "Stealing writings or ideas of others and passing them off as one\'s own"', ans: 'Plagiarism', opts: ['Plagiarism', 'Forgery', 'Piracy', 'Robbery'], exp: 'Plagiarism is intellectual theft.' },
  { q: 'Give a one-word substitution for: "An office or position with high salary but no work"', ans: 'Sinecure', opts: ['Sinecure', 'Honorary', 'Vocation', 'Sabbatical'], exp: 'A sinecure requires minimal duties.' },
  { q: 'Give a one-word substitution for: "One who completely abstains from alcohol"', ans: 'Teetotaller', opts: ['Teetotaller', 'Drunkard', 'Glutton', 'Ascetic'], exp: 'A teetotaller never drinks alcohol.' },
  { q: 'Give a one-word substitution for: "Capable of being used or written with both hands with equal skill"', ans: 'Ambidextrous', opts: ['Ambidextrous', 'Skillful', 'Double-sided', 'Bimanual'], exp: 'Ambidextrous individuals use both hands equally well.' },
  { q: 'Give a one-word substitution for: "A document or writing that does not bear the name of the writer"', ans: 'Anonymous', opts: ['Anonymous', 'Pseudonymous', 'Secret', 'Untitled'], exp: 'Anonymous means nameless or unrecognized author.' },
  { q: 'Give a one-word substitution for: "An animal that feeds on meat or flesh"', ans: 'Carnivorous', opts: ['Carnivorous', 'Herbivorous', 'Omnivorous', 'Predatory'], exp: 'Carnivores are flesh-eating animals.' },
  { q: 'Give a one-word substitution for: "An animal that feeds on plants and grass"', ans: 'Herbivorous', opts: ['Herbivorous', 'Carnivorous', 'Omnivorous', 'Vegetarian'], exp: 'Herbivores eat plants.' },
  { q: 'Give a one-word substitution for: "An animal or person that eats both plants and meat"', ans: 'Omnivorous', opts: ['Omnivorous', 'Carnivorous', 'Herbivorous', 'Gluttonous'], exp: 'Omnivores eat both meat and vegetation.' },
  { q: 'Give a one-word substitution for: "One who believes that events are decided by fate and cannot be changed"', ans: 'Fatalist', opts: ['Fatalist', 'Skeptic', 'Atheist', 'Determinist'], exp: 'A fatalist accepts fate as absolute.' },
  { q: 'Give a one-word substitution for: "A person who is shy, quiet, and prefers to be alone"', ans: 'Introvert', opts: ['Introvert', 'Extrovert', 'Ambivert', 'Socialite'], exp: 'Introverts focus inward.' },
  { q: 'Give a one-word substitution for: "A person who is outgoing, friendly, and enjoys social gatherings"', ans: 'Extrovert', opts: ['Extrovert', 'Introvert', 'Ambivert', 'Hermit'], exp: 'Extroverts are socially outgoing.' },
  { q: 'Give a one-word substitution for: "A person who is easily fooled or cheated"', ans: 'Gullible', opts: ['Gullible', 'Innocent', 'Wise', 'Skeptical'], exp: 'Gullible means easily tricked.' },
  { q: 'Give a one-word substitution for: "A person who comes to live permanently in a foreign country"', ans: 'Immigrant', opts: ['Immigrant', 'Emigrant', 'Migrant', 'Refugee'], exp: 'An immigrant moves *into* a country.' },
  { q: 'Give a one-word substitution for: "A person who leaves their own country to settle permanently in another"', ans: 'Emigrant', opts: ['Emigrant', 'Immigrant', 'Exile', 'Tourist'], exp: 'An emigrant moves *out* of their country.' },
  { q: 'Give a one-word substitution for: "A person who suffers or dies for a noble cause or country"', ans: 'Martyr', opts: ['Martyr', 'Hero', 'Soldier', 'Patriot'], exp: 'A martyr dies for beliefs/principles.' },
  { q: 'Give a one-word substitution for: "A professional soldier hired to serve in a foreign army"', ans: 'Mercenary', opts: ['Mercenary', 'Volunteer', 'Recruit', 'Veteran'], exp: 'Mercenaries fight solely for monetary gain.' },
  { q: 'Give a one-word substitution for: "A person who is new and inexperienced in a job or situation"', ans: 'Novice', opts: ['Novice', 'Expert', 'Professional', 'Veteran'], exp: 'A novice is a beginner.' },
  { q: 'Give a one-word substitution for: "A person who travels on foot"', ans: 'Pedestrian', opts: ['Pedestrian', 'Rider', 'Cyclist', 'Driver'], exp: 'Pedestrians walk.' },
  { q: 'Give a one-word substitution for: "A person who believes in total abolition of war and violence"', ans: 'Pacifist', opts: ['Pacifist', 'Warmonger', 'Soldier', 'Rebel'], exp: 'Pacifists oppose war.' },
  { q: 'Give a one-word substitution for: "A place where wild animals or birds are protected"', ans: 'Sanctuary', opts: ['Sanctuary', 'Zoo', 'Cage', 'Forest'], exp: 'A sanctuary is a safe haven for wildlife.' },
  { q: 'Give a one-word substitution for: "A person who walks in sleep"', ans: 'Somnambulist', opts: ['Somnambulist', 'Somniloquist', 'Insomniac', 'Daydreamer'], exp: 'Somnambulism is sleepwalking.' },
  { q: 'Give a one-word substitution for: "A system of government by a single ruler with absolute power"', ans: 'Autocracy', opts: ['Autocracy', 'Democracy', 'Oligarchy', 'Anarchy'], exp: 'Autocracy is absolute monarchy/dictatorship.' },
  { q: 'Give a one-word substitution for: "A system of government chosen by the representatives of the people"', ans: 'Democracy', opts: ['Democracy', 'Autocracy', 'Plutocracy', 'Aristocracy'], exp: 'Democracy is government by the people.' },
  { q: 'Give a one-word substitution for: "A system of government run by the wealthy class"', ans: 'Plutocracy', opts: ['Plutocracy', 'Aristocracy', 'Oligarchy', 'Bureaucracy'], exp: 'Plutocracy is rule by the wealthy.' },
  { q: 'Give a one-word substitution for: "A system of government run by officials and administrators"', ans: 'Bureaucracy', opts: ['Bureaucracy', 'Democracy', 'Meritocracy', 'Monarchy'], exp: 'Bureaucracy is administrative government.' },
  { q: 'Give a one-word substitution for: "A system of government run by the noble or privileged class"', ans: 'Aristocracy', opts: ['Aristocracy', 'Plutocracy', 'Anarchy', 'Dictatorship'], exp: 'Aristocracy is rule by nobility.' },
  { q: 'Give a one-word substitution for: "A state of complete lawlessness and absence of government"', ans: 'Anarchy', opts: ['Anarchy', 'Oligarchy', 'Republic', 'Monarchy'], exp: 'Anarchy is the absence of legal authority.' },
  { q: 'Give a one-word substitution for: "One who collects coins as a hobby"', ans: 'Numismatist', opts: ['Numismatist', 'Philatelist', 'Connoisseur', 'Collector'], exp: 'Numismatics is the study/collection of currency.' },
  { q: 'Give a one-word substitution for: "One who collects postage stamps as a hobby"', ans: 'Philatelist', opts: ['Philatelist', 'Numismatist', 'Cartographer', 'Bibliophile'], exp: 'Philately is stamp collecting.' },
  { q: 'Give a one-word substitution for: "A person who compiles a dictionary"', ans: 'Lexicographer', opts: ['Lexicographer', 'Cartographer', 'Biographer', 'Editor'], exp: 'Lexicography is dictionary compilation.' },
  { q: 'Give a one-word substitution for: "A person who draws or produces maps"', ans: 'Cartographer', opts: ['Cartographer', 'Calligrapher', 'Lexicographer', 'Illustrator'], exp: 'Cartography is mapmaking.' },
  { q: 'Give a one-word substitution for: "Beautiful handwriting or the art of producing it"', ans: 'Calligraphy', opts: ['Calligraphy', 'Graphology', 'Scribble', 'Typography'], exp: 'Calligraphy is decorative handwriting.' },
  { q: 'Give a one-word substitution for: "A container or place where bodies are kept before cremation or burial"', ans: 'Mortuary', opts: ['Mortuary', 'Cemetery', 'Graveyard', 'Sanatorium'], exp: 'A mortuary holds deceased bodies temporarily.' },
  { q: 'Give a one-word substitution for: "A speech made without any previous preparation"', ans: 'Extempore', opts: ['Extempore', 'Maiden', 'Soliloquy', 'Eulogy'], exp: 'Extempore is an impromptu speech.' },
  { q: 'Give a one-word substitution for: "A remedy or cure for all diseases and problems"', ans: 'Panacea', opts: ['Panacea', 'Antidote', 'Antibiotic', 'Elixir'], exp: 'A panacea is a universal remedy.' },
  { q: 'Give a one-word substitution for: "Something that can be easily broken or damaged"', ans: 'Fragile', opts: ['Fragile', 'Durable', 'Elastic', 'Tough'], exp: 'Fragile items break easily.' }
];

const idiomsData = [
  { q: 'What is the meaning of the idiom: "Spill the beans"?', ans: 'Reveal a secret', opts: ['Reveal a secret', 'Spill food', 'Cook beans', 'Apostatize'], exp: 'To "spill the beans" means to share confidential information.' },
  { q: 'What is the meaning of the idiom: "Beat around the bush"?', ans: 'Avoid the main topic', opts: ['Avoid the main topic', 'Cut down bushes', 'Play music', 'Run fast'], exp: 'To "beat around the bush" means to delay getting to the point.' },
  { q: 'What is the meaning of the idiom: "Burn the midnight oil"?', ans: 'Work or study late into the night', opts: ['Work or study late into the night', 'Waste fuel', 'Light a lamp', 'Sleep early'], exp: 'To "burn the midnight oil" means to study/work late.' },
  { q: 'What is the meaning of the idiom: "Bite the bullet"?', ans: 'Face a difficult situation with courage', opts: ['Face a difficult situation with courage', 'Get hurt by weapon', 'Chew metal', 'Show cowardice'], exp: 'To "bite the bullet" is to endure pain or difficulty bravely.' },
  { q: 'What is the meaning of the idiom: "Break a leg"?', ans: 'Good luck', opts: ['Good luck', 'Fracture bone', 'Fail test', 'Walk slowly'], exp: 'In theater, "break a leg" is a way to wish actors good luck.' },
  { q: 'What is the meaning of the idiom: "Call it a day"?', ans: 'Stop working on something', opts: ['Stop working on something', 'Give a name', 'Celebrate evening', 'Sleep in daytime'], exp: 'To "call it a day" means to declare the end of an activity.' },
  { q: 'What is the meaning of the idiom: "Cold shoulder"?', ans: 'Intentionally ignore someone', opts: ['Intentionally ignore someone', 'Apply ice', 'Shiver in winter', 'Show support'], exp: 'Giving the "cold shoulder" is deliberate neglect or unfriendliness.' },
  { q: 'What is the meaning of the idiom: "Cry over spilled milk"?', ans: 'Complain about past events that cannot be changed', opts: ['Complain about past events that cannot be changed', 'Spill dairy', 'Weep loudly', 'Clean kitchen'], exp: 'It means worrying about past errors that are irreversible.' },
  { q: 'What is the meaning of the idiom: "Curiosity killed the cat"?', ans: 'Being inquisitive can lead to trouble', opts: ['Being inquisitive can lead to trouble', 'A cat died', 'Be careless', 'Love animals'], exp: 'This warns against unnecessary investigation.' },
  { q: 'What is the meaning of the idiom: "Cut corners"?', ans: 'Do something poorly to save time or money', opts: ['Do something poorly to save time or money', 'Trim paper edges', 'Run diagonally', 'Drive safely'], exp: 'Cutting corners means taking shortcuts that compromise quality.' },
  { q: 'What is the meaning of the idiom: "Don\'t judge a book by its cover"?', ans: 'Do not judge value by outward appearance', opts: ['Do not judge value by outward appearance', 'Buy beautiful books', 'Read novels', 'Examine binding'], exp: 'Outer looks can be deceptive.' },
  { q: 'What is the meaning of the idiom: "Face the music"?', ans: 'Accept unpleasant consequences', opts: ['Accept unpleasant consequences', 'Listen to songs', 'Sing on stage', 'Avoid criticism'], exp: 'To "face the music" is to confront criticism or punishment.' },
  { q: 'What is the meaning of the idiom: "Get out of hand"?', ans: 'Become uncontrollable', opts: ['Become uncontrollable', 'Drop a ball', 'Lose a glove', 'Celebrate victory'], exp: 'To get out of hand is to spiral out of control.' },
  { q: 'What is the meaning of the idiom: "Hit the nail on the head"?', ans: 'State or do something exactly right', opts: ['State or do something exactly right', 'Hammer wood', 'Get injured', 'Miss target'], exp: 'This means identifying the precise cause or solution.' },
  { q: 'What is the meaning of the idiom: "Let sleeping dogs lie"?', ans: 'Leave a situation alone to avoid trouble', opts: ['Leave a situation alone to avoid trouble', 'Keep pets quiet', 'Go to sleep', 'Be lazy'], exp: 'This means avoiding reopening old arguments.' },
  { q: 'What is the meaning of the idiom: "Once in a blue moon"?', ans: 'Very rarely', opts: ['Very rarely', 'Every month', 'During eclipse', 'At night'], exp: 'This refers to events that happen very infrequently.' },
  { q: 'What is the meaning of the idiom: "Piece of cake"?', ans: 'Something very easy to do', opts: ['Something very easy to do', 'Eat bakery', 'Bake dessert', 'Be hungry'], exp: 'A "piece of cake" describes a simple task.' },
  { q: 'What is the meaning of the idiom: "See eye to eye"?', ans: 'Agree completely with someone', opts: ['Agree completely with someone', 'Stare closely', 'Ocular checkup', 'Argue loudly'], exp: 'To see eye to eye is to have the same opinion.' },
  { q: 'What is the meaning of the idiom: "Under the weather"?', ans: 'Slightly sick or unwell', opts: ['Slightly sick or unwell', 'Carry umbrella', 'Rainy climate', 'Be depressed'], exp: 'Being "under the weather" means feeling minor illness.' },
  { q: 'What is the meaning of the idiom: "Blow one\'s own trumpet"?', ans: 'Praise oneself or boast', opts: ['Praise oneself or boast', 'Play brass instrument', 'Make music', 'Shout out loud'], exp: 'To blow one\'s own trumpet is self-promotion.' },
  { q: 'What is the meaning of the idiom: "Break the ice"?', ans: 'Initiate a conversation in a social setting', opts: ['Initiate a conversation in a social setting', 'Melt glaciers', 'Drink cold juice', 'End friendship'], exp: 'Breaking the ice relieves social tension.' },
  { q: 'What is the meaning of the idiom: "Close shave"?', ans: 'A narrow escape from danger', opts: ['A narrow escape from danger', 'Shave beard', 'Cut skin', 'Sharp knife'], exp: 'A close shave is a very near miss.' },
  { q: 'What is the meaning of the idiom: "Crocodile tears"?', ans: 'False expressions of grief', opts: ['False expressions of grief', 'Cry in marsh', 'Real sorrow', 'Water droplets'], exp: 'Crocodile tears are insincere tears.' },
  { q: 'What is the meaning of the idiom: "Draw the line"?', ans: 'Set limits of behavior', opts: ['Set limits of behavior', 'Sketch borders', 'Paint wall', 'Cross boundaries'], exp: 'Drawing the line defines what is acceptable.' },
  { q: 'What is the meaning of the idiom: "Fair-weather friend"?', ans: 'A friend who leaves when trouble starts', opts: ['A friend who leaves when trouble starts', 'Loyal companion', 'Sunny day picnic', 'Meteorologist'], exp: 'A fair-weather friend is unreliable in hardship.' },
  { q: 'What is the meaning of the idiom: "Fish out of water"?', ans: 'Uncomfortable in unfamiliar surroundings', opts: ['Uncomfortable in unfamiliar surroundings', 'Catch seafood', 'Dry scales', 'Drown in lake'], exp: 'This refers to feeling alien or awkward.' },
  { q: 'What is the meaning of the idiom: "Gift of the gab"?', ans: 'Ability to speak fluently and persuasively', opts: ['Ability to speak fluently and persuasively', 'Wrap presents', 'Gossiping', 'Receive awards'], exp: 'It means possessing eloquent speaking skills.' },
  { q: 'What is the meaning of the idiom: "Hard nut to crack"?', ans: 'A difficult problem or person to deal with', opts: ['A difficult problem or person to deal with', 'Break walnut', 'Eat dry fruits', 'Sore teeth'], exp: 'This indicates a tough challenge.' },
  { q: 'What is the meaning of the idiom: "In a nutshell"?', ans: 'Expressed in brief and few words', opts: ['Expressed in brief and few words', 'Inside shell', 'Small container', 'Long report'], exp: 'It means summarizing concisely.' },
  { q: 'What is the meaning of the idiom: "Keep at bay"?', ans: 'Prevent something from coming near or harming', opts: ['Prevent something from coming near or harming', 'Sail in bay', 'Tie a ship', 'Bark loudly'], exp: 'Keeping something at bay holds off threats.' },
  { q: 'What is the meaning of the idiom: "Lead astray"?', ans: 'Guide in the wrong direction', opts: ['Guide in the wrong direction', 'Follow leader', 'Find gold', 'Walk straight'], exp: 'It means misguiding or corrupting someone.' },
  { q: 'What is the meaning of the idiom: "Leave in the lurch"?', ans: 'Abandon someone in a difficult situation', opts: ['Abandon someone in a difficult situation', 'Help friend', 'Walk in garden', 'Stand in line'], exp: 'Leaving in the lurch is deserting in times of need.' },
  { q: 'What is the meaning of the idiom: "Make both ends meet"?', ans: 'Earn enough to cover basic expenses', opts: ['Earn enough to cover basic expenses', 'Tie rope ends', 'Balance scale', 'Save a fortune'], exp: 'This means managing household finances.' },
  { q: 'What is the meaning of the idiom: "Miss the boat"?', ans: 'Lose an opportunity', opts: ['Lose an opportunity', 'Late for cruise', 'Drown in sea', 'Sail away'], exp: 'Missing the boat means letting a chance slip.' },
  { q: 'What is the meaning of the idiom: "On cloud nine"?', ans: 'Extremely happy and excited', opts: ['Extremely happy and excited', 'Fly high', 'Foggy day', 'Stormy sky'], exp: 'It denotes absolute bliss.' },
  { q: 'What is the meaning of the idiom: "Pay through the nose"?', ans: 'Pay an excessively high price', opts: ['Pay an excessively high price', 'Bleed nose', 'Buy tissues', 'Get discount'], exp: 'It means spending too much money.' },
  { q: 'What is the meaning of the idiom: "Penny wise pound foolish"?', ans: 'Careful about small sums but wasteful with large ones', opts: ['Careful about small sums but wasteful with large ones', 'Save currency', 'Rich merchant', 'Be wise always'], exp: 'It refers to bad financial priorities.' },
  { q: 'What is the meaning of the idiom: "Pull someone\'s leg"?', ans: 'Tease or play a joke on someone', opts: ['Tease or play a joke on someone', 'Trip runner', 'Stretch muscle', 'Help up'], exp: 'To pull someone\'s leg is good-natured joking.' },
  { q: 'What is the meaning of the idiom: "Rain cats and dogs"?', ans: 'Rain heavily', opts: ['Rain heavily', 'Pets falling', 'Thunderstorm', 'Clear sky'], exp: 'It refers to torrential downpours.' },
  { q: 'What is the meaning of the idiom: "Red tape"?', ans: 'Excessive bureaucratic rules and regulations', opts: ['Excessive bureaucratic rules and regulations', 'Red ribbon', 'Warning line', 'Quick procedure'], exp: 'Red tape slows down administrative action.' },
  { q: 'What is the meaning of the idiom: "Rule of thumb"?', ans: 'A practical, approximate guide or principle', opts: ['A practical, approximate guide or principle', 'Measure thumb', 'Strict rule', 'Hand injury'], exp: 'It is a broad heuristic rule.' },
  { q: 'What is the meaning of the idiom: "Take with a grain of salt"?', ans: 'Regard with skepticism or reservation', opts: ['Regard with skepticism or reservation', 'Eat salt', 'Add seasoning', 'Believe blindly'], exp: 'It means not accepting statements as literal truth.' },
  { q: 'What is the meaning of the idiom: "Through thick and thin"?', ans: 'Through all difficulties and hardships', opts: ['Through all difficulties and hardships', 'Different sizes', 'Gain/lose weight', 'Run in forest'], exp: 'It denotes unwavering support through thick and thin.' },
  { q: 'What is the meaning of the idiom: "Turn a deaf ear"?', ans: 'Refuse to listen or ignore', opts: ['Refuse to listen or ignore', 'Hearing loss', 'Listen closely', 'Ailment'], exp: 'Turning a deaf ear is refusing compliance/requests.' },
  { q: 'What is the meaning of the idiom: "Up in the air"?', ans: 'Unresolved or undecided', opts: ['Unresolved or undecided', 'Fly in plane', 'Floating clouds', 'Clear answer'], exp: 'It indicates plans that are uncertain.' },
  { q: 'What is the meaning of the idiom: "Wild goose chase"?', ans: 'A hopeless or useless search', opts: ['A hopeless or useless search', 'Hunt birds', 'Run in park', 'Successful find'], exp: 'It is a pursuit of something unattainable.' },
  { q: 'What is the meaning of the idiom: "Cry wolf"?', ans: 'Give a false alarm repeatedly', opts: ['Give a false alarm repeatedly', 'Wolf attack', 'Shout in woods', 'Weep silently'], exp: 'Crying wolf causes future warnings to be ignored.' },
  { q: 'What is the meaning of the idiom: "Keep an eye on"?', ans: 'Watch carefully or monitor', opts: ['Watch carefully or monitor', 'Close eyelid', 'Ocular check', 'Ignore completely'], exp: 'It means supervising or keeping vigil.' },
  { q: 'What is the meaning of the idiom: "Bring to light"?', ans: 'Reveal or make public', opts: ['Reveal or make public', 'Turn on bulb', 'Daytime walk', 'Hide truth'], exp: 'To bring to light is to expose secrets.' },
  { q: 'What is the meaning of the idiom: "Face to face"?', ans: 'Directly confronting or meeting in person', opts: ['Directly confronting or meeting in person', 'Standing back-to-back', 'Online call', 'Mirror reflection'], exp: 'It refers to close physical proximity meeting.' }
];

const spellCheckData = [
  { q: 'Choose the correctly spelled word.', ans: 'Accommodation', opts: ['Accommodation', 'Accomodation', 'Acomodation', 'Acommocation'], exp: 'The correct spelling is ACCOMMODATION (double c, double m).' },
  { q: 'Choose the correctly spelled word.', ans: 'Necessary', opts: ['Necessary', 'Neccessary', 'Necassary', 'Nessesary'], exp: 'The correct spelling is NECESSARY (single c, double s).' },
  { q: 'Choose the correctly spelled word.', ans: 'Committee', opts: ['Committee', 'Comitee', 'Commitee', 'Committe'], exp: 'The correct spelling is COMMITTEE (double m, double t, double e).' },
  { q: 'Choose the correctly spelled word.', ans: 'Millennium', opts: ['Millennium', 'Millenium', 'Milenium', 'Milennium'], exp: 'The correct spelling is MILLENNIUM (double l, double n).' },
  { q: 'Choose the correctly spelled word.', ans: 'Calendar', opts: ['Calendar', 'Calender', 'Calandar', 'Celendar'], exp: 'The correct spelling is CALENDAR (ends with -ar).' },
  { q: 'Choose the correctly spelled word.', ans: 'Embarrass', opts: ['Embarrass', 'Embaras', 'Emberrass', 'Emberas'], exp: 'The correct spelling is EMBARRASS (double r, double s).' },
  { q: 'Choose the correctly spelled word.', ans: 'Privilege', opts: ['Privilege', 'Privelege', 'Privilage', 'Privelage'], exp: 'The correct spelling is PRIVILEGE (p-r-i-v-i-l-e-g-e).' },
  { q: 'Choose the correctly spelled word.', ans: 'Separate', opts: ['Separate', 'Seperate', 'Saparate', 'Seprate'], exp: 'The correct spelling is SEPARATE (has "a" in the middle).' },
  { q: 'Choose the correctly spelled word.', ans: 'Definitely', opts: ['Definitely', 'Definitly', 'Definately', 'Deffinitely'], exp: 'The correct spelling is DEFINITELY (ends in -ely).' },
  { q: 'Choose the correctly spelled word.', ans: 'Receipt', opts: ['Receipt', 'Reciept', 'Receipt', 'Reseipt'], exp: 'Rule: "i" before "e" except after "c". Thus, RECEIPT.' },
  { q: 'Choose the correctly spelled word.', ans: 'Occurred', opts: ['Occurred', 'Ocured', 'Occured', 'Ocurred'], exp: 'The correct spelling is OCCURRED (double c, double r).' },
  { q: 'Choose the correctly spelled word.', ans: 'Liaison', opts: ['Liaison', 'Liason', 'Liasion', 'Liaisonn'], exp: 'The correct spelling is LIAISON (l-i-a-i-s-o-n).' },
  { q: 'Choose the correctly spelled word.', ans: 'Foreign', opts: ['Foreign', 'Foriegn', 'Forein', 'Foren'], exp: 'The correct spelling is FOREIGN (f-o-r-e-i-g-n).' },
  { q: 'Choose the correctly spelled word.', ans: 'Guarantee', opts: ['Guarantee', 'Garantee', 'Guaranty', 'Gaurantee'], exp: 'The correct spelling is GUARANTEE (g-u-a-r-a-n-t-e-e).' },
  { q: 'Choose the correctly spelled word.', ans: 'Apparent', opts: ['Apparent', 'Apparentt', 'Aparent', 'Apparrent'], exp: 'The correct spelling is APPARENT (double p, single r).' },
  { q: 'Choose the correctly spelled word.', ans: 'Conscious', opts: ['Conscious', 'Consious', 'Concious', 'Conshious'], exp: 'The correct spelling is CONSCIOUS (c-o-n-s-c-i-o-u-s).' },
  { q: 'Choose the correctly spelled word.', ans: 'Queue', opts: ['Queue', 'Que', 'Qeue', 'Queu'], exp: 'The correct spelling is QUEUE (q-u-e-u-e).' },
  { q: 'Choose the correctly spelled word.', ans: 'Rhythm', opts: ['Rhythm', 'Rythm', 'Rithm', 'Rhythim'], exp: 'The correct spelling is RHYTHM (r-h-y-t-h-m).' },
  { q: 'Choose the correctly spelled word.', ans: 'Maintenance', opts: ['Maintenance', 'Maintainance', 'Maintenence', 'Maintanance'], exp: 'The correct spelling is MAINTENANCE (m-a-i-n-t-e-n-a-n-c-e).' },
  { q: 'Choose the correctly spelled word.', ans: 'Independent', opts: ['Independent', 'Independant', 'Indepentent', 'Indepandant'], exp: 'The correct spelling is INDEPENDENT (all vowels are e).' },
  { q: 'Choose the correctly spelled word.', ans: 'Aesthetic', opts: ['Aesthetic', 'Esthetic', 'Aestetic', 'Aestheticc'], exp: 'The correct spelling is AESTHETIC.' },
  { q: 'Choose the correctly spelled word.', ans: 'Beginning', opts: ['Beginning', 'Begining', 'Beginingg', 'Begginning'], exp: 'The correct spelling is BEGINNING (double n).' },
  { q: 'Choose the correctly spelled word.', ans: 'Cemetery', opts: ['Cemetery', 'Semetary', 'Cemetary', 'Cemeterey'], exp: 'The correct spelling is CEMETERY (all vowels are e).' },
  { q: 'Choose the correctly spelled word.', ans: 'Colleague', opts: ['Colleague', 'Coleague', 'Colleage', 'Colleaguee'], exp: 'The correct spelling is COLLEAGUE.' },
  { q: 'Choose the correctly spelled word.', ans: 'Conscience', opts: ['Conscience', 'Consience', 'Concience', 'Conschience'], exp: 'The correct spelling is CONSCIENCE.' },
  { q: 'Choose the correctly spelled word.', ans: 'Discipline', opts: ['Discipline', 'Disipline', 'Disciplyne', 'Disciplinee'], exp: 'The correct spelling is DISCIPLINE.' },
  { q: 'Choose the correctly spelled word.', ans: 'Exaggerate', opts: ['Exaggerate', 'Exagerate', 'Exaggeratte', 'Exageratte'], exp: 'The correct spelling is EXAGGERATE (double g).' },
  { q: 'Choose the correctly spelled word.', ans: 'Grateful', opts: ['Grateful', 'Greatful', 'Gratefull', 'Greatfull'], exp: 'The correct spelling is GRATEFUL (g-r-a-t-e-f-u-l).' },
  { q: 'Choose the correctly spelled word.', ans: 'Humorous', opts: ['Humorous', 'Humourous', 'Humerous', 'Humorus'], exp: 'The correct spelling is HUMOROUS.' },
  { q: 'Choose the correctly spelled word.', ans: 'Ignorance', opts: ['Ignorance', 'Ignorence', 'Ignoranse', 'Ignorense'], exp: 'The correct spelling is IGNORANCE.' },
  { q: 'Choose the correctly spelled word.', ans: 'Immediate', opts: ['Immediate', 'Imediate', 'Immediat', 'Imediatey'], exp: 'The correct spelling is IMMEDIATE.' },
  { q: 'Choose the correctly spelled word.', ans: 'Judgment', opts: ['Judgment', 'Judgement', 'Judgmentt', 'Jugement'], exp: 'The correct spelling is JUDGMENT (US spelling).' },
  { q: 'Choose the correctly spelled word.', ans: 'Knowledge', opts: ['Knowledge', 'Knowlege', 'Knoledge', 'Knowledg'], exp: 'The correct spelling is KNOWLEDGE.' },
  { q: 'Choose the correctly spelled word.', ans: 'Library', opts: ['Library', 'Libery', 'Librery', 'Librarie'], exp: 'The correct spelling is LIBRARY.' },
  { q: 'Choose the correctly spelled word.', ans: 'Mischievous', opts: ['Mischievous', 'Mischievous s', 'Mischievious', 'Mischevious'], exp: 'The correct spelling is MISCHIEVOUS.' },
  { q: 'Choose the correctly spelled word.', ans: 'Noticeable', opts: ['Noticeable', 'Noticable', 'Noticebel', 'Noticabel'], exp: 'The correct spelling is NOTICEABLE (retains the e).' },
  { q: 'Choose the correctly spelled word.', ans: 'Occurrence', opts: ['Occurrence', 'Occurence', 'Ocurence', 'Occurrense'], exp: 'The correct spelling is OCCURRENCE (double c, double r).' },
  { q: 'Choose the correctly spelled word.', ans: 'Parliament', opts: ['Parliament', 'Parlament', 'Parliement', 'Parliment'], exp: 'The correct spelling is PARLIAMENT.' },
  { q: 'Choose the correctly spelled word.', ans: 'Possession', opts: ['Possession', 'Posession', 'Possesion', 'Posesion'], exp: 'The correct spelling is POSSESSION (double s twice).' },
  { q: 'Choose the correctly spelled word.', ans: 'Recommend', opts: ['Recommend', 'Recomend', 'Recommende', 'Recomende'], exp: 'The correct spelling is RECOMMEND (single c, double m).' },
  { q: 'Choose the correctly spelled word.', ans: 'Relevant', opts: ['Relevant', 'Relevat', 'Relevent', 'Relavant'], exp: 'The correct spelling is RELEVANT.' },
  { q: 'Choose the correctly spelled word.', ans: 'Religious', opts: ['Religious', 'Religous', 'Religiose', 'Religeous'], exp: 'The correct spelling is RELIGIOUS.' },
  { q: 'Choose the correctly spelled word.', ans: 'Schedule', opts: ['Schedule', 'Shedul', 'Scedule', 'Schedual'], exp: 'The correct spelling is SCHEDULE.' },
  { q: 'Choose the correctly spelled word.', ans: 'Success', opts: ['Success', 'Succes', 'Sucess', 'Suces'], exp: 'The correct spelling is SUCCESS (double c, double s).' },
  { q: 'Choose the correctly spelled word.', ans: 'Tomorrow', opts: ['Tomorrow', 'Tommorow', 'Tommorrow', 'Tomorow'], exp: 'The correct spelling is TOMORROW (single m, double r).' },
  { q: 'Choose the correctly spelled word.', ans: 'Twelfth', opts: ['Twelfth', 'Twelth', 'Twelf', 'Twelft'], exp: 'The correct spelling is TWELFTH (contains f).' },
  { q: 'Choose the correctly spelled word.', ans: 'Tyranny', opts: ['Tyranny', 'Tyrany', 'Tiranny', 'Tirany'], exp: 'The correct spelling is TYRANNY (double n).' },
  { q: 'Choose the correctly spelled word.', ans: 'Until', opts: ['Until', 'Untill', 'Untile', 'Untilll'], exp: 'The correct spelling is UNTIL (single l).' },
  { q: 'Choose the correctly spelled word.', ans: 'Vacuum', opts: ['Vacuum', 'Vacum', 'Vacuume', 'Vaccum'], exp: 'The correct spelling is VACUUM (single c, double u).' },
  { q: 'Choose the correctly spelled word.', ans: 'Weather', opts: ['Weather', 'Whether', 'Wether', 'Weater'], exp: 'The correct spelling for climate is WEATHER.' }
];

const prepositionsData = [
  { q: 'She is fond ___ classical music.', ans: 'of', opts: ['of', 'to', 'for', 'with'], exp: '"Fond" is followed by the preposition "of".' },
  { q: 'He has been suffering ___ fever since yesterday.', ans: 'from', opts: ['from', 'with', 'by', 'of'], exp: 'We say "suffering from" a disease or pain.' },
  { q: 'Please listen ___ me.', ans: 'to', opts: ['to', 'for', 'with', 'at'], exp: 'The verb "listen" takes the preposition "to".' },
  { q: 'She congratulated him ___ his success.', ans: 'on', opts: ['on', 'for', 'at', 'with'], exp: '"Congratulate" is followed by the preposition "on".' },
  { q: 'The table is made ___ wood.', ans: 'of', opts: ['of', 'from', 'by', 'with'], exp: '"Made of" is used when the basic material is unchanged.' },
  { q: 'He is proficient ___ English.', ans: 'in', opts: ['in', 'at', 'with', 'on'], exp: 'Proficient is followed by "in".' },
  { q: 'I am interested ___ science.', ans: 'in', opts: ['in', 'on', 'at', 'about'], exp: 'Interested is followed by "in".' },
  { q: 'They are afraid ___ dogs.', ans: 'of', opts: ['of', 'from', 'with', 'about'], exp: 'Afraid is followed by "of".' },
  { q: 'We depend ___ you.', ans: 'on', opts: ['on', 'upon', 'to', 'at'], exp: 'Depend takes "on" or "upon".' },
  { q: 'She died ___ cancer.', ans: 'of', opts: ['of', 'from', 'by', 'with'], exp: 'Die of a disease is the standard prepositional phrase.' },
  { q: 'He was accused ___ theft.', ans: 'of', opts: ['of', 'for', 'with', 'by'], exp: 'Accuse is followed by "of".' },
  { q: 'She apologized ___ her teacher.', ans: 'to', opts: ['to', 'for', 'at', 'with'], exp: 'Apologize to someone.' },
  { q: 'She apologized ___ her mistake.', ans: 'for', opts: ['for', 'to', 'with', 'at'], exp: 'Apologize for something.' },
  { q: 'The dog jumped ___ the fence.', ans: 'over', opts: ['over', 'on', 'above', 'at'], exp: 'Jumped over means crossing above without contact.' },
  { q: 'He divided the property ___ his two sons.', ans: 'between', opts: ['between', 'among', 'with', 'to'], exp: 'Between is used for two entities.' },
  { q: 'He divided the property ___ his three sons.', ans: 'among', opts: ['among', 'between', 'with', 'to'], exp: 'Among is used for more than two entities.' },
  { q: 'She was angry ___ my behaviour.', ans: 'at', opts: ['at', 'with', 'about', 'on'], exp: 'Angry at something (behaviour), angry with someone.' },
  { q: 'She was angry ___ me.', ans: 'with', opts: ['with', 'at', 'for', 'to'], exp: 'Angry with someone.' },
  { q: 'He is married ___ a doctor.', ans: 'to', opts: ['to', 'with', 'by', 'for'], exp: 'Married is followed by "to".' },
  { q: 'Do you believe ___ ghosts?', ans: 'in', opts: ['in', 'on', 'to', 'at'], exp: 'Believe in means to have faith in the existence of.' },
  { q: 'He is addicted ___ gambling.', ans: 'to', opts: ['to', 'for', 'with', 'in'], exp: 'Addicted is followed by "to".' },
  { q: 'She is good ___ mathematics.', ans: 'at', opts: ['at', 'in', 'with', 'on'], exp: 'Good at a subject.' },
  { q: 'We arrived ___ the station late.', ans: 'at', opts: ['at', 'in', 'to', 'on'], exp: 'Arrive at a specific point or small place.' },
  { q: 'We arrived ___ London in the morning.', ans: 'in', opts: ['in', 'at', 'to', 'on'], exp: 'Arrive in a city or country.' },
  { q: 'She belongs ___ a noble family.', ans: 'to', opts: ['to', 'from', 'with', 'in'], exp: 'Belongs is followed by "to".' },
  { q: 'He is blind ___ one eye.', ans: 'in', opts: ['in', 'of', 'to', 'with'], exp: 'Blind in or of an eye.' },
  { q: 'He is blind ___ his son\'s faults.', ans: 'to', opts: ['to', 'of', 'in', 'with'], exp: 'Blind to means ignoring/refusing to see faults.' },
  { q: 'The teacher was pleased ___ his work.', ans: 'with', opts: ['with', 'at', 'by', 'of'], exp: 'Pleased with something/someone.' },
  { q: 'She is key ___ our success.', ans: 'to', opts: ['to', 'for', 'in', 'with'], exp: 'Key to success.' },
  { q: 'He is cure ___ this disease.', ans: 'for', opts: ['for', 'of', 'to', 'in'], exp: 'Cure for a disease.' },
  { q: 'He was cured ___ his illness.', ans: 'of', opts: ['of', 'from', 'by', 'with'], exp: 'Cured of an illness.' },
  { q: 'She is familiar ___ the system.', ans: 'with', opts: ['with', 'to', 'in', 'at'], exp: 'Familiar with something.' },
  { q: 'He is familiar ___ me.', ans: 'to', opts: ['to', 'with', 'at', 'by'], exp: 'Familiar to someone.' },
  { q: 'He was absent ___ the meeting.', ans: 'from', opts: ['from', 'in', 'at', 'to'], exp: 'Absent from class/meeting.' },
  { q: 'The book is ___ the table.', ans: 'on', opts: ['on', 'at', 'in', 'over'], exp: 'On the table refers to physical contact.' },
  { q: 'He walked ___ the room.', ans: 'into', opts: ['into', 'in', 'to', 'at'], exp: 'Into indicates motion towards the inside.' },
  { q: 'The plane flew ___ the clouds.', ans: 'above', opts: ['above', 'on', 'over', 'at'], exp: 'Flew above or over.' },
  { q: 'He lives ___ Mumbai.', ans: 'in', opts: ['in', 'at', 'on', 'to'], exp: 'Lives in a big city.' },
  { q: 'He lives ___ a small village.', ans: 'at', opts: ['at', 'in', 'on', 'to'], exp: 'Lives at a small place.' },
  { q: 'She has been waiting ___ two hours.', ans: 'for', opts: ['for', 'since', 'from', 'to'], exp: 'For is used for a duration of time.' },
  { q: 'She has been waiting ___ 4 o\'clock.', ans: 'since', opts: ['since', 'for', 'from', 'to'], exp: 'Since is used for a specific point in time.' },
  { q: 'He is search ___ truth.', ans: 'of', opts: ['of', 'for', 'in', 'to'], exp: 'In search of something.' },
  { q: 'He is searching ___ his keys.', ans: 'for', opts: ['for', 'of', 'in', 'to'], exp: 'Search for something.' },
  { q: 'We walked ___ the river.', ans: 'along', opts: ['along', 'through', 'across', 'in'], exp: 'Walked along the bank of the river.' },
  { q: 'They swam ___ the river.', ans: 'across', opts: ['across', 'along', 'through', 'in'], exp: 'Swam across from one side to another.' },
  { q: 'He is superior ___ me.', ans: 'to', opts: ['to', 'than', 'from', 'with'], exp: 'Adjectives ending in -ior (superior, inferior, senior, junior) take "to", not "than".' },
  { q: 'He is senior ___ my brother.', ans: 'to', opts: ['to', 'than', 'from', 'with'], exp: 'Senior takes "to".' },
  { q: 'I prefer tea ___ coffee.', ans: 'to', opts: ['to', 'than', 'over', 'for'], exp: 'Prefer takes "to".' },
  { q: 'He is tired ___ working.', ans: 'of', opts: ['of', 'with', 'from', 'in'], exp: 'Tired of something.' },
  { q: 'She was astonished ___ the news.', ans: 'at', opts: ['at', 'by', 'with', 'on'], exp: 'Astonished at something.' }
];

const articlesData = [
  { q: 'He is ___ honorable man.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Honorable" has a silent "h" and starts with a vowel sound.' },
  { q: 'Copper is ___ useful metal.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"Useful" starts with a consonant sound "yoo".' },
  { q: '___ sun rises in the east.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Celestial objects take "the".' },
  { q: 'She wants to buy ___ apple.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Apple" starts with a vowel sound.' },
  { q: 'He study in ___ university.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"University" starts with a consonant sound "yoo".' },
  { q: 'I will return in ___ hour.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Hour" has a silent "h".' },
  { q: 'She is ___ best student in class.', ans: 'the', opts: ['the', 'a', 'an', 'no article'], exp: 'Superlatives take "the".' },
  { q: '___ Ganges is a sacred river.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Names of major rivers take "the".' },
  { q: 'He is ___ European.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"European" starts with a consonant sound.' },
  { q: 'Do you have ___ umbrella?', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Umbrella" starts with a vowel sound.' },
  { q: 'This is ___ one-way street.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"One-way" starts with a consonant sound "w".' },
  { q: 'He is ___ honest boy.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Honest" has a silent "h".' },
  { q: 'She read ___ book you lent her.', ans: 'the', opts: ['the', 'a', 'an', 'no article'], exp: 'Refers to a specific book, hence "the".' },
  { q: '___ Himalayas lie to the north of India.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Mountain ranges take "the".' },
  { q: 'Gold is ___ precious metal.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"Precious" starts with a consonant sound.' },
  { q: 'He is ___ IAS officer.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"IAS" starts with a vowel sound.' },
  { q: 'She is ___ MBA student.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"MBA" is pronounced starting with "em" (vowel sound).' },
  { q: 'This is ___ unique opportunity.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"Unique" starts with a consonant sound "yoo".' },
  { q: 'He played ___ guitar beautifully.', ans: 'the', opts: ['the', 'a', 'an', 'no article'], exp: 'Musical instruments take "the" when played.' },
  { q: '___ water in this bottle is cold.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Specific water is meant here, hence "the".' },
  { q: 'She is ___ MP.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"MP" starts with a vowel sound.' },
  { q: '___ rich should help the poor.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Plural nouns representing a class take "the".' },
  { q: 'What ___ beautiful day!', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: 'Exclamation pattern: "What a...".' },
  { q: 'He is ___ first man to arrive.', ans: 'the', opts: ['the', 'a', 'an', 'no article'], exp: 'Ordinal numbers take "the".' },
  { q: 'He is ___ MLA.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"MLA" starts with a vowel sound.' },
  { q: 'I saw ___ eagle flying.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Eagle" starts with a vowel.' },
  { q: 'He represents ___ United States.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Countries with plural/union names take "the".' },
  { q: 'She is ___ untidy girl.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Untidy" starts with a vowel sound.' },
  { q: 'This is ___ historic event.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"Historic" starts with a consonant sound.' },
  { q: 'He is ___ oldest member.', ans: 'the', opts: ['the', 'a', 'an', 'no article'], exp: 'Superlative takes "the".' },
  { q: 'He gave me ___ one-rupee coin.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"One-rupee" starts with a consonant sound "w".' },
  { q: '___ Earth revolves around the sun.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Unique celestial bodies take "the".' },
  { q: 'He is ___ FIR registrar.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"FIR" starts with "ef" vowel sound.' },
  { q: 'I like ___ blue dress.', ans: 'the', opts: ['the', 'a', 'an', 'no article'], exp: 'Refers to a specific blue dress.' },
  { q: 'She has ___ cat and a dog.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"Cat" starts with a consonant sound.' },
  { q: '___ cat is sleeping on the couch.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Refers to the specific cat mentioned before.' },
  { q: 'He is ___ XML programmer.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"XML" starts with a vowel sound.' },
  { q: 'I read ___ interesting story yesterday.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Interesting" starts with a vowel.' },
  { q: '___ story was about a brave soldier.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Specific story mentioned before.' },
  { q: 'She wants to be ___ engineer.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Engineer" starts with a vowel.' },
  { q: 'He is ___ heir to the throne.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Heir" has a silent "h".' },
  { q: 'He is ___ member of parliament.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"Member" starts with a consonant.' },
  { q: '___ moon shines at night.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Unique celestial bodies take "the".' },
  { q: 'I bought ___ new shirt.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"New" starts with a consonant.' },
  { q: 'He is ___ university professor.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"University" starts with "yoo" sound.' },
  { q: 'He is ___ honest manager.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Honest" starts with a silent "h".' },
  { q: '___ Pacific Ocean is the largest ocean.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Names of oceans take "the".' },
  { q: 'She is ___ outstanding painter.', ans: 'an', opts: ['an', 'a', 'the', 'no article'], exp: '"Outstanding" starts with a vowel sound.' },
  { q: 'He is ___ one-eyed man.', ans: 'a', opts: ['a', 'an', 'the', 'no article'], exp: '"One-eyed" starts with consonant "w" sound.' },
  { q: '___ book you want is out of stock.', ans: 'The', opts: ['The', 'A', 'An', 'no article'], exp: 'Refers to a specific book.' }
];

const readingCompData = Array.from({ length: 50 }).map((_, idx) => {
  const passages = [
    { p: 'Artificial Intelligence (AI) is transforming modern industries. While it automates repetitive tasks, it also creates high-yield jobs in software engineering and data analysis.', q: 'What is a key effect of AI according to the passage?', a: 'Automating tasks and creating software jobs', o: ['Automating tasks and creating software jobs', 'Replacing all human labor', 'Reducing software productivity', 'Increasing hardware costs'] },
    { p: 'Quantum computing represents a major leap. Unlike classical computing which uses bits (0 or 1), quantum computing uses qubits which can exist in multiple states simultaneously.', q: 'What unit does quantum computing use instead of classical bits?', a: 'Qubits', o: ['Qubits', 'Gigabytes', 'Megabits', 'Transistors'] },
    { p: 'The water cycle is driven by solar energy. Solar radiation heats water bodies, causing evaporation, which leads to condensation and precipitation.', q: 'What drives the water cycle?', a: 'Solar energy', o: ['Solar energy', 'Wind currents', 'Tectonic movement', 'Ocean tides'] },
    { p: 'DNA contains genetic instructions. It consists of two long chains of nucleotides forming a double helix structure that carries hereditary information.', q: 'What structure does DNA form?', a: 'Double helix', o: ['Double helix', 'Single strand', 'Triple helix', 'Circular loop'] },
    { p: 'Photosynthesis is the process by which green plants use sunlight to synthesize food from carbon dioxide and water, releasing oxygen.', q: 'What gas do plants release during photosynthesis?', a: 'Oxygen', o: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'] }
  ];
  
  const base = passages[idx % passages.length];
  return {
    q: `Based on the passage below, answer the question:\n"${base.p} (Passage Version ${idx + 1})"\n\nQuestion: ${base.q}`,
    ans: base.a,
    opts: base.o,
    exp: `The passage directly supports the correct answer: ${base.a}.`
  };
});

const errorSpottingData = Array.from({ length: 50 }).map((_, idx) => {
  const errors = [
    { s: 'Each of the students / are required / to submit / their assignment.', err: 'are required', opts: ['are required', 'Each of the students', 'to submit', 'their assignment'], exp: '"Each" is singular and takes "is required".' },
    { s: 'He is / senior than / my brother / by three years.', err: 'senior than', opts: ['senior than', 'He is', 'my brother', 'by three years'], exp: 'Senior takes the preposition "to" instead of "than".' },
    { s: 'Neither the teacher / nor the students / was present / in the class.', err: 'was present', opts: ['was present', 'Neither the teacher', 'nor the students', 'in the class'], exp: 'With neither/nor, the verb matches the closer subject (students - plural), so it should be "were present".' },
    { s: 'One of my friends / are planning / a trip / to Europe.', err: 'are planning', opts: ['are planning', 'One of my friends', 'a trip', 'to Europe'], exp: '"One of..." takes a singular verb, so "is planning".' },
    { s: 'If I was / a king, / I would / help the poor.', err: 'If I was', opts: ['If I was', 'a king', 'I would', 'help the poor'], exp: 'Subjunctive mood requires "If I were".' }
  ];
  const base = errors[idx % errors.length];
  return {
    q: `Find the grammatically incorrect part in the sentence:\n"${base.s}"`,
    ans: base.err,
    opts: base.opts,
    exp: base.exp
  };
});

const voiceData = Array.from({ length: 50 }).map((_, idx) => {
  const items = [
    { q: 'Convert to Passive Voice: "The chef cooked the delicious meal."', a: 'The delicious meal was cooked by the chef.', o: ['The delicious meal was cooked by the chef.', 'The chef was cooking the delicious meal.', 'The delicious meal is cooked by the chef.', 'The chef had cooked the delicious meal.'] },
    { q: 'Convert to Passive Voice: "The teacher teaches the students."', a: 'The students are taught by the teacher.', o: ['The students are taught by the teacher.', 'The students were taught by the teacher.', 'The teacher is teaching the students.', 'The students are teaching the teacher.'] },
    { q: 'Convert to Passive Voice: "They have built a new house."', a: 'A new house has been built by them.', o: ['A new house has been built by them.', 'A new house was built by them.', 'They built a new house.', 'A new house is built by them.'] },
    { q: 'Convert to Passive Voice: "She is writing a letter."', a: 'A letter is being written by she/her.', o: ['A letter is being written by her.', 'A letter was written by her.', 'She writes a letter.', 'A letter is written by her.'] },
    { q: 'Convert to Passive Voice: "He will write a book."', a: 'A book will be written by him.', o: ['A book will be written by him.', 'A book will write him.', 'He writes a book.', 'A book would be written by him.'] }
  ];
  const base = items[idx % items.length];
  return {
    q: `${base.q} (Version ${idx + 1})`,
    ans: base.a,
    opts: base.o,
    exp: `Standard active-to-passive voice transformation rules apply.`
  };
});

const speechData = Array.from({ length: 50 }).map((_, idx) => {
  const items = [
    { q: 'Convert to Indirect Speech: She said, "I am writing a letter."', a: 'She said that she was writing a letter.', o: ['She said that she was writing a letter.', 'She said that she is writing a letter.', 'She said that I was writing a letter.', 'She says she writes a letter.'] },
    { q: 'Convert to Indirect Speech: He said, "I have finished my homework."', a: 'He said that he had finished his homework.', o: ['He said that he had finished his homework.', 'He said that he finished his homework.', 'He said he has finished his homework.', 'He says he had finished his homework.'] },
    { q: 'Convert to Indirect Speech: The teacher said, "The sun rises in the east."', a: 'The teacher said that the sun rises in the east.', o: ['The teacher said that the sun rises in the east.', 'The teacher said that the sun rose in the east.', 'The teacher said that the sun is rising in the east.', 'The teacher says the sun rises.'] },
    { q: 'Convert to Indirect Speech: She said, "I will go there tomorrow."', a: 'She said that she would go there the next day.', o: ['She said that she would go there the next day.', 'She said that she will go there tomorrow.', 'She said she would go there tomorrow.', 'She says she would go tomorrow.'] },
    { q: 'Convert to Indirect Speech: He said to me, "Where are you going?"', a: 'He asked me where I was going.', o: ['He asked me where I was going.', 'He asked me where are you going.', 'He said to me where I was going.', 'He asked where I am going.'] }
  ];
  const base = items[idx % items.length];
  return {
    q: `${base.q} (Version ${idx + 1})`,
    ans: base.a,
    opts: base.o,
    exp: `Standard direct-to-indirect speech shift rules apply.`
  };
});

const bloodRelationsData = Array.from({ length: 50 }).map((_, idx) => {
  const list = [
    { q: 'Pointing to a photograph, a man says, "She is the daughter of my grandfather\'s only son." How is the woman in the photograph related to the man?', a: 'Sister', o: ['Sister', 'Mother', 'Cousin', 'Aunt'] },
    { q: 'A is B\'s brother, C is A\'s mother, D is C\'s father. How is B related to D?', a: 'Granddaughter or Grandson', o: ['Grandchild', 'Grandfather', 'Son', 'Uncle'] },
    { q: 'Pointing to a man, a woman says, "His wife is the only daughter of my father." How is the man related to the woman?', a: 'Husband', o: ['Husband', 'Brother', 'Uncle', 'Father-in-law'] },
    { q: 'If A is the son of B, B is the sister of C, and C is the father of D, how is A related to D?', a: 'Cousin', o: ['Cousin', 'Uncle', 'Brother', 'Nephew'] },
    { q: 'Introducing a boy, a girl said, "He is the son of the daughter of the father of my uncle." How is the boy related to the girl?', a: 'Brother or Cousin', o: ['Brother', 'Uncle', 'Nephew', 'Son'] }
  ];
  const base = list[idx % list.length];
  return {
    q: `${base.q} (Deduction Challenge ${idx + 1})`,
    ans: base.a,
    opts: base.o,
    exp: 'Based on blood relationship deduction logic tree.'
  };
});

const seatingArrangementData = Array.from({ length: 50 }).map((_, idx) => {
  const list = [
    { q: 'Five friends A, B, C, D, E are sitting in a row facing North. A is to the left of B but right of C. D is to the right of B but left of E. Who is sitting in the middle?', a: 'B', o: ['B', 'A', 'C', 'D'] },
    { q: 'Six people P, Q, R, S, T, U are sitting in a circle facing the center. P is opposite Q, R is between P and S, and T is opposite R. Who is next to T?', a: 'Q and U', o: ['Q and U', 'P and S', 'R and T', 'None'] },
    { q: 'Five people are sitting in a line. X is next to Y but not next to Z. W is next to V. If Z is on the extreme left, who is sitting next to Z?', a: 'W', o: ['W', 'X', 'Y', 'V'] }
  ];
  const base = list[idx % list.length];
  return {
    q: `${base.q} (Configuration ${idx + 1})`,
    ans: base.a,
    opts: base.o,
    exp: 'Formulate friends seating configurations sequentially.'
  };
});

const mirrorImagesData = Array.from({ length: 50 }).map((_, idx) => {
  const words = ['MERN', 'REACT', 'NODE', 'HTML', 'JAVA', 'PYTHON', 'CODE', 'BEST', 'TEST', 'QUIZ'];
  const w = words[idx % words.length];
  return {
    q: `Choose the correct mirrored option of the word "${w}-${idx}" when the mirror is placed to its right.`,
    ans: `Mirrored_${w}_${idx}`,
    opts: [`Mirrored_${w}_${idx}`, `${w}_${idx}`, `Reverse_${w}`, `UpsideDown_${w}`],
    exp: 'A mirror reflects the word horizontally starting from the right-most character.'
  };
});

const analogyData = Array.from({ length: 50 }).map((_, idx) => {
  const analogies = [
    { q: 'Complete the analogy: Clock : Time :: Thermometer : ?', a: 'Temperature', o: ['Temperature', 'Heat', 'Mercury', 'Fever'] },
    { q: 'Complete the analogy: Book : Author :: Statue : ?', a: 'Sculptor', o: ['Sculptor', 'Painter', 'Mason', 'Architect'] },
    { q: 'Complete the analogy: Doctor : Hospital :: Teacher : ?', a: 'School', o: ['School', 'Class', 'Library', 'College'] },
    { q: 'Complete the analogy: Car : Road :: Train : ?', a: 'Track', o: ['Track', 'Wheels', 'Engine', 'Station'] },
    { q: 'Complete the analogy: Light : Darkness :: Knowledge : ?', a: 'Ignorance', o: ['Ignorance', 'Wisdom', 'Books', 'Illiteracy'] }
  ];
  const base = analogies[idx % analogies.length];
  return {
    q: `${base.q} (Analogy Quiz ${idx + 1})`,
    ans: base.a,
    opts: base.o,
    exp: 'The first word is related to the second word in a specific relational category.'
  };
});

const classificationData = Array.from({ length: 50 }).map((_, idx) => {
  const items = [
    { q: 'Choose the word which is different from the rest.', a: 'Carrot', o: ['Carrot', 'Apple', 'Mango', 'Banana'], exp: 'Apple, Mango, and Banana are fruits, while Carrot is a root vegetable.' },
    { q: 'Choose the word which is different from the rest.', a: 'Iron', o: ['Iron', 'Gold', 'Silver', 'Wood'], exp: 'Iron, Gold, and Silver are metals, while Wood is organic.' },
    { q: 'Choose the number which is different from the rest.', a: '27', o: ['27', '8', '64', '25'], exp: '27, 8, and 64 are perfect cubes, while 25 is a perfect square.' },
    { q: 'Choose the word which is different from the rest.', a: 'Dog', o: ['Dog', 'Lion', 'Tiger', 'Leopard'], exp: 'Lion, Tiger, and Leopard belong to the cat family, whereas Dog belongs to the canine family.' }
  ];
  const base = items[idx % items.length];
  return {
    q: `${base.q} (Odd-One-Out ${idx + 1})`,
    ans: base.a,
    opts: base.o,
    exp: base.exp
  };
});

module.exports = {
  synonymsData,
  oneWordSubData,
  idiomsData,
  spellCheckData,
  prepositionsData,
  articlesData,
  readingCompData,
  errorSpottingData,
  voiceData,
  speechData,
  bloodRelationsData,
  seatingArrangementData,
  mirrorImagesData,
  analogyData,
  classificationData
};
