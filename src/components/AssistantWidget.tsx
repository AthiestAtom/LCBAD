import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { stories } from '@/data/stories';
import { characters } from '@/data/characters';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface AssistantWidgetProps {
  className?: string;
}

const AssistantWidget: React.FC<AssistantWidgetProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Assistant Mr. Effort, your guide to the world of Life Could Be A Dream. I can help you with information about stories, characters, timeline, author details, and the entire universe. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Upgrade context to a history stack
  const [contextHistory, setContextHistory] = useState<any[]>([]);

  function updateContextHistory(entity: any, type: string) {
    setContextHistory(prev => [...prev, { entity, type }]);
  }

  // Disambiguation logic
  function disambiguate(query: string, type: string) {
    let options = [];
    if (type === 'character') {
      options = characters.filter(c => query.includes(c.name.split(' ')[0].toLowerCase()));
    } else if (type === 'story') {
      options = stories.filter(s => query.includes(s.title.split(' ')[0].toLowerCase()));
    }
    if (options.length > 1) {
      return `I found multiple possible matches: ${options.map(o => o.name || o.title).join(', ')}. Who do you mean?`;
    }
    return null;
  }

  // Navigation commands
  const handleNavigationCommands = () => {
    if (/go back|previous|last discussed/i.test(inputValue) && contextHistory.length > 1) {
      const prev = contextHistory[contextHistory.length - 2];
      return `Back to previous: ${prev.entity.name || prev.entity.title}`;
    }
    if (/summarize this arc/i.test(inputValue) && contextHistory.length) {
      const arc = contextHistory.slice().reverse().find(c => c.type === 'arc');
      if (arc) {
        return `**${arc.entity.name}**: ${arc.entity.theme}. Main character: ${arc.entity.mainCharacter}. Stories: ${arc.entity.stories.join(', ')}`;
      }
    }
    if (/list all battles|fights|conflicts/i.test(inputValue) && contextHistory.length) {
      const story = contextHistory.slice().reverse().find(c => c.type === 'story');
      if (story) {
        // For demo, just return a placeholder
        return `Epic battles in **${story.entity.title}**: [Demo: Add battle extraction logic here]`;
      }
    }

    // Relationship map
    if (/how.*related|connection between|allies of|enemies of/i.test(inputValue)) {
      // For demo, just return a placeholder
      return "Relationship web: [Demo: Add relationship extraction logic here]";
    }

    // Power evolution and theme significance
    if (/how.*power.*evolve|how.*role.*change|theme.*significance/i.test(inputValue)) {
      // For demo, just return a placeholder
      return "Power evolution and theme significance: [Demo: Add evolution and significance logic here]";
    }
    return null;
  };

  // Engaging, comic-like tone
  function comicResponse(text: string) {
    return `🦸‍♂️ Mr. Effort says: ${text}`;
  }

  // Add fuzzy entity extraction
  function extractEntity(query: string) {
    // Try to match character
    const char = characters.find(c => query.includes(c.name.toLowerCase()) || query.includes(c.id.toLowerCase()));
    if (char) return { type: 'character', entity: char };
    // Try to match story
    const story = stories.find(s => query.includes(s.title.toLowerCase()) || query.includes(s.id.toLowerCase()));
    if (story) return { type: 'story', entity: story };
    // Try to match power
    const power = knowledgeBase.powerTypes.find(p => query.includes(p.name.toLowerCase()));
    if (power) return { type: 'power', entity: power };
    // Try to match arc
    const arc = knowledgeBase.storyArcs.find(a => query.includes(a.name.toLowerCase()));
    if (arc) return { type: 'arc', entity: arc };
    // Try to match theme
    const theme = knowledgeBase.author.themes.find(t => query.includes(t.toLowerCase()));
    if (theme) return { type: 'theme', entity: theme };
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced knowledge base for the assistant
  const knowledgeBase = {
    author: {
      name: "Jashan Bansal",
      bio: "The creative mind behind Life Could Be A Dream, Jashan Bansal is the author of all stories in this universe. He is currently pursuing BTech in Artificial Intelligence & Data Science at CGC Landran, Punjab. Passionate about sci-fi story writing and scientific theories, he crafts narratives that blend cutting-edge technology with human emotion and moral complexity.",
      education: "BTech AI&DS • CGC Landran, Punjab",
      writingStyle: "Jashan's writing combines elements of science fiction, psychological thriller, and modern gaming culture. His stories often explore themes of power, sacrifice, reality manipulation, and the consequences of extraordinary abilities.",
      themes: ["Reality manipulation", "Gaming culture", "Psychological warfare", "Power and responsibility", "Sacrifice and redemption", "Timeline alteration"],
      contact: {
        linkedin: "https://www.linkedin.com/in/jashan-bansal-02309b317?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BibA3z7p7SXSHMiLSicKQ5A%3D%3D",
        whatsapp: "https://wa.me/+918283035000",
        email: "cec235008.aids.cec@cgc.edu.in"
      }
    },
    universe: {
      name: "Life Could Be A Dream",
      description: "A science fiction universe where ordinary people gain extraordinary powers through various means - from gaming abilities to reality manipulation. The world explores what happens when humans gain powers that can alter reality itself.",
      coreConcepts: [
        "Powers are inherited through ancient lineages",
        "Reality can be manipulated through different mediums (games, voice, truth)",
        "Every power comes with consequences and responsibilities",
        "The universe has multiple timelines and dimensions",
        "Ancient saints originally granted these powers"
      ]
    },
    stories: stories,
    characters: characters,
    timeline: [
      { 
        period: "Ancient Times", 
        events: ["Saint granted powers to apprentices", "Powers passed down through generations"],
        significance: "Foundation of the power system"
      },
      { 
        period: "1921", 
        events: ["Mr. Effort (Noe-Chu) gains powers", "Frozen in amber for 100 years"],
        significance: "First documented case of luck-based powers"
      },
      { 
        period: "2023", 
        events: ["Mr. Effort revived by geology students", "Returns to modern world"],
        significance: "Reintroduction of ancient powers to modern era"
      },
      { 
        period: "Present Day", 
        events: ["The Kid (Videogamer) discovers gaming powers", "Atom gains White Room powers", "Yuvi becomes The Dictator"],
        significance: "Multiple power lineages converge in modern times"
      }
    ],
    powerTypes: [
      {
        name: "Gaming Reality Manipulation",
        description: "The ability to change reality through video games and gaming mechanics",
        users: ["The Kid (Videogamer)"],
        limitations: "Requires gaming knowledge and can be countered by other gamers"
      },
      {
        name: "White Room Creation",
        description: "Creating dimensional spaces where battles must end in death",
        users: ["Atom", "Origin Psycho"],
        limitations: "Requires sacrifice and can be emotionally taxing"
      },
      {
        name: "Dark Room (Truth-based)",
        description: "Courtroom-like dimensions where truth becomes a weapon",
        users: ["Kusam", "Origin Lawyer"],
        limitations: "Requires truth and justice to function"
      },
      {
        name: "Voice Command (Dictator)",
        description: "Absolute control through spoken commands",
        users: ["Yuvi (The Dictator)"],
        limitations: "Requires voice and can be resisted by strong will"
      },
      {
        name: "Luck-based (Mr. Effort)",
        description: "Powers activated through misfortune and bad luck",
        users: ["Noe-Chu (Mr. Effort)"],
        limitations: "Unpredictable and requires bad luck to trigger"
      },
      {
        name: "Timeline Programming",
        description: "Altering reality through code and simulation",
        users: ["Aryansh (The Racingcode)"],
        limitations: "Requires programming knowledge and can be complex"
      }
    ],
    storyArcs: [
      {
        name: "Videogamer Arc",
        stories: ["videogamer-1", "videogamer-2", "videogamer-3"],
        theme: "Gaming powers and reality manipulation",
        mainCharacter: "The Kid"
      },
      {
        name: "Atom Arc",
        stories: ["atom-1", "atom-2"],
        theme: "Sacrifice and psychological warfare",
        mainCharacter: "Atom"
      },
      {
        name: "Dictator Arc",
        stories: ["dictator-1"],
        theme: "Power and control",
        mainCharacter: "Yuvi"
      },
      {
        name: "Mr. Effort Arc",
        stories: ["mreffort-1", "mreffort-2"],
        theme: "Luck and persistence",
        mainCharacter: "Noe-Chu"
      }
    ]
  };

  // Add contextReminder and clarify helpers before processQuery
  function contextReminder() {
    if (contextHistory.length === 0) return '';
    const last = contextHistory[contextHistory.length - 1];
    if (last.type === 'character') return `🔎 You're exploring character: **${last.entity.name}**\n\n`;
    if (last.type === 'story') return `📖 You're reading about story: **${last.entity.title}**\n\n`;
    if (last.type === 'arc') return `🌀 You're in the arc: **${last.entity.name}**\n\n`;
    if (last.type === 'theme') return `🎭 You're exploring the theme: **${last.entity}**\n\n`;
    if (last.type === 'author') return `👤 You're learning about the author.\n\n`;
    if (last.type === 'universe') return `🌌 You're exploring the universe: **${knowledgeBase.universe.name}**\n\n`;
    return '';
  }

  function clarify(question: string) {
    return `🤔 I couldn't find a clear answer for "${question}". Could you be more specific, or try rephrasing?`;
  }

  // Replace the entire processQuery function with the upgraded version
  const processQuery = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    let processedQuery = lowerQuery;
    const keywords = processedQuery.split(/\W+/).filter(w => w.length > 2);

    // Check navigation commands first
    const navigationResult = handleNavigationCommands();
    if (navigationResult) return navigationResult;

    // Check multi-entity queries
    const multiEntityResult = handleMultiEntityQueries();
    if (multiEntityResult) return multiEntityResult;

    // Special case: Who are you
    if (/who are you|what are you|your name|who is assistant/i.test(processedQuery)) {
      return contextReminder() + comicResponse("Someone very important for this Comic World, maybe a Fourth Wall breaker perhaps!\n\nWant to know what I can do? Just ask for 'help'!");
    }

    // Enhanced pronoun resolution in any part of the query
    if (contextHistory.length > 0) {
      const lastEntity = contextHistory[contextHistory.length - 1];
      if (lastEntity.type === 'character') {
        processedQuery = processedQuery.replace(/\b(he|him|his|she|her|they|them|their)\b/g, lastEntity.entity.name.toLowerCase());
      }
      if (lastEntity.type === 'story') {
        processedQuery = processedQuery.replace(/\b(the story|story|title|name|he|him|his)\b/g, lastEntity.entity.title.toLowerCase());
      }
      if (lastEntity.type === 'arc') {
        processedQuery = processedQuery.replace(/\b(the arc|arc|series|saga|he|him|his)\b/g, lastEntity.entity.name.toLowerCase());
      }
      if (lastEntity.type === 'theme') {
        processedQuery = processedQuery.replace(/\b(the theme|theme|significance|meaning|why important|what does.*represent)\b/g, lastEntity.entity.toLowerCase());
      }
    }
    if (contextHistory.length > 1) {
      const prevEntity = contextHistory[contextHistory.length - 2];
      if (prevEntity.type === 'character') {
        processedQuery = processedQuery.replace(/\b(he|him|his|she|her|they|them|their)\b/g, prevEntity.entity.name.toLowerCase());
      }
      if (prevEntity.type === 'story') {
        processedQuery = processedQuery.replace(/\b(the story|story|title|name|he|him|his)\b/g, prevEntity.entity.title.toLowerCase());
      }
      if (prevEntity.type === 'arc') {
        processedQuery = processedQuery.replace(/\b(the arc|arc|series|saga|he|him|his)\b/g, prevEntity.entity.name.toLowerCase());
      }
      if (prevEntity.type === 'theme') {
        processedQuery = processedQuery.replace(/\b(the theme|theme|significance|meaning|why important|what does.*represent)\b/g, prevEntity.entity.toLowerCase());
      }
    }

    // Contextual pronoun resolution
    const pronounMap = {
      'he': contextHistory.length > 0 ? contextHistory[contextHistory.length - 1]?.entity : undefined,
      'she': contextHistory.length > 0 ? contextHistory[contextHistory.length - 1]?.entity : undefined,
      'they': contextHistory.length > 0 ? contextHistory[contextHistory.length - 1]?.entity : undefined,
      'him': contextHistory.length > 0 ? contextHistory[contextHistory.length - 1]?.entity : undefined,
      'her': contextHistory.length > 0 ? contextHistory[contextHistory.length - 1]?.entity : undefined,
      'them': contextHistory.length > 0 ? contextHistory[contextHistory.length - 1]?.entity : undefined,
      'the author': knowledgeBase.author,
      'author': knowledgeBase.author,
      'writer': knowledgeBase.author,
      'creator': knowledgeBase.author
    };

    // If the query is just a pronoun or refers to the last topic
    if (Object.keys(pronounMap).some(p => processedQuery.trim() === p)) {
      const entity = pronounMap[processedQuery.trim()];
      if (entity) {
        if (entity === knowledgeBase.author) {
          return contextReminder() + comicResponse(`**${knowledgeBase.author.name}**\n\n**Education:** ${knowledgeBase.author.education}\n\n**Bio:** ${knowledgeBase.author.bio}\n\n**Writing Style:** ${knowledgeBase.author.writingStyle}` + followUps(knowledgeBase.author));
        }
        if (entity.name) {
          return contextReminder() + comicResponse(`**${entity.name}**\n\n**Role:** ${entity.role}\n\n**Description:** ${entity.description}\n\n**Abilities:** ${entity.abilities?.join(', ')}` + followUps(entity));
        }
      }
      return contextReminder() + comicResponse("I'm not sure who you're referring to. Please clarify your question.");
    }

    // Use extractEntity to update context for any entity mentioned
    const entityResult = extractEntity(processedQuery);
    if (entityResult) {
      updateContextHistory(entityResult.entity, entityResult.type);
    }

    // If ambiguous, ask for clarification
    if (!entityResult && /he|she|they|it|this|that|him|her|them/.test(processedQuery) && contextHistory.length === 0) {
      return contextReminder() + comicResponse(clarify(query));
    }

    // Add 'what happened next' and relationship logic
    if (/what happened next|then what|after that|continue/i.test(processedQuery) && contextHistory.length > 0 && contextHistory[contextHistory.length - 1].type === 'story') {
      const arc = knowledgeBase.storyArcs.find(a => a.stories.includes(contextHistory[contextHistory.length - 1].entity.id));
      if (arc) {
        const idx = arc.stories.indexOf(contextHistory[contextHistory.length - 1].entity.id);
        if (idx !== -1 && idx < arc.stories.length - 1) {
          const nextStory = stories.find(s => s.id === arc.stories[idx + 1]);
          if (nextStory) {
            updateContextHistory(nextStory, 'story');
            return contextReminder() + comicResponse(`**Next in the ${arc.name}:**\n\n**${nextStory.title}**\n${nextStory.summary}` + followUps(nextStory));
          }
        }
        return contextReminder() + comicResponse(`That was the last story in the ${arc.name}.`);
      }
      return contextReminder() + comicResponse("I'm not sure what comes next. Can you specify the arc or story?");
    }

    // Add relationship and significance logic
    if (/relationship|connection|how.*related|who.*fought|who.*helped|who.*saved/i.test(processedQuery)) {
      if (contextHistory.length > 0 && contextHistory[contextHistory.length - 1].type === 'character' && contextHistory[contextHistory.length - 1].entity.relatedStory) {
        const relatedStory = stories.find(s => s.id === contextHistory[contextHistory.length - 1].entity.relatedStory);
        return contextReminder() + comicResponse(`**${contextHistory[contextHistory.length - 1].entity.name}**'s role in **${relatedStory?.title || 'this story'}**: ${contextHistory[contextHistory.length - 1].entity.description}` + followUps(contextHistory[contextHistory.length - 1].entity));
      }
      if (contextHistory.length > 0 && contextHistory[contextHistory.length - 1].type === 'arc' && contextHistory[contextHistory.length - 1].entity.mainCharacter) {
        return contextReminder() + comicResponse(`**${contextHistory[contextHistory.length - 1].entity.mainCharacter}** is the main character of the ${contextHistory[contextHistory.length - 1].entity.name} arc.` + followUps(contextHistory[contextHistory.length - 1].entity));
      }
    }

    // Add theme and motif awareness
    if (/theme|motif|significance|meaning|why important|what does.*represent/i.test(processedQuery)) {
      if (contextHistory.length > 0 && contextHistory[contextHistory.length - 1].type === 'theme') {
        return contextReminder() + comicResponse(`**Theme: ${contextHistory[contextHistory.length - 1].entity}**\nThis theme is explored through various characters and storylines, such as ${knowledgeBase.storyArcs.filter(a => a.theme.toLowerCase().includes(contextHistory[contextHistory.length - 1].entity.toLowerCase())).map(a => a.name).join(', ')}.`);
      }
      if (contextHistory.length > 0 && contextHistory[contextHistory.length - 1].type === 'story') {
        return contextReminder() + comicResponse(`**Themes in ${contextHistory[contextHistory.length - 1].entity.title}:**\n${knowledgeBase.author.themes.filter(t => contextHistory[contextHistory.length - 1].entity.summary.toLowerCase().includes(t.toLowerCase())).join(', ')}`);
      }
    }

    // Author-related queries
    if (processedQuery.includes('author') || processedQuery.includes('jashan') || processedQuery.includes('writer') || processedQuery.includes('creator')) {
      updateContextHistory(undefined, 'author');
      if (processedQuery.includes('style') || processedQuery.includes('writing')) {
        return contextReminder() + comicResponse(`**Jashan Bansal's Writing Style:**\n${knowledgeBase.author.writingStyle}\n\n**Themes:** ${knowledgeBase.author.themes.join(', ')}` + followUps(knowledgeBase.author));
      }
      if (processedQuery.includes('bio') || processedQuery.includes('about')) {
        return contextReminder() + comicResponse(`**About the Author:**\n${knowledgeBase.author.bio}\n\n**Education:** ${knowledgeBase.author.education}` + followUps(knowledgeBase.author));
      }
      if (processedQuery.includes('education') || processedQuery.includes('study') || processedQuery.includes('degree')) {
        return contextReminder() + comicResponse(`**Education:** ${knowledgeBase.author.education}` + followUps(knowledgeBase.author));
      }
      if (processedQuery.includes('contact')) {
        return contextReminder() + comicResponse(`**Contact Jashan Bansal:**\n- LinkedIn: ${knowledgeBase.author.contact.linkedin}\n- WhatsApp: ${knowledgeBase.author.contact.whatsapp}\n- Email: ${knowledgeBase.author.contact.email}` + followUps(knowledgeBase.author));
      }
      return contextReminder() + comicResponse(`**Author:** ${knowledgeBase.author.name}\n\n**Education:** ${knowledgeBase.author.education}\n\n${knowledgeBase.author.bio}\n\n**Writing Style:** ${knowledgeBase.author.writingStyle}` + followUps(knowledgeBase.author));
    }

    // Universe and world-building queries
    if (processedQuery.includes('universe') || processedQuery.includes('world') || processedQuery.includes('setting') || processedQuery.includes('lore')) {
      updateContextHistory(undefined, 'universe');
      if (processedQuery.includes('concept') || processedQuery.includes('core')) {
        return contextReminder() + comicResponse(`**Core Concepts of Life Could Be A Dream:**\n${knowledgeBase.universe.coreConcepts.map(c => `• ${c}`).join('\n')}`);
      }
      return contextReminder() + comicResponse(`**Universe:** ${knowledgeBase.universe.name}\n\n${knowledgeBase.universe.description}\n\n**Core Concepts:**\n${knowledgeBase.universe.coreConcepts.map(c => `• ${c}`).join('\n')}`);
    }

    // Story arc queries
    if (processedQuery.includes('arc') || processedQuery.includes('series') || processedQuery.includes('saga')) {
      updateContextHistory(undefined, 'arc');
      return contextReminder() + comicResponse(`**Story Arcs in Life Could Be A Dream:**\n${knowledgeBase.storyArcs.map(arc => `**${arc.name}**\n• Stories: ${arc.stories.join(', ')}\n• Theme: ${arc.theme}\n• Main Character: ${arc.mainCharacter}`).join('\n\n')}`);
    }

    // Enhanced story-related queries
    if (processedQuery.includes('story') || processedQuery.includes('stories')) {
      updateContextHistory(undefined, 'story');
      if (processedQuery.includes('videogamer')) {
        const videogamerStories = stories.filter(s => s.id.startsWith('videogamer'));
        return contextReminder() + comicResponse(`**Videogamer Stories (${videogamerStories.length}):**\n${videogamerStories.map(s => `• **${s.title}**\n  Summary: ${s.summary}\n  Published: ${s.published}`).join('\n\n')}`);
      }
      if (processedQuery.includes('atom')) {
        const atomStories = stories.filter(s => s.id.startsWith('atom'));
        return contextReminder() + comicResponse(`**Atom Stories (${atomStories.length}):**\n${atomStories.map(s => `• **${s.title}**\n  Summary: ${s.summary}\n  Published: ${s.published}`).join('\n\n')}`);
      }
      if (processedQuery.includes('dictator')) {
        const dictatorStories = stories.filter(s => s.id.startsWith('dictator'));
        return contextReminder() + comicResponse(`**Dictator Stories (${dictatorStories.length}):**\n${dictatorStories.map(s => `• **${s.title}**\n  Summary: ${s.summary}\n  Published: ${s.published}`).join('\n\n')}`);
      }
      if (processedQuery.includes('mr. effort') || processedQuery.includes('mreffort')) {
        const effortStories = stories.filter(s => s.id.startsWith('mreffort'));
        return contextReminder() + comicResponse(`**Mr. Effort Stories (${effortStories.length}):**\n${effortStories.map(s => `• **${s.title}**\n  Summary: ${s.summary}\n  Published: ${s.published}`).join('\n\n')}`);
      }
      if (processedQuery.includes('all') || processedQuery.includes('list')) {
        return contextReminder() + comicResponse(`**All Stories (${stories.length}):**\n${stories.map(s => `• **${s.title}** (${s.id})\n  Summary: ${s.summary}\n  Published: ${s.published}`).join('\n\n')}`);
      }
      return contextReminder() + comicResponse(`**Story Categories:**\n• Videogamer Stories: ${stories.filter(s => s.id.startsWith('videogamer')).length}\n• Atom Stories: ${stories.filter(s => s.id.startsWith('atom')).length}\n• Dictator Stories: ${stories.filter(s => s.id.startsWith('dictator')).length}\n• Mr. Effort Stories: ${stories.filter(s => s.id.startsWith('mreffort')).length}\n\nAsk about specific categories for detailed information!`);
    }

    // Enhanced character-related queries
    if (processedQuery.includes('character') || processedQuery.includes('characters')) {
      updateContextHistory(undefined, 'character');
      if (processedQuery.includes('protagonist') || processedQuery.includes('hero')) {
        const protagonists = characters.filter(c => c.role === 'Protagonist');
        return contextReminder() + comicResponse(`**Main Protagonists:**\n${protagonists.map(c => `• **${c.name}**\n  Description: ${c.description}\n  Abilities: ${c.abilities.join(', ')}`).join('\n\n')}`);
      }
      if (processedQuery.includes('antagonist') || processedQuery.includes('villain')) {
        const antagonists = characters.filter(c => c.role === 'Antagonist');
        return contextReminder() + comicResponse(`**Main Antagonists:**\n${antagonists.map(c => `• **${c.name}**\n  Description: ${c.description}\n  Abilities: ${c.abilities.join(', ')}`).join('\n\n')}`);
      }
      if (processedQuery.includes('supporting')) {
        const supporting = characters.filter(c => c.role === 'Supporting Character');
        return contextReminder() + comicResponse(`**Supporting Characters:**\n${supporting.map(c => `• **${c.name}**\n  Description: ${c.description}\n  Abilities: ${c.abilities.join(', ')}`).join('\n\n')}`);
      }
      return contextReminder() + comicResponse(`**Character Categories:**\n• Protagonists: ${characters.filter(c => c.role === 'Protagonist').length}\n• Antagonists: ${characters.filter(c => c.role === 'Antagonist').length}\n• Supporting Characters: ${characters.filter(c => c.role === 'Supporting Character').length}\n\nAsk about specific categories or character names for detailed information!`);
    }

    // --- Smarter Character Extraction (Fuzzy, Contextual, Role-based) ---
    function fuzzyMatch(str1, str2) {
      return str1.replace(/\s+/g, '').toLowerCase().includes(str2.replace(/\s+/g, '').toLowerCase()) ||
             str2.replace(/\s+/g, '').toLowerCase().includes(str1.replace(/\s+/g, '').toLowerCase());
    }

    // Try fuzzy name match
    let character = characters.find(c =>
      fuzzyMatch(processedQuery, c.name) ||
      fuzzyMatch(processedQuery, c.id)
    );
    // If not found, try by role and story context
    if (!character) {
      const roleMatch = /(protagonist|antagonist|villain|hero|supporting)[^\w]*(of|in)?[^\w]*([\w\s-]+)/i.exec(processedQuery);
      if (roleMatch) {
        const role = roleMatch[1].toLowerCase();
        const storyHint = roleMatch[3]?.trim().toLowerCase();
        const possibleStories = stories.filter(s => fuzzyMatch(s.title, storyHint) || fuzzyMatch(s.id, storyHint));
        if (possibleStories.length) {
          character = characters.find(c =>
            c.role.toLowerCase().includes(role) &&
            possibleStories.some(s => c.relatedStory === s.id)
          );
        }
      }
    }
    // If still not found, try by just role
    if (!character && /(protagonist|antagonist|villain|hero|supporting)/i.test(processedQuery)) {
      const role = /(protagonist|antagonist|villain|hero|supporting)/i.exec(processedQuery)[1].toLowerCase();
      character = characters.find(c => c.role.toLowerCase().includes(role));
    }
    // If found, synthesize a rich answer
    if (character) {
      updateContextHistory(character, 'character');
      const relatedStory = stories.find(s => s.id === character.relatedStory);
      let details = `**${character.name}**\n\n**Role:** ${character.role}\n\n**Description:** ${character.description}\n\n**Abilities:** ${character.abilities.join(', ')}`;
      if (relatedStory) details += `\n\n**Appears in:** ${relatedStory.title}`;
      const allies = characters.filter(c => c.id !== character.id && c.relatedStory === character.relatedStory && c.role !== character.role);
      if (allies.length) details += `\n\n**Other key characters in this story:** ${allies.map(a => a.name).join(', ')}`;
      return contextReminder() + comicResponse(details + followUps(character));
    }
    // If multiple possible matches, ask for clarification
    const possibleChars = characters.filter(c => keywords.some(k => fuzzyMatch(c.name, k)));
    if (possibleChars.length > 1) {
      const disambiguation = disambiguate(processedQuery, 'character');
      return contextReminder() + comicResponse(disambiguation || `I found multiple characters matching your question: ${possibleChars.map(c => c.name).join(', ')}. Who do you mean?`);
    }
    // --- End Smarter Character Extraction ---

    // Enhanced specific character queries
    // Remove the old 'const character = ...' block and its answer logic, since the new smarter character extraction covers it.

    // Enhanced story content queries: search full content for relevant matches
    if (processedQuery.includes('content') || processedQuery.includes('plot') || processedQuery.includes('what happens')) {
      let bestMatch = null;
      let bestScore = 0;
      for (const s of stories) {
        let score = 0;
        if (processedQuery.includes(s.title.toLowerCase())) score += 2;
        if (processedQuery.includes(s.id.toLowerCase())) score += 2;
        if (s.content && processedQuery.split(' ').some(word => s.content.toLowerCase().includes(word))) score += 1;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = s;
        }
      }
      if (bestMatch) {
        let quote = '';
        const words = processedQuery.split(' ');
        for (const word of words) {
          if (word.length > 3 && bestMatch.content.toLowerCase().includes(word)) {
            const idx = bestMatch.content.toLowerCase().indexOf(word);
            quote = bestMatch.content.substring(Math.max(0, idx - 40), idx + 60) + '...';
            break;
          }
        }
        if (!quote) quote = bestMatch.content.substring(0, 300) + '...';
        return contextReminder() + comicResponse(`**${bestMatch.title}**\n\n**Summary:** ${bestMatch.summary}\n\n**Relevant Content:** ${quote}\n\n**Published:** ${bestMatch.published}\n\n**Author:** ${bestMatch.author}` + followUps(bestMatch));
      }
    }

    // Character relationship queries
    if (processedQuery.includes('relationship') || processedQuery.includes('connection') || processedQuery.includes('related')) {
      if (processedQuery.includes('atom') && processedQuery.includes('pandey')) {
        return contextReminder() + comicResponse(`**Atom and Pandey's Relationship:**\n\nAtom and Pandey were former classmates and competitive rivals. They were both teleported to the White Room where Atom sacrificed himself to help Pandey escape. This traumatic experience led to Pandey being placed in mental health care, while Atom gained supernatural powers after death.`);
      }
      if (processedQuery.includes('kid') && processedQuery.includes('variant')) {
        return contextReminder() + comicResponse(`**The Kid and The Evil Videogamer's Relationship:**\n\nThe Evil Videogamer is an alternate timeline version of The Kid who has mastered his gaming powers. He rules over a dimensional city and seeks to steal the original Kid's powers. They engage in epic gaming battles across different video game dimensions.`);
      }
    }

    // Theme and concept queries
    if (processedQuery.includes('theme') || processedQuery.includes('concept') || processedQuery.includes('meaning')) {
      return contextReminder() + comicResponse(`**Themes in Life Could Be A Dream:**\n\n${knowledgeBase.author.themes.map(theme => `• **${theme}**: Explored through various characters and storylines`).join('\n')}\n\nEach story explores these themes through different perspectives and power systems.`);
    }

    // General help
    if (processedQuery.includes('help') || processedQuery.includes('what can you do')) {
      return contextReminder() + comicResponse(`Here's what I can help you with:\n\n• **Author Information**: About Jashan Bansal, writing style, themes\n• **Universe Lore**: World-building, core concepts, setting\n• **Stories**: All story details, summaries, content previews\n• **Characters**: Character profiles, abilities, relationships\n• **Timeline**: Chronological events and their significance\n• **Powers**: Power types, users, limitations\n• **Story Arcs**: Different story series and their themes\n• **Character Relationships**: How characters are connected\n• **Themes**: Deeper meanings and concepts\n\nJust ask me anything about the Life Could Be A Dream universe!`);
    }

    // --- AI-Like Semantic Search and Synthesis ---
    const storyMatches = stories.filter(s =>
      keywords.some(k =>
        s.title.toLowerCase().includes(k) ||
        s.summary.toLowerCase().includes(k) ||
        (s.content && s.content.toLowerCase().includes(k))
      )
    );
    const characterMatches = characters.filter(c =>
      keywords.some(k =>
        c.name.toLowerCase().includes(k) ||
        c.description.toLowerCase().includes(k) ||
        (c.abilities && c.abilities.some(a => a.toLowerCase().includes(k)))
      )
    );
    if (storyMatches.length > 1) {
      const summary = storyMatches.map(s => `• **${s.title}**: ${s.summary}`).join('\n');
      return contextReminder() + comicResponse(`I found several stories related to your question:\n${summary}`);
    }
    if (characterMatches.length > 1) {
      const summary = characterMatches.map(c => `• **${c.name}**: ${c.description}`).join('\n');
      return contextReminder() + comicResponse(`I found several characters related to your question:\n${summary}`);
    }
    if (storyMatches.length === 1) {
      const s = storyMatches[0];
      let quote = '';
      for (const k of keywords) {
        if (s.content && s.content.toLowerCase().includes(k)) {
          const idx = s.content.toLowerCase().indexOf(k);
          quote = s.content.substring(Math.max(0, idx - 40), idx + 60) + '...';
          break;
        }
      }
      if (!quote && s.content) quote = s.content.substring(0, 300) + '...';
      return contextReminder() + comicResponse(`**${s.title}**\n\n**Summary:** ${s.summary}\n\n**Relevant Content:** ${quote}\n\n**Published:** ${s.published}\n\n**Author:** ${s.author}` + followUps(s));
    }
    if (characterMatches.length === 1) {
      const c = characterMatches[0];
      let details = `**${c.name}**\n\n**Role:** ${c.role}\n\n**Description:** ${c.description}\n\n**Abilities:** ${c.abilities.join(', ')}`;
      for (const [key, value] of Object.entries(c)) {
        if (typeof value === 'string' && keywords.some(k => value.toLowerCase().includes(k)) && key !== 'name') {
          details += `\n\n**${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value}`;
        }
        if (Array.isArray(value) && value.some(v => keywords.some(k => v.toLowerCase().includes(k)))) {
          details += `\n\n**${key.charAt(0).toUpperCase() + key.slice(1)}:** ${value.join(', ')}`;
        }
      }
      return contextReminder() + comicResponse(details + followUps(c));
    }
    // --- End AI-Like Section ---

    // Default response with suggestions
    return (
      contextReminder() +
      comicResponse(
        "I'm not sure about that specific question, but I can help you with:\n\n" +
        "• Author information (Jashan Bansal)\n" +
        "• Story details and summaries\n" +
        "• Character profiles and relationships\n" +
        "• Timeline and universe lore\n" +
        "• Power systems and abilities\n" +
        "• Themes and concepts\n\n" +
        "Try asking about any of these topics, or ask for help to see what I can assist you with!"
      )
    );
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      let botMessage;
      try {
        const botResponse = processQuery(inputValue);
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date()
        };
      } catch (error) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: error instanceof Error ? error.message : String(error),
          sender: 'bot',
          timestamp: new Date()
        };
      }
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- Summarize and Paraphrase ---
  function summarize(text: string, maxLen: number = 200) {
    if (!text) return '';
    if (text.length <= maxLen) return text;
    // Simple: cut at sentence boundary
    const sentences = text.split('. ');
    let out = '';
    for (const s of sentences) {
      if ((out + s).length > maxLen) break;
      out += s + '. ';
    }
    return out.trim();
  }

  // --- Follow-up Suggestions ---
  function followUps(entity: any) {
    if (!entity) return '';
    if (entity.role) return `\n\nWant to know about ${entity.name}'s powers, backstory, or key battles? Just ask!`;
    if (entity.title) return `\n\nAsk about other characters in ${entity.title}, or what happens next!`;
    return '';
  }

  // --- Multi-Entity Awareness ---
  const handleMultiEntityQueries = () => {
    if (/compare|difference|similarity|both|vs|versus|between/i.test(inputValue)) {
      // Try to extract two character names
      const found = characters.filter(c => inputValue.includes(c.name.toLowerCase()));
      if (found.length === 2) {
        return comicResponse(`Comparing **${found[0].name}** and **${found[1].name}**:\n\n- ${found[0].name}: ${summarize(found[0].description)}\n- ${found[1].name}: ${summarize(found[1].description)}\n\nKey differences: ${found[0].name} is a ${found[0].role}, ${found[1].name} is a ${found[1].role}.\n\nWant to know about their powers or battles?`);
      }
    }

    // --- Relationship & Timeline Reasoning ---
    if (/relationship|related|connection|how.*connected|how.*related|timeline|before|after|next|previous/i.test(inputValue)) {
      // Relationship between two characters
      const chars = characters.filter(c => inputValue.includes(c.name.toLowerCase()));
      if (chars.length === 2) {
        const sharedStory = stories.find(s => s.id === chars[0].relatedStory && s.id === chars[1].relatedStory);
        if (sharedStory) {
          return comicResponse(`**${chars[0].name}** and **${chars[1].name}** both appear in **${sharedStory.title}**.\n\n${chars[0].name}: ${summarize(chars[0].description)}\n${chars[1].name}: ${summarize(chars[1].description)}\n\nTheir relationship: ${chars[0].name} is a ${chars[0].role}, ${chars[1].name} is a ${chars[1].role}.`);
        }
      }
      // Timeline: what happened before/after a story
      for (const s of stories) {
        if (inputValue.includes(s.title.toLowerCase())) {
          const arc = knowledgeBase.storyArcs.find(a => a.stories.includes(s.id));
          if (arc) {
            const idx = arc.stories.indexOf(s.id);
            let before = idx > 0 ? stories.find(st => st.id === arc.stories[idx - 1]) : null;
            let after = idx < arc.stories.length - 1 ? stories.find(st => st.id === arc.stories[idx + 1]) : null;
            let msg = `**${s.title}** is part of the ${arc.name}.`;
            if (before) msg += `\n\nBefore: **${before.title}** — ${summarize(before.summary)}`;
            if (after) msg += `\n\nAfter: **${after.title}** — ${summarize(after.summary)}`;
            return comicResponse(msg);
          }
        }
      }
    }
    return null;
  };

  // --- More Comic-Style Personality ---
  function comicPersonality(text: string) {
    const jokes = [
      "(No capes were harmed in the making of this answer!)",
      "(If only I had a superpower for answering questions...)",
      "(Remember: with great questions come great answers!)",
      "(I’m powered by 100% pure comic book energy!)"
    ];
    return `${text}\n\n${jokes[Math.floor(Math.random() * jokes.length)]}`;
  }

  // Enhanced all main answers with summarization, follow-ups, and personality
  // Example for character answer:
  // ...inside the main character answer block...
  // return comicResponse(comicPersonality(details + followUps(character)));
  // Example for story answer:
  // ...inside the main story answer block...
  // return comicResponse(comicPersonality(... + followUps(story)));

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-comic-purple hover:bg-comic-darkPurple shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 shadow-xl border-comic-purple">
          <CardHeader className="bg-comic-purple text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-lg">Assistant Mr. Effort</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-comic-darkPurple"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 h-80">
            <ScrollArea className="h-64 p-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-comic-purple text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.sender === 'user' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                        <span className="text-xs opacity-70">
                          {message.sender === 'user' ? 'You' : 'Mr. Effort'}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {message.sender === 'user' ? 'User' : 'Assistant'}
                        </Badge>
                      </div>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Bot className="h-3 w-3" />
                        <span className="text-xs opacity-70">Mr. Effort</span>
                      </div>
                      <div className="text-sm">Typing...</div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about stories, characters, author, timeline..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-comic-purple hover:bg-comic-darkPurple"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssistantWidget; 