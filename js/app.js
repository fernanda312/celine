// CELINE — shared frontend logic: Supabase client, account, cart, settings,
// group banner. No Google sign-in anywhere. No password is ever stored here.
(function(){
  var cfg = window.CELINE_CONFIG || {};
  var configured = cfg.SUPABASE_URL && cfg.SUPABASE_URL !== "SUPABASE_URL" && cfg.SUPABASE_ANON_KEY && cfg.SUPABASE_ANON_KEY !== "SUPABASE_ANON_KEY";
  var sb = null;
  if (configured && window.supabase) {
    sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  }
  window.celine = {
    configured: configured,
    supabase: sb,
    // ---- cart (local until checkout; the order itself lives in Supabase) ----
    getCart: function(){
      try { return JSON.parse(localStorage.getItem("celine-cart") || "[]"); }
      catch (e) { return []; }
    },
    saveCart: function(cart){
      localStorage.setItem("celine-cart", JSON.stringify(cart));
      window.celine.updateCartCount();
    },
    addToCart: function(id, qty){
      var cart = window.celine.getCart();
      var found = cart.find(function(i){ return i.id === id; });
      if (found) found.qty += (qty || 1); else cart.push({id: id, qty: qty || 1});
      window.celine.saveCart(cart);
    },
    // Nobody adds to the cart without an account. Without a session,
    // the item is remembered and the visitor is sent to create or
    // start a session; conta.html adds the remembered item after
    // sign-in and then goes to the cart.
    requireAccountForCart: async function(id, qty){
      var session = await window.celine.getSession();
      if (!session) {
        try { localStorage.setItem("celine-pending-add", JSON.stringify({id: id, qty: qty || 1})); } catch (e) {}
        window.celine.savePending("cart", "carrinho.html");
        location.href = "conta.html";
        return false;
      }
      window.celine.addToCart(id, qty);
      return true;
    },
    updateCartCount: function(){
      var n = window.celine.getCart().reduce(function(s, i){ return s + i.qty; }, 0);
      document.querySelectorAll(".cart-count").forEach(function(el){ el.textContent = n; });
    },
    // ---- pending intent: cart/chat intent saved BEFORE account, resumed after ----
    savePending: function(kind, target){
      localStorage.setItem("celine-pending", JSON.stringify({kind: kind, target: target || "carrinho.html", at: Date.now()}));
    },
    takePending: function(){
      try {
        var p = JSON.parse(localStorage.getItem("celine-pending") || "null");
        localStorage.removeItem("celine-pending");
        return p;
      } catch (e) { return null; }
    },
    // ---- account ----
    getSession: async function(){
      if (!sb) return null;
      var r = await sb.auth.getSession();
      return r.data.session || null;
    },
    // Sign-in: if the email is not found, go to create-account prefilled.
    // This is the "account created automatically" flow: sign-up is the same
    // page, same email + password, no verification, no Google.
    signIn: async function(email, password){
      var r = await sb.auth.signInWithPassword({email: email, password: password});
      if (r.error) {
        var msg = (r.error.message || "").toLowerCase();
        if (msg.indexOf("invalid login credentials") !== -1 || msg.indexOf("user not found") !== -1 || msg.indexOf("email not confirmed") !== -1) {
          return {notFound: true};
        }
        return {error: r.error.message};
      }
      return {session: r.data.session};
    },
    signUp: async function(email, password, whatsapp){
      var r = await sb.auth.signUp({email: email, password: password});
      if (r.error) return {error: r.error.message};
      // With "Confirm email" OFF, sign-up returns a session directly.
      // If it does not, sign in immediately with the same credentials.
      var session = r.data.session;
      if (!session) {
        var s2 = await sb.auth.signInWithPassword({email: email, password: password});
        if (s2.error) return {needsOwnerStep: true, detail: s2.error.message};
        session = s2.data.session;
      }
      if (session && whatsapp) {
        await sb.from("profiles").upsert({id: session.user.id, email: email, whatsapp: whatsapp});
      }
      return {session: session};
    },
    signOut: async function(){
      if (sb) await sb.auth.signOut();
      location.href = "index.html";
    },
    // ---- site settings (admin-editable; logo/hero/texts/group link) ----
    getSettings: async function(){
      if (!sb) return null;
      var r = await sb.from("site_settings").select("*").eq("id", 1).maybeSingle();
      return r.data || null;
    },
    applySettings: async function(){
      var s = await window.celine.getSettings();
      if (!s) return null;
      document.querySelectorAll("img.site-logo").forEach(function(img){ if (s.logo_url) img.src = s.logo_url; });
      var heroImg = document.querySelector("[data-hero-img]");
      if (heroImg && s.hero_image_url) heroImg.src = s.hero_image_url;
      var heroTitle = document.querySelector("[data-hero-title]");
      if (heroTitle && s.hero_title) heroTitle.textContent = s.hero_title;
      var heroText = document.querySelector("[data-hero-text]");
      if (heroText && s.hero_text) heroText.textContent = s.hero_text;
      var storeText = document.querySelector("[data-store-text]");
      if (storeText && s.store_text) storeText.textContent = s.store_text;
      var howText = document.querySelector("[data-how-text]");
      if (howText && s.how_text) howText.textContent = s.how_text;
      var deliveryText = document.querySelector("[data-delivery-text]");
      if (deliveryText && s.delivery_text) deliveryText.textContent = s.delivery_text;
      var trustText = document.querySelector("[data-trust-text]");
      if (trustText && s.trust_text) trustText.textContent = s.trust_text;
      document.querySelectorAll("[data-group-link]").forEach(function(a){ if (s.whatsapp_group_url) a.href = s.whatsapp_group_url; });
      return s;
    },
    // ---- group banner: after a long time on the site, or on scroll ----
    initGroupBanner: async function(){
      var banner = document.getElementById("group-banner");
      if (!banner) return;
      var s = await window.celine.getSettings();
      var delayMs = (s && s.group_banner_delay_seconds ? s.group_banner_delay_seconds : 90) * 1000;
      var scrollPct = (s && s.group_banner_scroll_percent ? s.group_banner_scroll_percent : 70);
      var shown = false;
      function show(){
        if (shown) return; shown = true;
        banner.style.display = "block";
        var link = banner.querySelector("[data-group-link]");
        if (link && s && s.whatsapp_group_url) link.href = s.whatsapp_group_url;
      }
      setTimeout(show, delayMs);
      window.addEventListener("scroll", function(){
        var h = document.documentElement;
        var pct = h.scrollTop / Math.max(1, (h.scrollHeight - h.clientHeight)) * 100;
        if (pct >= scrollPct) show();
      }, {passive: true});
    }
  };
  document.addEventListener("DOMContentLoaded", function(){
    window.celine.updateCartCount();
    window.celine.applySettings();
    window.celine.initGroupBanner();
    document.querySelectorAll("[data-add]").forEach(function(btn){
      btn.addEventListener("click", async function(){
        var ok = await window.celine.requireAccountForCart(btn.getAttribute("data-add"), 1);
        if (!ok) return;
        var old = btn.textContent;
        btn.textContent = "Adicionado ao carrinho ✓";
        setTimeout(function(){ btn.textContent = old; }, 1800);
      });
    });
    // Header account link state.
    window.celine.getSession().then(function(session){
      document.querySelectorAll("[data-account-link]").forEach(function(a){
        a.textContent = session ? "A minha conta" : "Conta";
        a.href = "conta.html";
      });
      document.querySelectorAll("[data-chat-link]").forEach(function(a){
        a.addEventListener("click", function(e){
          if (!session) {
            e.preventDefault();
            window.celine.savePending("chat", "chat.html");
            location.href = "conta.html";
          }
        });
      });
    });
  });
})();
