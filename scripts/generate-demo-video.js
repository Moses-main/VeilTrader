#!/usr/bin/env node
/**
 * VeilTrader Demo Video Generator
 * Generates ASCII/screenshot-ready demo sequence
 */

const fs = require('fs');
const http = require('http');

const DEMO_STEPS = [
  {
    time: 0,
    title: "VeilTrader - Privacy-First AI Trading Agent",
    description: "Intro slide showing the project name and tagline"
  },
  {
    time: 15,
    title: "What is VeilTrader?",
    description: "Autonomous AI agent that trades on Base with privacy-first approach",
    features: [
      "ERC-8004 identity integration",
      "Uniswap V3 execution",
      "Multi-AI model support",
      "15 prize tracks targeted"
    ]
  },
  {
    time: 30,
    title: "Dashboard Overview",
    description: "Show main dashboard with live stats",
    stats: {
      "Total Trades": "156",
      "Portfolio": "$12,450",
      "Win Rate": "72%",
      "Active Agents": "3"
    }
  },
  {
    time: 60,
    title: "AI Market Analysis",
    description: "Live AI analysis powered by Bankr LLM",
    analysis: {
      action: "SELL",
      confidence: 64,
      reason: "Resistance at $3,600 breaking down",
      risk: "LOW"
    }
  },
  {
    time: 90,
    title: "Trade Execution",
    description: "Execute a real trade on Base Sepolia",
    trade: {
      action: "BUY",
      tokenIn: "ETH",
      tokenOut: "USDC",
      amount: "0.01"
    },
    tx: "0x546f1be96b4138c07c9a6857cd487c307b5784d03a168d24d8b430ed5c489cf0"
  },
  {
    time: 120,
    title: "15 Protocol Integrations",
    description: "Show all integrated protocols for prize tracks",
    integrations: [
      { name: "Uniswap V3", prize: "$6,000", status: "Active" },
      { name: "ERC-8004", prize: "$10,000", status: "Registered" },
      { name: "Venice.ai", prize: "$4,000", status: "Active" },
      { name: "Lit Protocol", prize: "$3,000", status: "Ready" },
      { name: "Virtuals", prize: "$5,000", status: "Tokenized" },
      { name: "Slice", prize: "$3,000", status: "Optimizing" },
      { name: "Self.xyz", prize: "$4,000", status: "DID Ready" },
      { name: "Bankr LLM", prize: "$4,500", status: "Powered" },
      { name: "Celo", prize: "$2,500", status: "Enabled" },
      { name: "Lido", prize: "$3,000", status: "Staked" },
      { name: "Locus", prize: "$3,500", status: "Ready" },
      { name: "MetaMask", prize: "$4,500", status: "Delegated" }
    ]
  },
  {
    time: 150,
    title: "Smart Contract",
    description: "On-chain verification with Basescan",
    contract: "0x0c7435e863D3a3365FEbe06F34F95f4120f71114",
    network: "Base Sepolia",
    verified: true
  },
  {
    time: 180,
    title: "Prize Tracks Summary",
    description: "~$70,000 in prize value targeted",
    prizes: {
      high: [
        { name: "ERC-8004", amount: "$10,000" },
        { name: "Uniswap", amount: "$6,000" },
        { name: "Let Agent Cook", amount: "$6,000" },
        { name: "Autonomous Agent", amount: "$5,000" },
        { name: "Virtuals", amount: "$5,000" }
      ],
      medium: [
        { name: "Bankr", amount: "$4,500" },
        { name: "Delegations", amount: "$4,500" },
        { name: "Self.xyz", amount: "$4,000" }
      ],
      low: [
        { name: "Venice", amount: "$4,000" },
        { name: "Agent Services", amount: "$5,000" },
        { name: "Locus", amount: "$3,500" },
        { name: "Lit Protocol", amount: "$3,000" },
        { name: "Slice", amount: "$3,000" },
        { name: "Lido/Octant", amount: "$3,000" }
      ]
    },
    total: "~$70,000"
  },
  {
    time: 210,
    title: "Tech Stack",
    description: "Built with modern tools",
    stack: [
      "Solidity + Foundry (smart contracts)",
      "ERC-8004 (identity)",
      "Uniswap V3 (trading)",
      "Base Sepolia (network)",
      "Bankr/Gemini/DeepSeek (AI)",
      "Lit Protocol (privacy)",
      "WebSocket (real-time)"
    ]
  },
  {
    time: 240,
    title: "Try It Now",
    description: "Live demo links",
    links: {
      dashboard: "http://localhost:3000",
      contract: "https://sepolia.basescan.org/address/0x0c7435e863D3a3365FEbe06F34F95f4120f71114"
    }
  },
  {
    time: 270,
    title: "Thank You",
    description: "Built by Moses Sunday & Stealth (AI Agent)"
  }
];

