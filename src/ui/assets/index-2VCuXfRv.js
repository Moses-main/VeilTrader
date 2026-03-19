(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})(),new class{constructor(){this.activeTab=`dashboard`,this.wallet=null,this.init()}init(){this.render(),this.setupEventListeners(),this.startDataLoop()}setupEventListeners(){document.addEventListener(`click`,e=>{if(e.target.closest(`[data-tab]`)){let t=e.target.closest(`[data-tab]`).dataset.tab;this.switchTab(t)}e.target.closest(`[data-connect]`)&&this.connectWallet(),e.target.closest(`[data-trade]`)&&this.executeTrade()}),document.addEventListener(`input`,e=>{e.target.id===`trade-amount`&&this.updatePreview()})}switchTab(e){this.activeTab=e,document.querySelectorAll(`[data-tab]`).forEach(t=>{t.classList.toggle(`text-white`,t.dataset.tab===e),t.classList.toggle(`text-[#71717a]`,t.dataset.tab!==e),t.classList.toggle(`bg-[#6366f1]/10`,t.dataset.tab===e)}),document.querySelectorAll(`[data-content]`).forEach(t=>{t.classList.toggle(`hidden`,t.dataset.content!==e)});let t={dashboard:{title:`Dashboard`,subtitle:`AI Trading at Light Speed`},trade:{title:`Trade`,subtitle:`Execute swaps on Base`},integrations:{title:`Integrations`,subtitle:`22 prize tracks unlocked`},ai:{title:`AI Analysis`,subtitle:`Intelligence redefined`},prizes:{title:`Prizes`,subtitle:`$93,000 in prizes`},api:{title:`API`,subtitle:`Developer tools`}};document.getElementById(`page-title`).textContent=t[e]?.title||`Dashboard`,document.getElementById(`page-subtitle`).textContent=t[e]?.subtitle||``}connectWallet(){window.ethereum?window.ethereum.request({method:`eth_requestAccounts`}).then(e=>{this.wallet=e[0],this.renderWallet()}).catch(console.error):alert(`Please install MetaMask to use VeilTrader`)}renderWallet(){let e=document.getElementById(`connect-btn`),t=document.getElementById(`wallet-info`),n=document.getElementById(`wallet-address`);this.wallet&&(e.classList.add(`hidden`),t.classList.remove(`hidden`),n.textContent=this.wallet.slice(0,6)+`...`+this.wallet.slice(-4))}async executeTrade(){let e=document.getElementById(`token-from`).value,t=document.getElementById(`token-to`).value,n=document.getElementById(`trade-amount`).value;if(!n||parseFloat(n)<=0){this.showToast(`Enter valid amount`,`error`);return}this.showToast(`Trade executing...`,`info`),setTimeout(()=>{this.showToast(`Swapped ${n} ${e} → ${t}`,`success`),this.addActivity(`${e} → ${t}`,n)},1500)}updatePreview(){let e=document.getElementById(`trade-amount`).value,t=document.getElementById(`trade-preview`);t&&(t.textContent=e?`≈ $${(parseFloat(e)*3200).toFixed(2)}`:`—`)}showToast(e,t=`info`){let n=document.getElementById(`toast-container`);if(!n)return;let r=document.createElement(`div`);r.className=`${{success:`bg-green-500/20 border-green-500/50 text-green-400`,error:`bg-red-500/20 border-red-500/50 text-red-400`,info:`bg-accent-500/20 border-accent-500/50 text-accent-400`}[t]} border px-4 py-2 rounded-lg text-sm glass animate-fade-in`,r.textContent=e,n.appendChild(r),setTimeout(()=>{r.style.opacity=`0`,r.style.transform=`translateX(100%)`,setTimeout(()=>r.remove(),300)},3e3)}addActivity(e,t){let n=document.getElementById(`activity-feed`);if(!n)return;let r=document.createElement(`div`);for(r.className=`flex items-center gap-3 p-3 bg-white/5 rounded-lg animate-fade-in`,r.innerHTML=`
      <div class="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs">
        ⚡
      </div>
      <div class="flex-1">
        <div class="text-sm font-medium">${e}</div>
        <div class="text-xs text-[#71717a]">${new Date().toLocaleTimeString()}</div>
      </div>
      <div class="text-accent-400 text-sm">${t}</div>
    `,n.insertBefore(r,n.firstChild);n.children.length>10;)n.removeChild(n.lastChild)}startDataLoop(){setInterval(()=>{this.updateStats(),this.updateCharts()},3e3)}updateStats(){let e=document.getElementById(`eth-price`);e&&(e.textContent=`$${(3200+Math.random()*100-50).toFixed(2)}`)}updateCharts(){}render(){document.getElementById(`app`).innerHTML=this.html(),this.initCharts()}initCharts(){}html(){return`
    <div class="min-h-screen bg-[#050508]">
      <!-- Toast Container -->
      <div id="toast-container" class="fixed top-4 right-4 z-50 flex flex-col gap-2"></div>
      
      <!-- Navigation -->
      <nav class="fixed left-0 top-0 h-full w-16 bg-[#0d0d12]/80 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-6 z-40">
        <div class="mb-8">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            V
          </div>
        </div>
        
        <div class="flex flex-col gap-1 flex-1">
          ${[[`dashboard`,`📊`,`Dashboard`],[`trade`,`⚡`,`Trade`],[`integrations`,`🔗`,`Integrations`],[`ai`,`🧠`,`AI`],[`prizes`,`🏆`,`Prizes`],[`api`,`⚙️`,`API`]].map(([e,t,n])=>`
            <button data-tab="${e}" 
              class="w-12 h-12 rounded-xl flex items-center justify-center text-lg transition-all duration-200
              ${this.activeTab===e?`bg-accent-500/20 text-white`:`text-[#71717a] hover:bg-white/5 hover:text-white`}"
              title="${n}">
              ${t}
            </button>
          `).join(``)}
        </div>
        
        <div class="mt-auto">
          <div class="w-10 h-10 rounded-full bg-[#18181b] flex items-center justify-center text-xs text-[#71717a]">
            ◈
          </div>
        </div>
      </nav>
      
      <!-- Main Content -->
      <main class="ml-16 min-h-screen">
        <!-- Header -->
        <header class="sticky top-0 z-30 bg-[#050508]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 id="page-title" class="text-xl font-semibold">Dashboard</h1>
            <p id="page-subtitle" class="text-xs text-[#71717a]">AI Trading at Light Speed</p>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 px-3 py-1.5 bg-[#18181b] rounded-full text-xs text-[#71717a]">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Base Sepolia
            </div>
            
            <button id="connect-btn" data-connect 
              class="px-4 py-2 bg-accent-500 hover:bg-accent-600 rounded-lg text-sm font-medium transition-colors">
              Connect Wallet
            </button>
            
            <div id="wallet-info" class="hidden flex items-center gap-2 px-3 py-2 bg-[#18181b] rounded-lg text-sm">
              <span id="wallet-address" class="font-mono text-[#71717a]">0x...</span>
              <div class="w-5 h-5 rounded-full bg-gradient-to-br from-accent-400 to-purple-500"></div>
            </div>
          </div>
        </header>
        
        <!-- Dashboard Content -->
        <section data-content="dashboard" class="p-8 ${this.activeTab===`dashboard`?``:`hidden`}">
          <!-- Stats Grid -->
          <div class="grid grid-cols-4 gap-4 mb-8">
            ${this.statCard(`Total Trades`,`1,247`,`+12 today`,`📊`)}
            ${this.statCard(`Portfolio`,`$12,450`,`+2.3%`,`💰`,`text-green-400`)}
            ${this.statCard(`Win Rate`,`72%`,`Last 30 days`,`🎯`,`text-accent-400`)}
            ${this.statCard(`Active Agents`,`1`,`Connected`,`🤖`)}
          </div>
          
          <!-- Main Grid -->
          <div class="grid grid-cols-3 gap-6">
            <!-- Price Chart -->
            <div class="col-span-2 glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="font-medium text-white">ETH/USDC Price</h3>
                  <p id="eth-price" class="text-2xl font-semibold text-gradient">$3,214.50</p>
                </div>
                <div class="flex gap-2">
                  <button class="px-3 py-1 text-xs bg-accent-500/20 text-accent-400 rounded-full">1H</button>
                  <button class="px-3 py-1 text-xs text-[#71717a] hover:text-white">24H</button>
                  <button class="px-3 py-1 text-xs text-[#71717a] hover:text-white">7D</button>
                </div>
              </div>
              <div class="h-48 flex items-end gap-1">
                ${Array.from({length:24},(e,t)=>`
                  <div class="flex-1 bg-accent-500/60 rounded-t transition-all duration-300 hover:bg-accent-400"
                    style="height: ${30+Math.random()*70}%"></div>
                `).join(``)}
              </div>
            </div>
            
            <!-- Quick Trade -->
            <div class="glass rounded-2xl p-6">
              <h3 class="font-medium text-white mb-4">Quick Trade</h3>
              <div class="space-y-4">
                <div class="flex gap-2">
                  <select id="token-from" class="flex-1 bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-sm">
                    <option>ETH</option>
                    <option>USDC</option>
                    <option>WETH</option>
                  </select>
                  <input id="trade-amount" type="number" placeholder="0.0" step="0.01"
                    class="flex-1 bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-sm placeholder-[#71717a]">
                </div>
                
                <div class="flex justify-center">
                  <div class="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 cursor-pointer hover:bg-accent-500/30">
                    ↓
                  </div>
                </div>
                
                <div class="flex gap-2">
                  <select id="token-to" class="flex-1 bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-sm">
                    <option>USDC</option>
                    <option>ETH</option>
                    <option>WETH</option>
                  </select>
                  <div id="trade-preview" class="flex-1 bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#71717a] flex items-center">
                    —
                  </div>
                </div>
                
                <button data-trade class="w-full py-3 bg-gradient-to-r from-accent-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Execute Trade
                </button>
              </div>
            </div>
            
            <!-- Activity Feed -->
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-medium text-white">Recent Activity</h3>
                <span class="flex items-center gap-1.5 text-xs text-green-400">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Live
                </span>
              </div>
              <div id="activity-feed" class="space-y-2 max-h-64 overflow-y-auto">
                <div class="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div class="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs">⚡</div>
                  <div class="flex-1">
                    <div class="text-sm">ETH → USDC</div>
                    <div class="text-xs text-[#71717a]">2 min ago</div>
                  </div>
                  <div class="text-accent-400 text-sm">+$24.50</div>
                </div>
                <div class="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div class="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs">⚡</div>
                  <div class="flex-1">
                    <div class="text-sm">USDC → ETH</div>
                    <div class="text-xs text-[#71717a]">5 min ago</div>
                  </div>
                  <div class="text-green-400 text-sm">+$12.30</div>
                </div>
              </div>
            </div>
            
            <!-- AI Insight -->
            <div class="glass rounded-2xl p-6">
              <h3 class="font-medium text-white mb-4">AI Insight</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[#71717a] text-sm">Action</span>
                  <span class="text-green-400 font-medium">BUY</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[#71717a] text-sm">Confidence</span>
                  <span class="text-accent-400">87%</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-[#71717a] text-sm">Risk</span>
                  <span class="text-yellow-400">Low</span>
                </div>
                <div class="pt-2 border-t border-white/10">
                  <p class="text-xs text-[#71717a] leading-relaxed">
                    Strong momentum detected in ETH/BTC pair. AI models signal bullish breakout pattern with 87% confidence.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Connections -->
            <div class="glass rounded-2xl p-6">
              <h3 class="font-medium text-white mb-4">Connections</h3>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-[#18181b] rounded-lg p-3 text-center">
                  <div class="text-xl mb-1">🤖</div>
                  <div class="text-xs text-[#71717a]">Agents</div>
                  <div class="text-white font-medium">1</div>
                </div>
                <div class="bg-[#18181b] rounded-lg p-3 text-center">
                  <div class="text-xl mb-1">🔗</div>
                  <div class="text-xs text-[#71717a]">Integrations</div>
                  <div class="text-white font-medium">22</div>
                </div>
                <div class="bg-[#18181b] rounded-lg p-3 text-center">
                  <div class="text-xl mb-1">👤</div>
                  <div class="text-xs text-[#71717a]">Users</div>
                  <div class="text-white font-medium">0</div>
                </div>
                <div class="bg-[#18181b] rounded-lg p-3 text-center">
                  <div class="text-xl mb-1">⛓️</div>
                  <div class="text-xs text-[#71717a]">Contract</div>
                  <div class="text-white font-medium text-xs">0x0c74...</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <!-- Other Content Sections (simplified) -->
        ${this.renderOtherSections()}
      </main>
    </div>
    `}statCard(e,t,n,r,i=`text-green-400`){return`
      <div class="glass rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-[#71717a]">${e}</span>
          <span class="text-sm">${r}</span>
        </div>
        <div class="text-2xl font-semibold text-white mb-1">${t}</div>
        <div class="${i} text-xs">${n}</div>
      </div>
    `}renderOtherSections(){return`
    <!-- Trade Section -->
    <section data-content="trade" class="p-8 ${this.activeTab===`trade`?``:`hidden`}">
      <div class="max-w-2xl mx-auto">
        <div class="glass rounded-2xl p-8">
          <h2 class="text-xl font-medium mb-6">Execute Trade</h2>
          <div class="space-y-6">
            ${[`Buy`,`Sell`].map(e=>`
              <div class="flex gap-4">
                <div class="flex-1">
                  <label class="text-xs text-[#71717a] mb-2 block">${e} Token</label>
                  <select class="w-full bg-[#18181b] border border-white/10 rounded-lg px-4 py-3">
                    <option>ETH</option>
                    <option>USDC</option>
                    <option>WETH</option>
                  </select>
                </div>
                <div class="flex-1">
                  <label class="text-xs text-[#71717a] mb-2 block">Amount</label>
                  <input type="number" placeholder="0.0" class="w-full bg-[#18181b] border border-white/10 rounded-lg px-4 py-3 placeholder-[#71717a]">
                </div>
              </div>
            `).join(``)}
            <button data-trade class="w-full py-4 bg-gradient-to-r from-accent-500 to-purple-500 rounded-xl font-medium">
              Execute Trade
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Integrations Section -->
    <section data-content="integrations" class="p-8 ${this.activeTab===`integrations`?``:`hidden`}">
      <div class="grid grid-cols-4 gap-4">
        ${Array.from({length:22},(e,t)=>`
          <div class="glass rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-400">
                ${[`🔗`,`🤖`,`🧠`,`💰`,`🔐`,`🌐`][t%6]}
              </div>
              <span class="text-sm font-medium">Integration ${t+1}</span>
            </div>
            <div class="text-xs text-[#71717a]">Prize track available</div>
          </div>
        `).join(``)}
      </div>
    </section>
    
    <!-- AI Section -->
    <section data-content="ai" class="p-8 ${this.activeTab===`ai`?``:`hidden`}">
      <div class="max-w-3xl mx-auto space-y-4">
        ${[`Bankr`,`Gemini`,`DeepSeek`,`Groq`].map((e,t)=>`
          <div class="glass rounded-xl p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full ${t===0?`bg-green-500/20 text-green-400`:`bg-[#18181b] text-[#71717a]`} flex items-center justify-center">
                ${[`⚡`,`✨`,`🔮`,`🚀`][t]}
              </div>
              <span class="font-medium">${e}</span>
            </div>
            <span class="text-xs px-2 py-1 rounded-full ${t===0?`bg-green-500/20 text-green-400`:`bg-[#18181b] text-[#71717a]`}">
              ${t===0?`Active`:`Standby`}
            </span>
          </div>
        `).join(``)}
      </div>
    </section>
    
    <!-- Prizes Section -->
    <section data-content="prizes" class="p-8 ${this.activeTab===`prizes`?``:`hidden`}">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-semibold text-gradient mb-2">$93,058.96</h2>
        <p class="text-[#71717a]">Available in 22 prize tracks</p>
      </div>
      <div class="grid grid-cols-4 gap-4">
        ${Array.from({length:8},(e,t)=>`
          <div class="glass rounded-xl p-4 text-center">
            <div class="text-xs text-[#71717a] mb-1">Track ${t+1}</div>
            <div class="text-lg font-medium text-accent-400">$${(1e3+t*500).toLocaleString()}</div>
          </div>
        `).join(``)}
      </div>
    </section>
    
    <!-- API Section -->
    <section data-content="api" class="p-8 ${this.activeTab===`api`?``:`hidden`}">
      <div class="max-w-2xl mx-auto space-y-4">
        <div class="glass rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 bg-accent-500/20 text-accent-400 text-xs rounded">POST</span>
            <code class="text-sm">/api/trade/execute</code>
          </div>
          <p class="text-xs text-[#71717a]">Execute a trade on Base Sepolia</p>
        </div>
        <div class="glass rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">GET</span>
            <code class="text-sm">/api/ai/analysis</code>
          </div>
          <p class="text-xs text-[#71717a]">Get AI market analysis</p>
        </div>
        <div class="glass rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">GET</span>
            <code class="text-sm">/api/portfolio</code>
          </div>
          <p class="text-xs text-[#71717a]">Get portfolio data</p>
        </div>
      </div>
    </section>
    `}};