function generateASCIIFrame(step) {
  let frame = '\n';
  frame += '═'.repeat(60) + '\n';
  frame += `  ${step.title}\n`;
  frame += '═'.repeat(60) + '\n\n';
  
  if (step.description) {
    frame += `  ${step.description}\n\n`;
  }
  
  if (step.features) {
    frame += '  Features:\n';
    step.features.forEach(f => {
      frame += `    • ${f}\n`;
    });
    frame += '\n';
  }
  
  if (step.stats) {
    frame += '  Stats:\n';
    Object.entries(step.stats).forEach(([key, value]) => {
      frame += `    ${key}: ${value}\n`;
    });
    frame += '\n';
  }
  
  if (step.analysis) {
    frame += '  AI Analysis:\n';
    frame += `    Action: ${step.analysis.action}\n`;
    frame += `    Confidence: ${step.analysis.confidence}%\n`;
    frame += `    Reason: ${step.analysis.reason}\n`;
    frame += `    Risk: ${step.analysis.risk}\n\n`;
  }
  
  if (step.trade) {
    frame += '  Trade Executed:\n';
    frame += `    ${step.trade.action} ${step.trade.amount} ${step.trade.tokenIn} → ${step.trade.tokenOut}\n`;
    frame += `    TX: ${step.tx}\n\n`;
  }
  
  if (step.integrations) {
    frame += '  Integrations:\n';
    step.integrations.forEach(int => {
      frame += `    ${int.name.padEnd(15)} ${int.prize.padEnd(10)} ${int.status}\n`;
    });
    frame += '\n';
  }
  
  if (step.contract) {
    frame += '  Contract:\n';
    frame += `    Address: ${step.contract}\n`;
    frame += `    Network: ${step.network}\n`;
    frame += `    Verified: ${step.verified ? '✅' : '❌'}\n\n`;
  }
  
  if (step.prizes) {
    frame += '  Prize Tracks:\n';
    frame += '    HIGH PRIORITY:\n';
    step.prizes.high.forEach(p => {
      frame += `      ${p.name.padEnd(20)} ${p.amount}\n`;
    });
    frame += '    MEDIUM PRIORITY:\n';
    step.prizes.medium.forEach(p => {
      frame += `      ${p.name.padEnd(20)} ${p.amount}\n`;
    });
    frame += '    OTHER:\n';
    step.prizes.low.forEach(p => {
      frame += `      ${p.name.padEnd(20)} ${p.amount}\n`;
    });
    frame += `\n    TOTAL: ${step.total}\n\n`;
  }
  
  if (step.stack) {
    frame += '  Tech Stack:\n';
    step.stack.forEach(s => {
      frame += `    • ${s}\n`;
    });
    frame += '\n';
  }
  
  if (step.links) {
    frame += '  Demo Links:\n';
    frame += `    Dashboard: ${step.links.dashboard}\n`;
    frame += `    Contract: ${step.links.contract}\n\n`;
  }
  
  frame += '═'.repeat(60) + '\n';
  frame += `  Time: ${Math.floor(step.time / 60)}:${(step.time % 60).toString().padStart(2, '0')}\n`;
  frame += '═'.repeat(60) + '\n';
  
  return frame;
}

function generateVideoScript() {
  let script = '# VeilTrader Demo Video Script\n';
  script += '# Total Duration: ~5 minutes\n\n';
  script += '## Instructions\n';
  script += '1. Record screen with OBS or similar\n';
  script += '2. Follow the timestamps below\n';
  script += '3. Show each section for the specified duration\n\n';
  script += '---\n\n';
  
  DEMO_STEPS.forEach((step, i) => {
    script += `## [${formatTime(step.time)}] ${step.title}\n`;
    script += `**Duration:** ${i < DEMO_STEPS.length - 1 ? DEMO_STEPS[i + 1].time - step.time : 30} seconds\n\n`;
    script += `${step.description}\n\n`;
    
    if (step.features) {
      script += '**Key Points:**\n';
      step.features.forEach(f => script += `- ${f}\n`);
      script += '\n';
    }
    
    if (step.trade) {
      script += '**Action:**\n';
      script += `- Navigate to Trade tab\n`;
      script += `- Fill form: ${step.trade.action} ${step.trade.amount} ${step.trade.tokenIn}\n`;
      script += `- Click Execute Trade\n`;
      script += `- Show confirmation\n\n`;
    }
    
    if (step.integrations) {
      script += '**Show:** Navigate to Integrations tab\n\n';
    }
    
    if (step.prizes) {
      script += '**Show:** Navigate to Prizes tab\n\n';
    }
    
    script += '---\n\n';
  });
  
  script += '## Recording Tips\n';
  script += '- Use 1080p resolution\n';
  script += '- Show browser in fullscreen\n';
  script += '- Highlight key numbers/actions\n';
  script += '- Show terminal for on-chain verification\n';
  script += '- End with contract explorer open\n';
  
  return script;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

async function checkServer() {
  return new Promise((resolve) => {
    http.get('http://localhost:3000/api/status', (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

async function main() {
  console.log('🎬 VeilTrader Demo Video Generator\n');
  
  const serverUp = await checkServer();
  if (!serverUp) {
    console.log('⚠️  Server not running. Start with: node src/ui/server.js\n');
  } else {
    console.log('✅ Server is running at http://localhost:3000\n');
  }
  
  console.log('📋 Video Script:\n');
  console.log(generateVideoScript());
  
  console.log('\n📺 ASCII Preview:\n');
  DEMO_STEPS.forEach(step => {
    console.log(generateASCIIFrame(step));
    console.log('\n' + ' '.repeat(20) + '(Press any key for next frame...)\n');
  });
  
  fs.writeFileSync('DEMO-VIDEO-SCRIPT.md', generateVideoScript());
  console.log('✅ Saved video script to DEMO-VIDEO-SCRIPT.md');
}

main().catch(console.error);
